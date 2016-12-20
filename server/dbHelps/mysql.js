import dbOptions from '../../config/dbconfig';

var options = {
    'host': dbOptions.db_host,
    'port': dbOptions.db_port,
    'database': dbOptions.db_name,
    'user': dbOptions.db_user,
    'password': dbOptions.db_passwd
}

var mysql = require('mysql');
var pool = mysql.createPool(options);

//内部对mysql的封装，执行sql语句
function execQuery(sql, values, callback) {
    var errinfo;
    pool.getConnection(function(err, connection) {
        if (err) {
            // console.log(err)
            errinfo = 'DB-获取数据库连接异常！';
            throw errinfo;
        } else {
            var querys = connection.query(sql, values, function(err, rows) {
                release(connection);
                if (err) {
                    // console.log(err)
                    errinfo = 'DB-SQL语句执行错误:' + err;
                    callback(err);
                } else {
                    callback(null,rows);        //注意：第一个参数必须为null
                }
            });
        }
    });
}

function release(connection) {
    try {
        connection.release(function(error) {
            if (error) {
                console.log('DB-关闭数据库连接异常！');
            }
        });
    } catch (err) {console.log("数据库异常",err)}
}
//对外接口返回Promise函数形式
exports.getByItems = function(tablename, values){
    return new Promise(function(resolve, reject){
        // var values = {phone:phone};
        var condition = '';
        for(var key in values){
            condition += `${key} = "${values[key]}" and `
        }
        var sql = `select * from ${tablename} where ${condition.slice(0,-4)}`;
        // console.log(sql)
        execQuery(sql,[{}, {}], function(err, rows){
            if(err){
                reject(err);
            }else{
                resolve(rows);
            }
        })
    });
}
//插入新数据
exports.insert = function(tablename,items){
    return new Promise(function(resolve, reject){
        var sql = 'INSERT INTO ?? SET ?';
        execQuery(sql,[tablename, items], function(err, rows){
            if(err){

                reject(err);
            }else{
                resolve(rows);
            }
        })
    });
}
//自定义sql
exports.sqlStr = function(sqlText){
    return new Promise(function(resolve, reject){
        execQuery(sqlText,[],function(err, rows){
            if(err){
                reject(err);
            }else{
                resolve(rows);
            }
        })
    });
}
