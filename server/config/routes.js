var reportController = require('../report/reportController.js')
var whitelistController = require('../whitelist/whitelistController.js')

module.exports = function (app, express) {
  app.get('/api/test', function (req, res, next) { res.send('test passed') })
  // external JSON
  app.get('/api/paths/ejdata', reportController.getDataWrapper, reportController.getData)
  // paths
  app.get('/api/paths/data', reportController.getData)
  app.get('/api/paths/pollData', reportController.pollData)
  // providers
  app.get('/api/providers/data', reportController.getData)
  app.get('/api/providers/pollData', reportController.pollData)
  //whitelist
  app.get('/api/whitelist/data', whitelistController.sendWhitelist)
  app.post('/api/whitelist/addProvider', whitelistController.addProvider, whitelistController.sendWhitelist)
  app.post('/api/whitelist/removeProvider', whitelistController.removeProvider, whitelistController.sendWhitelist)
}
