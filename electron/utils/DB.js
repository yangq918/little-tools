

var mysql=require('mysql');


var db = function(){

};
db.init = function (opt) {
    this.connection = mysql.createConnection(opt);
};
db.search = function () {
    var conn = this.connection;
    conn.connect(function (err) {
        if (err) {
            console.error('error connecting:' + err.stack)
        }
        console.log('connected as id ' + conn);
    })

    conn.query('SELECT * FROM tables limit 1', function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is:', results);
    });
    conn.end();
};

db.allDataBases = function(callBack) {
    let conn = this.connection;
    conn.connect(function (err) {
        if (err) {
            console.error('error connecting:' + err.stack)
        }
        console.log('connected as id ' + conn);
    })
    conn.query('select SCHEMA_NAME from SCHEMATA', function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is:', results.length);
        let result = [];
        for(let i=0;i<results.length;i++)
        {
            result.push(results[i].SCHEMA_NAME);
        }
        callBack(result);

    });
    conn.end();
};


db.dataBasesDetail = function(opt,callBack) {
    let conn = this.connection;
    conn.connect(function (err) {
        if (err) {
            console.error('error connecting:' + err.stack)
        }
        console.log('connected as id ' + conn);
    });
    let sql = 'select t1.TABLE_NAME,t2.COLUMN_NAME,t2.ORDINAL_POSITION,t2.DATA_TYPE,t2.COLUMN_TYPE,t2.COLUMN_COMMENT,t2.IS_NULLABLE,t2.COLUMN_DEFAULT,t2.EXTRA from TABLES t1,COLUMNS t2 where t1.TABLE_SCHEMA = \''+opt.selectDataBase+'\' and t1.TABLE_TYPE = \'BASE TABLE\' and t1.TABLE_SCHEMA = t2.TABLE_SCHEMA and t1.TABLE_NAME = t2.TABLE_NAME order by t2.TABLE_NAME,t2.ORDINAL_POSITION';
    conn.query(sql, function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is:', results.length);
        let result = {};
        for(let i=0;i<results.length;i++)
        {
            let obj = {};
            obj.tableName = results[i].TABLE_NAME;
            obj.columnName = results[i].COLUMN_NAME;
            obj.ordinalPosition = results[i].ORDINAL_POSITION;
            obj.dataType = results[i].DATA_TYPE;
            obj.columnType = results[i].COLUMN_TYPE;
            obj.columnComment = results[i].COLUMN_COMMENT;
            obj.isNullAble = results[i].IS_NULLABLE;
            obj.columnDefault=results[i].COLUMN_DEFAULT;
            obj.extra=results[i].EXTRA;

            let columns = result[obj.tableName];
            if(null==columns)
            {
                columns = [];
            }
            columns.push(obj);
            result[obj.tableName] = columns;
        }
        callBack(result);

    });
    conn.end();
};



db.showCreateSql = function(opt,callBack) {
    let conn = this.connection;
    conn.connect(function (err) {
        if (err) {
            console.error('error connecting:' + err.stack)
        }
        console.log('connected as id ' + conn);
    });
    let newTables = opt.newTables;
    let sql = "";
    newTables.forEach(value => {
        sql = sql + "SHOW CREATE TABLE "+ value + " ;";
    });
    let singleFlag = newTables.length<=1;
    conn.query(sql, function (error, results, fields) {
        if (error) throw error;
        let result = [];
        for(let i=0;i<results.length;i++)
        {
            console.log(results[i]);
            let creatSql = singleFlag?results[i]["Create Table"]: results[i][0]["Create Table"];
            if(creatSql.indexOf('AUTO_INCREMENT=')!=-1)
            {
                creatSql = creatSql.replace(/AUTO_INCREMENT=[0-9]+/,'');
            }

            result.push(creatSql);
        }
        callBack(result);

    });
    conn.end();
};



module.exports = db;


