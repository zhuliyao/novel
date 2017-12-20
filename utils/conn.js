var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
// var CONN_DB_STR = "mongodb://47.94.208.182:27017/zhuliyao";
var CONN_DB_STR = "mongodb://localhost:27017/cd1706";


module.exports = {
    getDb:function(callback){
        MongoClient.connect(CONN_DB_STR,(err,db)=>{
            if(err){
                callback(err,null);
            }else{
                callback(null,db);
            }
        })
    }
}