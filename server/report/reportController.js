const Provider = require('../provider/provider.js')
const Page = require('../page/page.js')
const Session = require('../session/session.js')
const Pageview = require('../pageview/pageview.js')
const helpers = require('./helpers')
const {google} = require('googleapis')
const env = process.env.NODE_ENV || 'dev'
let key = {}

if (env === 'dev') {
  key = require('../config/googleKey.json')
} else {
  key.client_email = process.env.GOOGLE_KEY_CLIENT_EMAIL
  key.private_key = process.env.GOOGLE_KEY_PRIVATE_KEY.replace(/\\n/g, '\n')
}

const request = helpers.initRequest()
const makeReportRequest = helpers.makeReportRequest
const storeReportData = helpers.storeReportData
const requestDynamic = helpers.initRequestDynamic()
const makeReportRequestDynamic = helpers.makeReportRequestDynamic
const storeReportDataDynamic = helpers.storeReportDataDynamic

module.exports = {
  getAnalyticsData: function (req, res, next) {
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      ['https://www.googleapis.com/auth/analytics.readonly'], // an array of auth scopes
      null
    )
    // initialize first report request with pageToken set to '0'
    makeReportRequest(jwtClient, request, storeReportData, '0', next)
  },
  getAnalyticsDataDynamic: function (req, res, next) {
    // const request = helpers.initRequestDynamic()
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      ['https://www.googleapis.com/auth/analytics.readonly'], // an array of auth scopes
      null
    )
    // initialize first report request with pageToken set to '0'
    makeReportRequestDynamic(jwtClient, requestDynamic, storeReportDataDynamic, '0', res, next)
  },
  sendDataDynamic: function (req, res, next) {
    res.send(res.locals.totalReportDataDynamic)
  },
  sendData: function (req, res, next) {
    Provider.findAll().then((providers) => {
      Page.findAll().then((pages) => {
        Session.findAll().then((sessions) => {
          Pageview.findAll().then((pageviews) => {
            res.send({providers, pages, sessions, pageviews})
          })
        })
      })
    })
  }
}
