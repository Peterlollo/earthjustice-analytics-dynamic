const fs = require('fs')
const whitelistFile = './whitelist.json'
const whitelistSectorsFile = './whitelist-sectors.json'
const whitelist = require(whitelistFile)
const whitelistSectors = require(whitelistSectorsFile)

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
    const sector = req.body.sector
    whitelist[name] = {sector: sector}
    writeFile('./server/whitelist/whitelist.json', JSON.stringify(whitelist, null, 2), res, next)
  },
  removeProvider: (req, res, next) => {
    const name = req.body.name
    delete whitelist[name]
    writeFile('./server/whitelist/whitelist.json', JSON.stringify(whitelist, null, 2), res, next)
  },
  sendWhitelist: (req, res, next) => {
    res.send({whitelist, whitelistSectors})
  }
}
