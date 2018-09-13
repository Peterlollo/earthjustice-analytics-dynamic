const fs = require('fs')
const watchlistFile = './watchlist.json'
const watchlist = require(watchlistFile)

const writeFile = (fileName, json, res, next) => {
  fs.writeFile(fileName, json, function (err) {
    if (err) {
      console.log(err)
      res.sendStatus(500)
    } else {
      next()
    }
  })
}

module.exports = {
  addProvider: (req, res, next) => {
    const name = req.body.name
    let providers = watchlist['providers']
    let index = providers.indexOf(name)
    if ((index === -1) && (name !== null)) { // only add provider to list if it isn't already in list
      providers.push(name)
    }
    writeFile('./server/watchlist/watchlist.json', JSON.stringify(watchlist, null, 2), res, next)
  },
  removeProvider: (req, res, next) => {
    const name = req.body.name
    let providers = watchlist['providers']
    let index = providers.indexOf(name)
    if (index !== -1) { // only remove provider from list if it is already in list
      providers.splice(index, 1)
    }
    writeFile('./server/watchlist/watchlist.json', JSON.stringify(watchlist, null, 2), res, next)
  },
  sendWatchlist: (req, res, next) => {
    res.send({watchlist})
  }
}
