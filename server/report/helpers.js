const {google} = require('googleapis')
const analytics = google.analyticsreporting('v4')

const totalReportDataDynamic = {
  providers: [],
  path: '',
  providerSessions: {
  // 'united states senate': [5, 247, 3], 'amazon': [33], <provider>: <providerSessions>
  }
}
let totalReportDataProviders = []

module.exports = {
  authorize: function (jwtClient, request, storeReportData, res, next, dataRequest) {
    jwtClient.authorize(function (err, tokens) {
      if (err) {
        console.log('ERROR WITH JWT AUTH:', err)
      }
      analytics.reports.batchGet({resource: request, auth: jwtClient}, function (err, resp) {
        if (err) {
          console.log('ERROR WITH REPORT BATCH-GET: ', err)
        } else {
          let report = resp.data.reports[0]
          const options = {dataRequest}
          storeReportData(report, res, options)
          module.exports.makeReportRequest(jwtClient, request, storeReportData, report.nextPageToken, res, next, dataRequest)
        }
      })
    })
  },
  makeReportRequest: function (jwtClient, request, storeReportData, pageToken, res, next, dataRequest) {
    if (pageToken === '0') {
      // on first request, empty report data objects of old report data
      totalReportDataProviders = []
      totalReportDataDynamic.providers = []
      totalReportDataDynamic.path = ''
      totalReportDataDynamic.providerSessions = {}
    }

    if (pageToken) {
      request.reportRequests[0].pageToken = pageToken
      module.exports.authorize(jwtClient, request, storeReportData, res, next, dataRequest)
    } else {
      console.log('REPORT REQUESTS FINISHED')
      next() // pass control to next route-defined function once all reports are requested
    }
  },
  // create initial request body for data
  initRequest: function (options) {
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
        if (options.dataRequest === 'providers') {
          if (totalReportDataProviders.indexOf(provider) === -1) {
            totalReportDataProviders.push(provider)
          }
        } else if (options.dataRequest === 'paths') {
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
    }
    res.locals.totalReportData = options.dataRequest === 'providers' ? totalReportDataProviders : totalReportDataDynamic
  }
}
