var reportController = require('../report/reportController.js')
var whitelistController = require('../whitelist/whitelistController.js')

module.exports = function (app, express) {
  //whitelist
  app.get('/api/whitelist/data', whitelistController.sendWhitelist)
  app.post('/api/whitelist/addProvider', whitelistController.addProvider, whitelistController.sendWhitelist)
  app.post('/api/whitelist/removeProvider', whitelistController.removeProvider, whitelistController.sendWhitelist)
  // reports
  app.get('/api/reports/data', reportController.getData)
  app.get('/api/reports/pollData', reportController.pollData)
  // reports - JSON for earthjustice internal use
  app.get('/api/reports/data/ej', reportController.getDataWrapper, reportController.getData)
}
