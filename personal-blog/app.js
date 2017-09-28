/** Created by Liming on 2017/9 */

/**
*
* 项目入口文件
*
*/

var express=require('express');
var swig=require('swig');
var mongoose=require('mongoose');
var bodyParser=require('body-parser');
var Cookies=require('cookies');

var User=require('./models/User');

var app=express();

//配置bodyParser
app.use(bodyParser.urlencoded({extended:true}));

//设置静态文件托管
app.use('/static',express.static(__dirname+'/public'));

//取消模板缓存
swig.setDefaults({cache:false});

//模板配置
app.engine('html',swig.renderFile);
app.set('views','./views');
app.set('view engine','html');

//设置cookies
app.use(function(req,res,next){
    req.cookies=new Cookies(req,res);
    //解析用户的cookies信息
    req.userInfo={};
    if( req.cookies.get('userCookies')){
            //req.cookies.get('userCookies') -String- : {"_id":"59b0fe43c51aa30f60abfa84","username":"%E5%B0%8F%E6%98%8E"}
        try{
            req.userInfo=JSON.parse(req.cookies.get('userCookies'));
            //获取当前登录用户的类型,是否是管理员
            User.findById(req.userInfo._id).then(function (userInfo) {
                //console.log(userInfo);
                req.userInfo.isAdmin=Boolean(userInfo.isAdmin);
                next();
            })
        }catch(e){
            next();
        }
    }else {
        next();
    }
});


/**
 * 根据功能进行模块划分
        后台管理模块
        API模块
        前台模块
 */

app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));

// mongoose.connect('mongodb://localhost:27019/blog',function (err) {
//     if(err){
//         console.log('数据库连接失败');
//     }else {
//         console.log('数据库连接成功');
//         app.listen(8081);
//     }
// });

mongoose.connect('mongodb://mingyubo:1033256773@ds151024.mlab.com:51024/personblog', {
    useMongoClient: true,
    reconnectTries:10,
    /* other options */
}).then(function(db){
     console.log('数据库连接成功');
     app.listen(8081);
});
