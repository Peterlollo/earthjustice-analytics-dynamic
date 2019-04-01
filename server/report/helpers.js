const db = require('../db')
const {google} = require('googleapis')
const analytics = google.analyticsreporting('v4')
const whitelist = {}
const schools = ['Universities and Colleges', 'K-12 Schools']
db.query('SELECT * from whitelist')
  .then(result => {
    result.rows.forEach((el) => {
      // filter out Universities, colleges, and k-12 as per request by Christian Anthony at earthjustice
      if (schools.indexOf(el.sector) === -1) {
        whitelist[el.provider] = {sector: el.sector}
      }
    })
  })
  .catch(e => console.error(e))

// ********* helper function: returns keyProvider data to earthjustice *********
// *****************************************************************************
const keyProviderData = (requestPath) => {
  let whiteProviders = whitelist
  let rows = module.exports.rows
  let reportProviders = []
  let providerSessions = {}
  for (let i = 0; i < rows.length; i++) {
    const rowDimensions = rows[i].dimensions
    const provider = rowDimensions[0]
    const path = rowDimensions[1]
    // add providerSessions
    providerSessions[provider] = providerSessions[provider] || {}
    providerSessions[provider][path] = true
    if (reportProviders.indexOf(provider) === -1 && providerSessions[provider][requestPath]) {
      // provider is not already added
      // and provider has visited the path that was sent in the request
      reportProviders.push(provider)
    }
  }

  let keyProviders = reportProviders.filter((p) => {
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
  rows: [],
  reportData: {},
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
      module.exports.reportData = {}
      module.exports.rows = []
      // module.exports.reportData.providers = []
      // module.exports.reportData.path = ''
      // module.exports.reportData.providerSessions = {}
      // authorize request
      module.exports.authorize(jwtClient, request, storeReportData, res, next, options)
    } else if (pageToken) { // page token > zero: i.e. there's still data to collect
      module.exports.authorize(jwtClient, request, storeReportData, res, next, options)
    } else { // pageToken is undefined, i.e. reports are finished
      if (options.org === 'earthjustice') {
        // only send data if the request was for ej internal use
        // otherwise, the front-end app will poll for data collection
        let path = res.locals.path
        let report = keyProviderData(path)
        let daysAgo = res.locals.daysAgo
        res.send({path, daysAgo, report})
      }
    }
  },
  // create initial request body for data
  initRequest: function (options) {
    let days = 2
    const metrics = [{expression: 'ga:timeOnPage'}]
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
    module.exports.reportData = report
    if (report.data && report.data.rows) {
      module.exports.rows = module.exports.rows.concat(report.data.rows)
    }
  }
}
