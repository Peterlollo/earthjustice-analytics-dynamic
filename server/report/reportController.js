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

module.exports = {
  getDataWrapper: function (req, res, next) {
    res.locals.org = 'earthjustice'
    res.locals.path = req.query.path || 'earthjustice.org/'
    res.locals.daysAgo = req.query.daysAgo || 2
    next()
  },
  getData: function (req, res, next) {
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      ['https://www.googleapis.com/auth/analytics.readonly'], // an array of auth scopes
      null
    )
    const org = res.locals.org
    const path = req.query.path
    const daysAgo = Number(req.query.daysAgo)
    const options = {path, daysAgo, org}
    const request = helpers.initRequest(options)
    // initialize first report request with pageToken set to '0'
    helpers.makeReportRequest(jwtClient, request, helpers.storeReportData, '0', res, next, options)
  },
  pollData: function (req, res, next) {
    let pageToken = helpers.pageToken
    let reportData = helpers.reportData
    let rows = helpers.rows
    res.send({pageToken, reportData, rows})
  }
}
