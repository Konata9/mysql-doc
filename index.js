var config = require('./config/config')
var MySQLlDoc = require('./src/mysql-doc')

var mysqlDoc = new MySQLlDoc(config)

mysqlDoc.openConnection()
  .then(() => {
    return mysqlDoc.getTableLists()
  })
  .then(() => {
    return mysqlDoc.getTableStructure()
  }).then(() => {
    return mysqlDoc.makeDoc(config.option.output)
  }).then(() => {
    mysqlDoc.closeConnection()
  }).catch(err => {
    throw new Error(err)
  })