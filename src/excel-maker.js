var xlsx = require('xlsx')
var option = require('./option')

/**
 * header 为键值对象，把键值对象转为值的数组
 */
function headerFormat(header) {
  var res = []
  for (var key in header) {
    res.push(header[key])
  }
  return res
}

/**
 * 将输出到excel的header与data进行格式化统一
 * @param {*} header  headerFormat函数的返回值
 * @param {*} data  与header对应的对象
 * @param {*} startPos 开始行数，默认为0
 */
function dataCombine(_header, _data, startPos = 0) {
  var header = _header.map((v, i) => Object.assign({}, { v: v, position: String.fromCharCode(65 + i) + (1 + startPos) }))
    // 转换成 worksheet 需要的结构
    .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {})

  var data = _data.map((v, i) => _header.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65 + j) + (i + 2 + startPos) })))
    // 对刚才的结果进行降维处理（二维数组变成一维数组）
    .reduce((prev, next) => prev.concat(next), [])
    // // 转换成 worksheet 需要的结构
    .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {})

  return Object.assign({}, header, data)
}

function exportExcel(sheets, excelData, filePath, fileName = 'doc') {
  return new Promise((resolve, reject) => {
    // 设置 workBook
    var workBook = {
      SheetNames: sheets,
      Sheets: {}
    }

    sheets.forEach((sheetName) => {
      // 表结构部分
      var _tableHader = headerFormat(option.COLUMNS)
      var _tableData = excelData[sheetName]['table']

      var tableOutput = dataCombine(_tableHader, _tableData)

      // 表索引部分
      var _indexHeader = headerFormat(option.INDEX)
      var _indexData = excelData[sheetName]['index']

      // 这句话有问题
      var indexOutput = dataCombine(_indexHeader, _indexData, _tableData.length + 2)

      // // 合并 tableOutput 和 indexOutput
      var output = Object.assign({}, tableOutput, indexOutput)

      var outputPos = Object.keys(output)
      var ref = outputPos[0] + ':' + outputPos[outputPos.length - 1]
      workBook.Sheets[sheetName] = Object.assign({}, output, { '!ref': ref }
      )
    })

    try {
      xlsx.writeFile(workBook, `${filePath}/${fileName}.xlsx`);
      console.log(`${fileName}文档已经生成, 请在目录${filePath}下查看`)
      resolve()
    } catch (err) {
      reject(new Error(err))
    }
  })
}

module.exports = exportExcel