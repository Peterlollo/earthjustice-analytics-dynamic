var reportController = require('../report/reportController.js')
var whitelistController = require('../whitelist/whitelistController.js')

module.exports = function (app, express) {
  // app.get('/api/data', reportController.sendData)
  app.get('/api/dataDynamic', reportController.getAnalyticsDataDynamic, reportController.sendDataDynamic)
  // app.get('/api/fetchMoreData', reportController.getAnalyticsData, reportController.sendData)
  app.post('/api/whitelist/addProvider', whitelistController.addProvider)
  // app.post('/api/providers/changeSector', providerController.sectorChange)
  app.get('/api/data/providers', reportController.getProviders, reportController.sendProviders)
}
