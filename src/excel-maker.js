var xlsx = require('xlsx')
var option = require('./option')

function exportExcel(sheets, excelData, filePath, fileName) {
  if (!fileName) {
    var fileName = 'doc'
  }
  return new Promise((resolve, reject) => {
    // 设置 workBook
    var workBook = {
      SheetNames: sheets,
      Sheets: {}
    }

    var _header = (() => {
      var result = []
      for (var key in option.COLUMNS) {
        result.push(option.COLUMNS[key])
      }
      return result
    })()

    var header = _header.map((v, i) => Object.assign({}, { v: v, position: String.fromCharCode(65 + i) + 1 }))
      // 转换成 worksheet 需要的结构
      .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {})

    sheets.forEach((sheetName) => {
      var _data = excelData[sheetName]

      // 匹配 headers 的位置，生成对应的单元格数据
      var data = _data.map((v, i) => _header.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65 + j) + (i + 2) })))
        // 对刚才的结果进行降维处理（二维数组变成一维数组）
        .reduce((prev, next) => prev.concat(next))
        // // 转换成 worksheet 需要的结构
        .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {})

      // 合并 headers 和 data
      var output = Object.assign({}, header, data)
      var outputPos = Object.keys(output)
      var ref = outputPos[0] + ':' + outputPos[outputPos.length - 1]

      console.dir(output)

      workBook.Sheets[sheetName] = Object.assign({}, output, { '!ref': ref }
      )
    })

    xlsx.writeFile(workBook, `${filePath}/${fileName}.xlsx`);
    console.log(`${fileName}文档已经生成, 请在目录${filePath}下查看`)
    resolve()
  })
}

module.exports = exportExcel