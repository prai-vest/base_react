const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';

function getDb(dbName = 'ech') {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
      if (err) reject(err);
      console.log('connected');
      resolve({
        client,
        db: client.db(dbName),
      });
    });
  });
}

module.exports = getDb;
