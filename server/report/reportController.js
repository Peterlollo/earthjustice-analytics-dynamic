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
// const requestDynamic = helpers.initRequestDynamic()
const makeReportRequestDynamic = helpers.makeReportRequestDynamic
const storeReportDataDynamic = helpers.storeReportDataDynamic

module.exports = {
  getAnalyticsDataDynamic: function (req, res, next) {
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      ['https://www.googleapis.com/auth/analytics.readonly'], // an array of auth scopes
      null
    )
    console.log('req.query.path >>>>>>>>>>>>', req.query.path)
    // console.log('req.params.path >>>>>>>>>>>>', req.params.path)
    const path = req.query.path
    // const pathWithSlash = `path${/}`
    // initialize first report request with pageToken set to '0'
    const requestDynamic = helpers.initRequestDynamic(path)
    makeReportRequestDynamic(jwtClient, requestDynamic, storeReportDataDynamic, '0', res, next)
  },
  sendDataDynamic: function (req, res, next) {
    res.send(res.locals.totalReportDataDynamic)
  }
}
