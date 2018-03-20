/**
 * 用于配置MySQL连接以及输出目录的配置文件
 */

var path = require('path')

module.exports = {
  mysql: {
    host: 'MySQL地址',
    port: '端口',
    user: '用户名',
    password: '密码',
    // 数据库名字
    database: '数据库',
  },
  option: {
    // 文件输出目录，需要事先手动创建
    output: path.join(__dirname, '输出路径')
  }
}