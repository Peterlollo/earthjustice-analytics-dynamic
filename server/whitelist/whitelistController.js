const db = require('../db')

module.exports = {
  addProvider: (req, res, next) => {
    const name = req.body.name
    const sector = req.body.sector
    const text = 'SELECT * from watchlist where provider = $1'
    db.query(text, [name])
      .then(res => {
        let alreadyWhitelisted = res.rows[0]
        if (!alreadyWhitelisted && (name !== null)) { // only add provider to list if it isn't already in list
          db.query('INSERT INTO whitelist(provider, sector) VALUES($1, $2)', [name, sector])
            .then(result => next())
            .catch(e => console.error(e.stack))
        }
      })
      .catch(e => console.error(e.stack))
  },
  removeProvider: (req, res, next) => {
    const name = req.body.name
    db.query('DELETE FROM whitelist WHERE provider = $1', [name])
      .then(result => next())
      .catch(e => console.error(e.stack))
  },
  sendWhitelist: (req, res, next) => {
    db.query('SELECT * from whitelist')
      .then(result => res.send(result.rows))
      .catch(e => console.error(e))
  }
}
