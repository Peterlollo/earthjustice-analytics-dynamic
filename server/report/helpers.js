const {google} = require('googleapis')
const analytics = google.analyticsreporting('v4')

const totalReportDataDynamic = {
  providers: {
    // 'united states senate': [
    // 'earthjustice.org/',
    // 'earthjustice.org/about/staff'
    // ]
    // (keys are provider names and each provider name is stored only once;
    // values is an array of strings representing pages visited)
  },
  pages: {
    // 'earthjustice.org/': {
    // 'united states senate': [5, 247, 3],
    // 'amazon': [33]
    // (keys are path names and each path name is only stored once;
    // values are objects with { providerName: [time on page per session/visit] };
    // time on page per session is an array of "visits" represented by # of seconds per visit)
  }
}
module.exports = {
  // recursively generate report requests until pageToken === undefined
  makeReportRequestDynamic: function (jwtClient, request, storeReportDataDynamic, pageToken, res, next) {
    if (pageToken === '0') {
      // on first request, empty report data object of old report data
      totalReportDataDynamic.providers = {}
      totalReportDataDynamic.pages = {}
    }

    if (pageToken) {
      request.reportRequests[0].pageToken = pageToken
      module.exports.authorizeDynamic(jwtClient, request, storeReportDataDynamic, res, next)
    } else {
      next() // pass control to next route-defined function once all reports are requested
    }
  },
  // authorize jwt client, send report request to GA api, call storeData method once report is received
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
  // create initial request body
  initRequestDynamic: function (path) {
    // TODO: filter this request by input ga:pagePath
    console.log('path in initRequestDynamic>>>>>>>>>>> ', path)
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
    if(rows) {
      for (let i = 0; i < rows.length; i++) {
        const rowDimensions = rows[i].dimensions
        const provider = rowDimensions[providerIndex]
        const path = rowDimensions[pathIndex]
        const rowMetrics = rows[i].metrics[0].values
        const timeOnPage = Number(rowMetrics[timeOnPageIndex])

        // add Provider
        totalReportDataDynamic.providers[provider] = totalReportDataDynamic.providers[provider] || []
        totalReportDataDynamic.providers[provider] = totalReportDataDynamic.providers[provider].concat(path)
        // add Page
        totalReportDataDynamic.pages[path] = totalReportDataDynamic.pages[path] || {}
        totalReportDataDynamic.pages[path][provider] = totalReportDataDynamic.pages[path][provider] || []
        totalReportDataDynamic.pages[path][provider] = totalReportDataDynamic.pages[path][provider].concat(timeOnPage)
      }
    }
    res.locals.totalReportDataDynamic = totalReportDataDynamic
  }
}
