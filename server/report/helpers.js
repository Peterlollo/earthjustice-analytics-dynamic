const pageviewController = require('../pageview/pageviewController.js')
const Provider = require('../provider/provider.js')
const Page = require('../page/page.js')
const Session = require('../session/session.js')
const {google} = require('googleapis')
const analytics = google.analyticsreporting('v4')

const totalReportDataDynamic = {
  providers: {
    // keys are provider names
    // each provider name stored only once
    // value is an object that shows pages visited
    // so value is an array of strings that represent path names [ 'path1', 'path2', etc.]
    // thus, on front end, we can see which pages a given provider visited
    // then can find those pages in the "pages" object below, find the provider, and find the time on page
  },
  pages: {
    // keys are path names
    // so each path name is only stored once
    // value is an object with { providerName: cumulativeTimeOnPage }
    // cumulativeTimeOnPage could either be one number, or an array of "visits" that are just #of seconds
    // array of visits looks like [5, 247, 3, etc...]
    // <path name>: <id>
  },
  filters: {
    // TODO: erase this b/c not currently being used in application
    // first must remove all references to "filters" from front end app code
  },
  sessions: {
    // TODO: add sessions if needed by front end app
    // Could have keys which are providerID's, with a value that is an array of all session dates for that provider
    // <providerId(foreign key from providers)>: {id: <id>, date: <date>}
  },
  pageviews: {
    // <pageId(foreign key from pages)>: {id: <id>, sessionId: (foreign key from sessions), providerId: (foreign key from pages), seconds: <timeOnPage>, date: <date>}
  }
}

module.exports = {
  // recursively generate report requests until pageToken === undefined
  makeReportRequest: function (jwtClient, request, storeReportData, pageToken, next) {
    if (pageToken) {
      request.reportRequests[0].pageToken = pageToken
      module.exports.authorize(jwtClient, request, storeReportData, next)
    } else {
      next() // pass control to next route-defined function once all reports are requested
    }
  },
  // authorize jwt client, send report request to GA api, call storeData method once report is received
  authorize: function (jwtClient, request, storeReportData, next) {
    jwtClient.authorize(function (err, tokens) {
      if (err) {
        console.log('ERROR WITH JWT AUTH:', err)
      }
      analytics.reports.batchGet({resource: request, auth: jwtClient}, function (err, resp) {
        if (err) {
          console.log('ERROR WITH REPORT BATCH-GET: ', err)
        } else {
          let report = resp.data.reports[0]
          storeReportData(report)
          module.exports.makeReportRequest(jwtClient, request, storeReportData, report.nextPageToken, next)
          console.log('REPORT REQUESTS FINISHED')
        }
      })
    })
  },
  // recursively generate report requests until pageToken === undefined
  makeReportRequestDynamic: function (jwtClient, request, storeReportDataDynamic, pageToken, res, next) {
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
  initRequestDynamic: function () {
    // TODO: filter this request by input ga:pagePath
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
            }
          ]
        }
      ]
    }
    return request
  },
  // create initial request body
  initRequest: function () {
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
    const dateIndex = dimensions.indexOf('ga:date')
    const timeOnPageIndex = metrics.indexOf('ga:timeOnPage')
    const rows = report.data.rows

    // add report data to DB
    for (let i = 0; i < rows.length; i++) {
      const rowDimensions = rows[i].dimensions
      const provider = rowDimensions[providerIndex]
      const path = rowDimensions[pathIndex]
      const rowMetrics = rows[i].metrics[0].values
      const date = rowDimensions[dateIndex]
      const timeOnPage = Number(rowMetrics[timeOnPageIndex])

      // add Provider
      totalReportDataDynamic.providers[provider] = totalReportDataDynamic.providers[provider] || []
      totalReportDataDynamic.providers[provider] = totalReportDataDynamic.providers[provider].concat(path)
      // add Page
      totalReportDataDynamic.pages[path] = totalReportDataDynamic.pages[path] || {}
      totalReportDataDynamic.pages[path][provider] = totalReportDataDynamic.pages[path][provider] || []
      totalReportDataDynamic.pages[path][provider] = totalReportDataDynamic.pages[path][provider].concat(timeOnPage)
    }
    res.locals.totalReportDataDynamic = totalReportDataDynamic
  },
  // store received GA report in DB
  storeReportData: function (report) {
    // report headers
    const dimensions = report.columnHeader.dimensions
    const metrics = report.columnHeader.metricHeader.metricHeaderEntries.map((m) => m.name)

    // indices of variables within rows
    const providerIndex = dimensions.indexOf('ga:networkLocation')
    const pathIndex = dimensions.indexOf('ga:pagePath')
    const dateIndex = dimensions.indexOf('ga:date')
    const timeOnPageIndex = metrics.indexOf('ga:timeOnPage')
    const rows = report.data.rows

    // add report data to DB
    for (let i = 0; i < rows.length; i++) {
      const rowDimensions = rows[i].dimensions
      const provider = rowDimensions[providerIndex]
      const path = rowDimensions[pathIndex]
      const rowMetrics = rows[i].metrics[0].values
      const date = rowDimensions[dateIndex]
      const timeOnPage = Number(rowMetrics[timeOnPageIndex])

      // add Provider
      Provider.findOrCreate({where: {name: provider}})
        .then(() => { // add Page
          Page.findOrCreate({where: {path: path}})
            .then(() => { // add Session
              Provider.findOrCreate({where: {name: provider}}) // search Providers for a match
                .spread((providerFound) => { // format date
                  const searchDate = date.slice(0, 4) + '-' + date.slice(4, 6) + '-' + date.slice(6, 8)
                  Session.findOrCreate({where: {provider: providerFound.id, date: searchDate}})
                }).then(() => { // add Pageview
                  pageviewController.addPageview(provider, path, date, timeOnPage)
                })
            })
        })
    }
  }
}
