const {google} = require('googleapis')
const analytics = google.analyticsreporting('v4')

const totalReportDataDynamic = {
  providers: [],
  path: '',
  providerSessions: {
  // 'united states senate': [5, 247, 3], 'amazon': [33]
  }
}
let totalReportDataProviders = []

module.exports = {
  //  FOR PROVIDERS: recursively generate report requests until pageToken === undefined
  makeReportRequestProviders: function (jwtClient, request, storeReportDataProviders, pageToken, res, next) {
    if (pageToken === '0') {
      // on first request, empty report data object of old report data
      totalReportDataProviders = []
    }

    if (pageToken) {
      request.reportRequests[0].pageToken = pageToken
      module.exports.authorizeProviders(jwtClient, request, storeReportDataProviders, res, next)
    } else {
      console.log('REPORT REQUESTS FINISHED')
      next() // pass control to next route-defined function once all reports are requested
    }
  },
  // FOR Providers: authorize jwt client, send report request to GA api, call storeData method once report is received
  authorizeProviders: function (jwtClient, request, storeReportDataProviders, res, next) {
    jwtClient.authorize(function (err, tokens) {
      if (err) {
        console.log('ERROR WITH JWT AUTH:', err)
      }
      analytics.reports.batchGet({resource: request, auth: jwtClient}, function (err, resp) {
        if (err) {
          console.log('ERROR WITH REPORT BATCH-GET: ', err)
        } else {
          let report = resp.data.reports[0]
          storeReportDataProviders(report, res)
          module.exports.makeReportRequestProviders(jwtClient, request, storeReportDataProviders, report.nextPageToken, res, next)
        }
      })
    })
  },
  // FOR PATHS: authorize jwt client, send report request to GA api, call storeData method once report is received
  authorizeDynamic: function (jwtClient, request, storeReportDataDynamic, res, next) {
    jwtClient.authorize(function (err, tokens) {
      if (err) {
        console.log('ERROR WITH JWT AUTH:', err)
      }
      analytics.reports.batchGet({resource: request, auth: jwtClient}, function (err, resp) {
        if (err) {
          console.log('ERROR WITH REPORT BATCH-GET: ', err)
        } else {
          let report = resp.data.reports[0]
          storeReportDataDynamic(report, res)
          module.exports.makeReportRequestDynamic(jwtClient, request, storeReportDataDynamic, report.nextPageToken, res, next)
          console.log('REPORT REQUESTS FINISHED')
        }
      })
    })
  },
  // FOR PATHS: recursively generate report requests until pageToken === undefined
  makeReportRequestDynamic: function (jwtClient, request, storeReportDataDynamic, pageToken, res, next) {
    if (pageToken === '0') {
      // on first request, empty report data object of old report data
      totalReportDataDynamic.providers = []
      totalReportDataDynamic.path = ''
      totalReportDataDynamic.providerSessions = {}
    }

    if (pageToken) {
      request.reportRequests[0].pageToken = pageToken
      module.exports.authorizeDynamic(jwtClient, request, storeReportDataDynamic, res, next)
    } else {
      next() // pass control to next route-defined function once all reports are requested
    }
  },
  // create initial request body for page data
  initRequestDynamic: function (path) {
    const viewID = '13972743' // Google Analytics view ID
    const request = {
      reportRequests: [
        {
          viewId: viewID,
          pageToken: '0', // API pagination offset
          pageSize: 500, // Number of records to request
          dateRanges: [ // Date ranges to request data from
            {
              startDate: '2daysAgo',
              endDate: 'today'
            }
          ],
          metrics: [
            {
              expression: 'ga:timeOnPage'
            }
          ],
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
          'dimensionFilterClauses': [
            {
              'filters': [
                {
                  'dimensionName': 'ga:networkLocation',
                  'operator': 'REGEXP',
                  'not': true,
                  'expressions': '(not set|customer|internet|broadband|isp|cable com|network|tele|dsl|subscriber|pool|telecom|cable|addresses|telefonica|routed|leased line|communication|comcast|verizon|road runner|service provider|unknown|provider|t-mobile|wifi|telkom|sprint|at-t|residential|province|vodafone|clients|china|dial-up|netblock|wimax|wireless|elisa|sonera|dna oy|at&t|assigned|sl-cgn|block|consumers|kpn|telia|bredband|google|hosting|zscaler|city of|tdc|hubspot)'
                }
              ]
            },
            {
              'filters': [
                {
                  'dimensionName': 'ga:pagePath',
                  'operator': 'IN_LIST',
                  'expressions': [path, `${path}/`]
                }
              ]
            }
          ]
        }
      ]
    }
    return request
  },
  // store received GA report in DB
  storeReportDataDynamic: function (report, res) {
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

        if (totalReportDataDynamic.providers.indexOf(provider) === -1) {
          totalReportDataDynamic.providers.push(provider)
        }
        if (!totalReportDataDynamic.path) {
          totalReportDataDynamic.path = path
        }
        totalReportDataDynamic.providerSessions[provider] = totalReportDataDynamic.providerSessions[provider] || []
        totalReportDataDynamic.providerSessions[provider].push(timeOnPage)
      }
    }
    res.locals.totalReportDataDynamic = totalReportDataDynamic
  },
  // store received GA report in DB
  storeReportDataProviders: function (report, res) {
    // report headers
    const dimensions = report.columnHeader.dimensions

    // indices of variables within rows
    const providerIndex = dimensions.indexOf('ga:networkLocation')
    const rows = report.data.rows

    // add report data to DB
    if (rows) {
      for (let i = 0; i < rows.length; i++) {
        const rowDimensions = rows[i].dimensions
        const provider = rowDimensions[providerIndex]

        if (totalReportDataProviders.indexOf(provider) === -1) {
          totalReportDataProviders.push(provider)
        }
      }
    }
    res.locals.totalReportDataProviders = totalReportDataProviders
  },
  // create initial request body for providers data
  initRequestProviders: function () {
    const viewID = '13972743' // Google Analytics view ID
    const request = {
      reportRequests: [
        {
          viewId: viewID,
          pageToken: '0', // API pagination offset
          pageSize: 500, // Number of records to request
          dateRanges: [ // Date ranges to request data from
            {
              startDate: '2daysAgo',
              endDate: 'today'
            }
          ],
          dimensions: [
            {
              name: 'ga:networkLocation'
            }
          ],
          'dimensionFilterClauses': [
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
        }
      ]
    }
    return request
  }
}
