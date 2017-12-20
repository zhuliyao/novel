var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var CONN_DB_STR = "mongodb://47.94.208.182:27017/zhuliyao";


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