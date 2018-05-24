var reportController = require('../report/reportController.js')
var whitelistController = require('../whitelist/whitelistController.js')

module.exports = function (app, express) {
  // paths
  app.get('/api/paths/data', reportController.getData, reportController.sendData)

  // providers
  app.get('/api/providers/data', reportController.getData, reportController.sendData)

  //whitelist
  app.get('/api/whitelist/data', whitelistController.sendWhitelist)
  app.post('/api/whitelist/addProvider', whitelistController.addProvider, whitelistController.sendWhitelist)
  app.post('/api/whitelist/removeProvider', whitelistController.removeProvider, whitelistController.sendWhitelist)
}
