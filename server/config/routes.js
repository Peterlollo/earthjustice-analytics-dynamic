var reportController = require('../report/reportController.js')
var providerController = require('../provider/providerController.js')

module.exports = function (app, express) {
  app.get('/api/data', reportController.sendData)
  app.get('/api/dataDynamic', reportController.getAnalyticsDataDynamic, reportController.sendDataDynamic)
  app.get('/api/fetchMoreData', reportController.getAnalyticsData, reportController.sendData)
  app.post('/api/providers/changeWhitelist', providerController.whitelistChange)
  app.post('/api/providers/changeSector', providerController.sectorChange)
}
