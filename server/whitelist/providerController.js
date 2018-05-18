const Provider = require('./provider')

module.exports = {
  addProvider: (provider) => {
    Provider.findOrCreate({where: {name: provider}})
  },
  whitelistChange: (req, res, next) => {
    let important = req.body.action === 'add'
    Provider.findById(req.body.id)
      .then((p) => {
        p.update({important: important})
          .then(self => {
            res.send(self)
          })
      })
      .catch((error) => res.send(error))
  },
  sectorChange: (req, res, next) => {
    Provider.findById(req.body.id)
      .then((p) => {
        p.update({sector: req.body.sector})
          .then(self => {
            res.send(self)
          })
      })
      .catch((error) => res.send(error))
  }
}
