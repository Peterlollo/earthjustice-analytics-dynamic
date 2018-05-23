const fs = require('fs')
const whitelistFile = './whitelist.json'
const whitelist = require(whitelistFile)

module.exports = {
  addProvider: (req, res, next) => {
    const name = req.body.name
    const sector = req.body.sector
    whitelist[name] = {sector: sector}
    fs.writeFile('./server/whitelist/whitelist.json', JSON.stringify(whitelist, null, 2), function (err) {
      if (err) {
        console.log(err)
        res.sendStatus(500)
      } else {
        console.log(`writing ${name} to ${whitelistFile}`)
        next()
      }
    })
  }
  // ,
  // whitelistChange: (req, res, next) => {
  //   let important = req.body.action === 'add'
  //   Provider.findById(req.body.id)
  //     .then((p) => {
  //       p.update({important: important})
  //         .then(self => {
  //           res.send(self)
  //         })
  //     })
  //     .catch((error) => res.send(error))
  // },
  // sectorChange: (req, res, next) => {
  //   Provider.findById(req.body.id)
  //     .then((p) => {
  //       p.update({sector: req.body.sector})
  //         .then(self => {
  //           res.send(self)
  //         })
  //     })
  //     .catch((error) => res.send(error))
  // }
}
