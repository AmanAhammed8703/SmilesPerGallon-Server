const MongoClient = require('mongodb').MongoClient
const state = {
    db: null
}
module.exports.connect = function (done) {
    const url = 'mongodb+srv://smailespergallon:smilespergallon@spg.3uc1f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
    const dbname = 'smiles-per-gallon'

    MongoClient.connect(url, (err, data) => {
        if (err) return done(err)
        state.db = data.db(dbname)

        done()
    })
}

module.exports.get = function () {
    return state.db
}
