const Sequelize = require('sequelize');
const keys = require('../config/keys');

async function init() {
    await connectDb();

    sqlDbConnection
  .authenticate()
  .then(() => {
    console.log('MYSQL Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
    
    
}

function connectDb() {
    return new Promise((resolve, reject) => {
        global.sqlDbConnection = new Sequelize(keys.sqlDb.database, keys.sqlDb.userName, keys.sqlDb.password, {
          host: keys.sqlDb.dbHost,
          dialect: 'mysql',
          dialectOptions: {
            connectTimeout: 60000
          }
        });
        resolve();
    })
}
init();