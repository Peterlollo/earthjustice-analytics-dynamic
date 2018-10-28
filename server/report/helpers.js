const {google} = require('googleapis')
const analytics = google.analyticsreporting('v4')
const whitelist = require('../whitelist/whitelist.json')

// ********* reportData format *********
// *************************************
// {
//   providers: [],
//   path: '',
//   providerSessions: {
// // // 'united states senate': {
// // // // timesOnPage: [5, 247, 3],
// // // // paths: ['earthjustice.org', 'earthjustice.org/about']
// // }
// }

// ********* helper function: returns keyProvider data to earthjustice *********
// *****************************************************************************
const keyProviderData = () => {
  let whiteProviders = whitelist
  let keyProviders = module.exports.reportData.providers.filter((p) => {
    return whiteProviders[p]
  })
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
  makeReportRequest: function (jwtClient, request, storeReportData, pageToken, res, next, options) {
    // set pageToken vals
    request.reportRequests[0].pageToken = pageToken
    module.exports.pageToken = pageToken

    if (pageToken === '0') { // i.e. first request for data
      if (options.org !== 'earthjustice') {
        // earthjustice internal data request only needs response once all data is collected
        // the app polls for data, so it needs a pageToken now to begin polling
        res.send({pageToken})
      }
      // empty report data objects of old report data
      module.exports.reportData.providers = []
      module.exports.reportData.path = ''
      module.exports.reportData.providerSessions = {}
      // authorize request
      module.exports.authorize(jwtClient, request, storeReportData, res, next, options)
    } else if (pageToken) { // page token > zero: i.e. there's still data to collect
      module.exports.authorize(jwtClient, request, storeReportData, res, next, options)
    } else { // pageToken is undefined, i.e. reports are finished
      if (options.org === 'earthjustice') {
        // only send data if the request was for ej internal use
        // otherwise, the front-end app will poll for data collection
        let report = keyProviderData()
        let path = res.locals.path
        let daysAgo = res.locals.daysAgo
        res.send({path, daysAgo, report})
      }
    }
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
    if (options.daysAgo && (typeof options.daysAgo === 'number')) {
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
        // add path
        if (!module.exports.reportData.path) {
          module.exports.reportData.path = path
        }
        // add providerSessions
        let providerSessions = module.exports.reportData.providerSessions
        providerSessions[provider] = providerSessions[provider] || {}
        providerSessions[provider]['timesOnPage'] = providerSessions[provider]['timesOnPage'] || []
        providerSessions[provider]['timesOnPage'].push(timeOnPage)
        providerSessions[provider]['paths'] = providerSessions[provider]['paths'] || []
        providerSessions[provider]['paths'].push(path)
      }
    }
  }
}
