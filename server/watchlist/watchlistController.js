const db = require('../db')

module.exports = {
  addProvider: (req, res, next) => {
    const name = req.body.name
    const text = 'SELECT * from watchlist where provider = $1'
    db.query(text, [name])
      .then(res => {
        let alreadyWatchlisted = res.rows[0]
        if (!alreadyWatchlisted && (name !== null)) { // only add provider to list if it isn't already in list
          db.query('INSERT INTO watchlist(provider) VALUES($1)', [name])
            .then(result => next())
            .catch(e => console.error(e.stack))
        }
      })
      .catch(e => console.error(e.stack))
  },
  removeProvider: (req, res, next) => {
    const name = req.body.name
    db.query('DELETE FROM watchlist WHERE provider = $1', [name])
      .then(result => next())
      .catch(e => console.error(e.stack))
  },
  sendWatchlist: (req, res, next) => {
    db.query('SELECT * from watchlist')
      .then(result => res.send(result.rows))
      .catch(e => console.error(e))
  }
}
