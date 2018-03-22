# mysql-doc
一个基于Node.js，将MySQL的表结构、索引信息导出成为Excel文档的工具。

目的在于减少人工制作文档的时间成本，直接从数据库导成文档也保证了文档与代码是同步的（只要每次数据库变动后及时导出）。

当然，由于`xlsx`的局限性。生成出的excel是没有样式的。但相对于制表的成本，添加样式应该会相对少很多（我们还可以利用宏来帮忙）。

## 相关依赖库
1. [mysql](https://github.com/mysqljs/mysql) 用于连接MySQL以及执行相关SQL语句
2. [xlsx](https://github.com/SheetJS/js-xlsx) 用于导出Excel
3. [async](https://github.com/caolan/async) 用于执行批量操作

## 使用方法
1. 下载本项目
 ```
 npm install
 ```

2. 在`config`目录下创建`config.js`并进行配置，主要是数据库连接以及输出目录的配置。可参考`config-example.js`

3. 运行项目
``` 
npm run start

或项目目录下
 node index.js
```

## 生成文档预览
![example](./example.png)

## 拓展
### 1. 输出信息的自定义
#### 1.1 表头信息修改
目前版本中输出表头信息，可以在`src/option.js`中修改值。

`option.js`中`COLUMNS`和`INDEX`对应着MySQL的`information_schema.COLUMNS`和`information_schema.STATISTICS`表。

key对应SELECT的字段，value对应抽出时的别名(AS ‘xxx'部分)。

#### 1.2 抽出字段的修改
如果需要增加或删除抽出的字段，则需要修改`src/option.js`以及`src/queryModel.js`两个文件。

其中`queryModel.js`文件是执行过程中的SQL语句文件，通过调整SELECT语句来达到修改抽出字段的目的。

#### 1.3 增加其他的表信息
根据现有需求，在目前版本中只抽出了表结构与表索引信息相关的内容。

当还需要增加其他信息时，则需要同时修改`src/option.js`、`src/queryModel.js`、`src/mysql-doc.js`、`src/excel-maker.js`四个文件。

`src/mysql-doc.js`负责处理MySQL的操作逻辑；`src/excel-maker.js`主要负责excel文件的生成。根据不同的需求，需要增加对应的逻辑。

### 2. 输出表过程中的注意点
当在一个excel的worksheet中输出多个表格时，请保证每个表格的列数一致（可以在SELECT语句中用''来补全），来确保生成出的excel数据不会丢失。
