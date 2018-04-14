var express = require('express');
var router = express.Router();
var conn = require("../utils/conn");
var mongodb = require("mongodb");
// var CONN_DB_STR = "mongodb://47.94.208.182:27017/zhuliyao";
var CONN_DB_STR = "mongodb://localhost:27017/cd1706";
var MongoClient = mongodb.MongoClient;
var async = require("async");
/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render 渲染 模板   读取 html
  console.log(req.session);
  res.render('./index.ejs', 
  {
    flag:true,
    username:req.session.username
  }
  );     
});

//退出登录
router.get("/logout",(req,res)=>{
  req.session.destroy((err)=>{
    if(err) throw err;
    res.redirect("/")
  })
})

// 小说列表
// router.get("/novel",(req,res)=>{
//   var username=req.session.username;
//   if(username){
//     var findData=function(db,callback){
//       var novel=db.collection("novel");
//       novel.find({},{author:1,pubdate:1,image:1,_id:0,id:1}).toArray((err,result)=>{
//         if(err) throw err;
//         callback(result)
//       })
//     }
//     conn.getDb((err,db)=>{
//       if(err) throw err;
//       console.log("数据库连接成功")
//       findData(db,function(result){
//         res.render("novel",{result:result})
//       })
//     })
//   }else{
//     res.send(`<script>alert('session已经过期,请重新登录!');location.href='/login'</script>`)
//   }

// });
//跳转用户管理页面
// router.get("/usermanage",(req,res)=>{
  // conn.getDb((err,db)=>{
  //   if(err) throw err;
  //   var user=db.collection("user");
  //   user.find({},{_id:0}).toArray((err,result)=>{
  //     if(err) throw err;
  //     console.log("查询成功")；
  //     res.render("user",{result:result});
  //     db.close();
  //   })
  // })

// res.render("usermanage")
// });

//管理员登录页面
router.get("/rootlogin",(req,res)=>{
  res.render("rootlogin");
})

// router.get("/find",(req,res)=>{
//   res.render("find");
// })


router.get("/login",(req,res)=>{
  res.render("login");
});
router.get("/register",(req,res)=>{
  res.render("register");
});
//管理员登录
router.post("/rootlogin1",(req,res)=>{
  var username=req.body.username;
  var password=req.body.password;
  var findDate=function(db,callback){
    var root=db.collection("root");
    var data={username:username,password:password};
    root.find(data).toArray((err,result)=>{
      if(err) throw err;
      console.log(result);
      callback(result);
    })
  }
   conn.getDb((err,db)=>{
     if(err){
       res.send("数据库错误");
       console.log(err)
     }else{
        findDate(db,(result)=>{
          console.log("查询成功");
          if(result.length>0){
            req.session.username =username;
            // console.log(req.session.username);
            res.redirect("/");
          }else{
            //登陆失败
            res.send(`<script>alert('登录失败,请重新登录!');location.href='/rootlogin'</script>`);
          }
        })
     }
   })
});

//用户登录
router.post("/userlogin",(req,res)=>{
  var username=req.body.username;
  var password=req.body.password;
  var findDate=function(db,callback){
    var user=db.collection("user");
    var data={username:username,password:password};
    user.find(data).toArray((err,result)=>{
      if(err) throw err;
      console.log(result);
      callback(result);
    })
  }
   conn.getDb((err,db)=>{
     if(err){
       res.send("数据库错误");
       console.log(err)
     }else{
        findDate(db,(result)=>{
          console.log("查询成功");
          if(result.length>0){
            req.session.username =username;
            res.redirect("/");
            
          }else{
            //登陆失败
            res.send(`<script>alert('登录失败,请重新登录!');location.href='/login'</script>`);
          }
        })
     }
   })
});
//  用户注册
router.post("/register",(req,res)=>{
    var username=req.body.username;
    var password=req.body.password;
    var dbpass=req.body.password1;
    console.log(req.body)
    var email=req.body.email;

    var insertData=function(db,callback){
      var user=db.collection('user');
      //判断是否注册
      async.waterfall([
        function(callback){
          user.find({username:username}).toArray((err,result)=>{
            console.log(result)
            if(err) throw err;
            if(result.length>0){
              console.log(55)
              callback(null,true); // 已经注册
            }else{
              callback(null,false)
            }
          })
        },
        function(arg,callback){
          if(!arg){
            console.log("没有注册");
            user.insert({username:username,password:password,email:email},(err,result)=>{
              if(err) throw err;
              callback(null,"0")
            })
          }else{
            callback(null,"1")
          }
        }
      ],function(err,result){
        if(err) throw err;
        callback(result)
      })

    }
    //连接数据库
    conn.getDb((err,db)=>{
      if(err) throw err;
      insertData(db,function(result){
        console.log(result);
        if(result=="0"){
          console.log("插入成功");
          res.send({status:0})
        }else{
          console.log("插入失败");
          res.send({status:1})
        }
        db.close()
      })
    })
})
//管理员管理页面

router.get("/rootindex",(req,res)=>{
  res.render('./rootindex', 
  {
    flag:true,
    username:req.session.username
  }
  );
})
//用户管理界面
router.get("/usermanage",(req,res)=>{
  
    conn.getDb((err,db)=>{
      if(err) throw err;
      var  user = db.collection("user");
      user.find({},{_id:0,}).toArray((err,result)=>{
           if(err) throw err;
           console.log("查询成功");
           console.log(result);
           res.render("usermanage",{result:result});
           db.close();
      })
    })
    // res.render("user");
  })
// 查询图书
router.post("/findbook",(req,res)=>{
  console.log(req.body);
  var bname=req.body.bookname;
  conn.getDb((err,db)=>{
    if (err) throw err;
    var novel=db.collection("allnovel");
    novel.find({alt_title:bname},{author:1,pubdate:1,image:1,_id:0,id:1,pages:1}).toArray((err,result)=>{
      if (err) throw err;
      if(result.length>0){
        
        res.send(result);
       
      }else{
        res.send("1")
      }
      
      db.close()
    })
  })
})
//用户添加
router.post("/userinsert",(req,res)=>{
  var username=req.body.username;
  var password=req.body.password;

  // conn.getDb((err,db)=>{
  //   if(err) throw err;
  //   var user =db.collection("user");
  //   user.insert({username:username,password:password},(err,result)=>{
  //     if(err) throw err;
  //     console.log("插入成功");
  //     res.redirect("/usermanage");
  //     db.close();
  //   })
  // })
  var insertData=function(db,callback){
    var user=db.collection('user');
    async.waterfall([
      function(callback){
        user.find({username:username}).toArray((err,result)=>{
          console.log(result)
          if(err) throw err;
          if(result.length>0){
            callback(null,true); // 已经注册
          }else{
            callback(null,false)
          }
        })
      },
      function(arg,callback){
        if(!arg){
          console.log("没有注册");
          user.insert({username:username,password:password},(err,result)=>{
            if(err) throw err;
            callback(null,"0")
          })
        }else{
          callback(null,"1")
        }
      }
    ],function(err,result){
      if(err) throw err;
      callback(result)
    })

  }
  //连接数据库
  conn.getDb((err,db)=>{
    if(err) throw err;
    insertData(db,function(result){
      console.log(result);
      if(result=="0"){
        console.log("插入成功");
        res.redirect("/usermanage")
      }else{
        console.log("插入失败");
        // res.redirect("/usermanage")
        res.send(`<script>alert('用户名已存在，请重新输入!');location.href='/usermanage'</script>`);
      }
      db.close()
    })
  })
})

//用户删除
router.get("/userdelete",(req,res)=>{
  var username=req.query.username;
  if(username!=-1){
    conn.getDb((err,db)=>{
      if(err) throw err 
      var user = db.collection("user");
      user.deleteOne({username:username},(err,result)=>{
        if(err,result);
        console.log("删除成功");
        res.send("8888");
        db.close()
      })
    })
  }else{
    conn.getDb((err,db)=>{
      if(err) throw err;
      var user=db.collection("user");
      user.remove((err,result)=>{
        if(err) throw err;
        console.log("全部删除");
         res.send("1");
        db.close()
      })
    })
  }

});
// 用户修改
router.post("/userupdate",(req,res)=>{
  var username=req.body.username;
  var upname=req.body.upname;
  var uppass=req.body.uppass;
// console.log("1233")
  conn.getDb((err,db)=>{
    if(err) throw err;
    var user=db.collection("user");
    user.updateOne({username:username},{
      $set:{
        username:upname,
        password:uppass}
    },(err,result)=>{
       if(err) throw err;
       console.log("修改成功");
       res.send("1");
       db.close()

    })
  })
});










module.exports = router;
