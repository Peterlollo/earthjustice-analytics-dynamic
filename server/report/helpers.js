const {google} = require('googleapis')
const analytics = google.analyticsreporting('v4')
const whitelist = require('../whitelist/whitelist.json')
const whitelistSectors = require('../whitelist/whitelist-sectors.json')

// ********* reportData format *********
// *************************************
// const reportData = {
//   providers: [],
//   path: '',
//   providerSessions: {
//     'united states senate': [5, 247, 3],
//     'amazon': [33],
//     <provider>: <providerSessions>
//     where <providerSessions> is an array of session-time-lengths in seconds
//   }
// }

const topLevelData = () => {
  let whiteProviders = whitelist
  let keyProviders = module.exports.reportData.providers.filter((p) => {
    return whiteProviders[p]
  })
  console.log('keyProviders.length', keyProviders.length)
  let keyProvidersBySector = {}
  keyProviders.map((kp) => {
    let sector = whitelist[kp].sector
    keyProvidersBySector[sector] = keyProvidersBySector[sector] || []
    keyProvidersBySector[sector].push(kp)
  })
  let keySectorsSortedByProviderCount = Object.keys(keyProvidersBySector).sort((s1, s2) => {
    return keyProvidersBySector[s2].length - keyProvidersBySector[s1].length
  })
  let keySectorsWithProviderCount = {}
  keySectorsSortedByProviderCount.forEach((sector) => {
    keySectorsWithProviderCount[sector] = keyProvidersBySector[sector].length
  })
  return keySectorsWithProviderCount
}

module.exports = {
  pageToken: undefined,
  reportData: {
    providers: [],
    path: '',
    providerSessions: {}
  },
  authorize: function (jwtClient, request, storeReportData, res, next, options) {
    jwtClient.authorize(function (err, tokens) {
      if (err) {
        console.log('ERROR WITH JWT AUTH:', err)
      }
      analytics.reports.batchGet({resource: request, auth: jwtClient}, function (err, resp) {
        if (err) {
          console.log('ERROR WITH REPORT BATCH-GET: ', err)
        } else {
          let report = resp.data.reports[0]
          storeReportData(report, res, options)
          module.exports.makeReportRequest(jwtClient, request, storeReportData, report.nextPageToken, res, next, options)
        }
      })
    })
  },
  // TODO: can we still have a next() function? does this function continue in background?
  makeReportRequest: function (jwtClient, request, storeReportData, pageToken, res, next, options) {
    // reset pageToken inside request body to "0"
    request.reportRequests[0].pageToken = pageToken
    module.exports.pageToken = pageToken
    if (!pageToken) { // page token is undefined
      if (options.org === 'earthjustice') {
        let result = topLevelData()
        res.send(result)
      }
      console.log('REPORT REQUESTS FINISHED')
    } else if (pageToken === '0') { // first request for data
      if (options.org !== 'earthjustice') {
        res.send({pageToken})
      }
      // empty report data objects of old report data
      module.exports.reportData.providers = []
      module.exports.reportData.path = ''
      module.exports.reportData.providerSessions = {}
      // authorize request
      module.exports.authorize(jwtClient, request, storeReportData, res, next, options)
    } else { // page token is not zero, but is defined
      module.exports.authorize(jwtClient, request, storeReportData, res, next, options)
    }
    // next() // pass control to next route-defined function once all reports are requested
  },
  // create initial request body for data
  initRequest: function (options) {
    let days = 2
    const metrics = []
    const dimensionFilterClauses = [
      {
        'filters': [
          {
            'dimensionName': 'ga:networkLocation',
            'operator': 'REGEXP',
            'not': true,
            'expressions': '(not set|customer|internet|broadband|isp|cable com|network|tele|dsl|subscriber|pool|telecom|cable|addresses|telefonica|routed|leased line|communication|comcast|verizon|road runner|service provider|unknown|provider|t-mobile|wifi|telkom|sprint|at-t|residential|province|vodafone|clients|china|dial-up|netblock|wimax|wireless|elisa|sonera|dna oy|at&t|assigned|sl-cgn|block|consumers|kpn|telia|bredband|google|hosting|zscaler|city of|tdc|hubspot)'
          }
        ]
      }
    ]
    if (options.path) {
      metrics.push({expression: 'ga:timeOnPage'})
      dimensionFilterClauses.push({
        'filters': [{
          'dimensionName': 'ga:pagePath',
          'operator': 'IN_LIST',
          'expressions': [options.path, `${options.path}/`]
        }]
      })
    }
    if (options.daysAgo && (typeof(options.daysAgo) === 'number')) {
      console.log('options.daysAgo = a number')
      days = options.daysAgo
    }
    const viewID = '13972743' // Google Analytics view ID
    const request = {
      reportRequests: [
        {
          viewId: viewID,
          pageToken: '0', // API pagination offset
          pageSize: 500, // Number of records to request
          dateRanges: [ // Date ranges to request data from
          // alternative syntax: startDate: Date.parse('2016/10/01')
            {
              startDate: `${days}daysAgo`,
              endDate: 'today'
            }
          ],
          metrics: metrics,
          dimensions: [
            {
              name: 'ga:networkLocation'
            },
            {
              name: 'ga:pagePath'
            },
            {
              name: 'ga:date'
            }
          ],
          'dimensionFilterClauses': dimensionFilterClauses
        }
      ]
    }
    return request
  },
  // store received GA report inside res.locals
  storeReportData: function (report, res, options) {
    // report headers
    const dimensions = report.columnHeader.dimensions
    const metrics = report.columnHeader.metricHeader.metricHeaderEntries.map((m) => m.name)

    // indices of variables within rows
    const providerIndex = dimensions.indexOf('ga:networkLocation')
    const pathIndex = dimensions.indexOf('ga:pagePath')
    const timeOnPageIndex = metrics.indexOf('ga:timeOnPage')
    const rows = report.data.rows

    // add report data to DB
    if (rows) {
      for (let i = 0; i < rows.length; i++) {
        const rowDimensions = rows[i].dimensions
        const provider = rowDimensions[providerIndex]
        const path = rowDimensions[pathIndex]
        const rowMetrics = rows[i].metrics[0].values
        const timeOnPage = Number(rowMetrics[timeOnPageIndex])
        // add providers
        if (module.exports.reportData.providers.indexOf(provider) === -1) {
          module.exports.reportData.providers.push(provider)
        }
        if (options.path) {
          // todo: do we need this if statement?
          // add path
          if (!module.exports.reportData.path) {
            module.exports.reportData.path = path
          }
          // add providerSessions
          module.exports.reportData.providerSessions[provider] = module.exports.reportData.providerSessions[provider] || []
          module.exports.reportData.providerSessions[provider].push(timeOnPage)
        }
      }
    }
    // todo: remove this? or will we use send function and next()
    res.locals.reportData = module.exports.reportData
  }
}
