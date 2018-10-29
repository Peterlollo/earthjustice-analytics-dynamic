var reportController = require('../report/reportController.js')
var whitelistController = require('../whitelist/whitelistController.js')
var watchlistController = require('../watchlist/watchlistController.js')

module.exports = function (app, express) {
  //whitelist
  app.get('/api/whitelist/data', whitelistController.sendWhitelist)
  app.post('/api/whitelist/addProvider', whitelistController.addProvider, whitelistController.sendWhitelist)
  app.post('/api/whitelist/removeProvider', whitelistController.removeProvider, whitelistController.sendWhitelist)
  //watchlist
  app.get('/api/watchlist/data', watchlistController.sendWatchlist)
  app.post('/api/watchlist/addProvider', watchlistController.addProvider, watchlistController.sendWatchlist)
  app.post('/api/watchlist/removeProvider', watchlistController.removeProvider, watchlistController.sendWatchlist)
  // reports
  app.get('/api/reports/data', reportController.getData)
  app.get('/api/reports/pollData', reportController.pollData)
  // JSON data for earthjustice's internal use
  app.get('/api/reports/data/ej', reportController.getDataWrapper, reportController.getData)
}
