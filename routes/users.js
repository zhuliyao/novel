// import { concat } from './C:/Users/Administrator.SG-20180106FXFJ/AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/async';

var express = require('express');
var router = express.Router();
var conn = require("../utils/conn");
var async = require("async");
/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
router.get("/find",(req,res)=>{
  console.log(req.query)
  var bname=req.query.bookname
  conn.getDb((err,db)=>{
    if (err) throw err;
    var novel=db.collection("allnovel");
    novel.find({alt_title:bname},{author:1,pubdate:1,image:1,_id:0,id:1,pages:1}).toArray((err,result)=>{
      if (err) throw err;
      console.log(result)
      if(result.length>0){
        res.render("find",{result:result});
      }else{
        res.send(`<script>alert('没有找到相关图书');history.back()</script>`);
      }
      
      
      db.close()
    })
  })
})





router.get("/index",(req,res)=>{
  var id=req.query.id || "123456";
  // console.log(id)
  if(req.session.username){
     conn.getDb((err,db)=>{
       if(err) throw err;
       console.log("数据库连接成功");
       var discuss=db.collection("discuss");
       var novel=db.collection("allnovel");
     
      async.waterfall([
        function(callback){
            discuss.find({nid:id},{_id:0,uid:1,pltitle:1,content:1,username:1,time:1}).toArray((err,result)=>{
                if(err) throw err;
                console.log("评论查询成功");
                callback(null,result);
            })
        },
        function(result,callback){
            novel.find({id:id},{author:1,pubdate:1,image:1,_id:0,price:1,title:1,summary:1,id:1,pages:1}).toArray((err,result1)=>{
                if(err) throw err;
                console.log("小说查询成功");
                // console.log(result1[0])
                callback(null,[result,result1[0]]);
            })
        }
    ],function(err,result){
        if(err) throw err;
        // console.log(result)
        res.render("dicuss",{result:result[1],novelbox:result[0]});
        db.close();
    })
      


     })
  }else{
    res.send(`<script>alert('session已经过期,请重新登录!');location.href='/rootlogin'</script>`);
  }
})
//用户提交评论
router.post("/submit",(req,res)=>{
  var username=req.session.username;
  var data=req.body;
  var pltitle=data.title;
  var content=data.content;
  var nid=req.query.id;

  if(username){
    conn.getDb((err,db)=>{
      if(err) throw err;
      console.log("数据库连接成功");
      var discuss=db.collection("discuss");
      var ids=db.collection("ids");
      var novel=db.collection("allnovel")
      async.waterfall([
            function(callback){
              ids.findAndModify({name:"comment"},[["_id","desc"]],{$inc:{id:1}},(err,result)=>{
                if(err) throw err;
                callback(null,result.value.id)
              })
            },
            function(uid,callback){
             novel.find({id:nid},{title:1}).toArray((err,result)=>{
              if(err) throw err;
              callback(null,uid,result[0].title)
             })
            },
            function(uid,title,callback){
               var time = new Date;
               var Nowtime=time.toLocaleString();
               var data={uid:uid,username:username,pltitle:pltitle,nid:nid,content:content,time:Nowtime,title:title}
               discuss.insert(data,(err,result)=>{
                 if(err) throw err;
                  callback(null,result)
               })
            }
      ],function(err,result){
        if(err) throw err;
        res.redirect("/users/index?id="+nid);
        db.close();
      })
    })
  }else{
    res.send(`<script>alert("登录超时，请重新登录");location.href='/rootlogin'</script>`)
  }
});



// 小说列表文学类
router.get("/novel",(req,res)=>{
  var username=req.session.username;
   if(username){
       conn.getDb((err,db)=>{
        var novel=db.collection("novel")
        var novel1=db.collection("novel1")
        var novel2=db.collection("novel2")
        var novel3=db.collection("novel3")
        var novel4=db.collection("novel4")
        
       async.waterfall([
         function(callback){
           novel.find({},{author:1,pubdate:1,image:1,_id:0,id:1,pages:1}).toArray((err,result)=>{
             if(err) throw err;
             console.log("1111")
             
             callback(null,result)
           })
         },
         function(result,callback){
          novel1.find({},{author:1,pubdate:1,image:1,_id:0,id:1,pages:1}).toArray((err,result1)=>{
            if(err) throw err;
           
            callback(null,[result,result1])
          })
         },
         function([result,result1],callback){
          novel2.find({},{author:1,pubdate:1,image:1,_id:0,id:1,pages:1}).toArray((err,result2)=>{
            if(err) throw err;
        
            callback(null,[result,result1,result2])
          })
         },
         function([result,result1,result2],callback){
          novel3.find({},{author:1,pubdate:1,image:1,_id:0,id:1,pages:1}).toArray((err,result3)=>{
            if(err) throw err;
            console.log("2222===================================")
            console.log(result3)
            callback(null,[result,result1,result2,result3])
          })
         },
         function([result,result1,result2,result3],callback){
          novel4.find({},{author:1,pubdate:1,image:1,_id:0,id:1,pages:1}).toArray((err,result4)=>{
            if(err) throw err;
            console.log("2222===================================")
            console.log(result3)
            callback(null,[result,result1,result2,result3,result4])
          })
         }
       ],function(err,result){
            if(err) throw err;
            // console.log(result)
            res.render("novel",{result:result[1],result1:result[0],result2:result[2],result3:result[3],result4:result[4]});
            db.close();
       })

       })


  }else{
    res.send(`<script>alert('session已经过期,请重新登录!');location.href='/rootlogin'</script>`)
  }

});



// 用户评论管理

router.get("/usercomment",(req,res)=>{
     var username = req.session.username;
     if(username){
      var findData=function(db,callback){
        var discuss=db.collection("discuss");
        discuss.find().toArray((err,result)=>{
          if(err) throw err;
          // console.log("123")
          // console.log(result)
          callback(result)
        })
      }
      conn.getDb((err,db)=>{
        if(err) throw err;
        console.log("数据库连接成功")
        findData(db,function(result){
          // console.log("123",result)
          res.render("usercomment",{result:result})
        })
      })
    }else{
      console.log("ldladkasj")
      res.send(`<script>alert('session已经过期,请重新登录!');location.href='/login'</script>`)
    }

});
//用户评论删除
router.get("/userdelete",(req,res)=>{
  var id =req.query["id"];   
  var uid = req.query["uid"]*1;    
  var username = req.session.username;
  if(username){
      conn.getDb((err,db)=>{
          if(err) throw err;
          console.log("数据库连接成功");
          var discuss= db.collection("discuss");
          discuss.deleteOne({uid:uid},(err,result)=>{
              if(err) throw err;
              console.log(result);
              console.log("删除成功");
             
              res.redirect("/users/usercomment");
              db.close();
          })
      });
  }else{
      res.send(`<script>alert('session已经过期,请重新登录!');location.href='/login'</script>`)                            
  }
});

router.post("/conupdate",(req,res)=>{
  var username = req.session.username;
  var uid = req.body.uid*1;
  var content = req.body.upcontent;
  console.log("123",content)
  if(username) {
    conn.getDb((err,db)=>{
      if(err) throw err;
      var discuss = db.collection("discuss");
      discuss.update({uid:uid},{$set:{content:content}},(err,result)=>{
        if(err) throw err;
        console.log("评论修改成功");
        res.send("1");
        db.close()
      })
    })
  }else{
    res.send(`<script>alert("登录超时，请重新登录");location.href='/login'</script>`)
  }
});










module.exports = router;
