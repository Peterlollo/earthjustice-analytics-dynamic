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
  getData: function (req, res, next) {
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      ['https://www.googleapis.com/auth/analytics.readonly'], // an array of auth scopes
      null
    )
    const path = req.query.path
    const options = {path}
    const request = helpers.initRequest(options)
    const dataRequest = path ? 'paths' : 'providers'
    // initialize first report request with pageToken set to '0'
    helpers.makeReportRequest(jwtClient, request, helpers.storeReportData, '0', res, next, dataRequest)
  },
  sendData: function (req, res, next) {
    res.send(res.locals.totalReportData)
  }
}
