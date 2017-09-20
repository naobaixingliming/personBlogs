/** Created by Liming on 2017/9 */

var express=require('express');
var router=express.Router();
var User=require('../models/User');
var Content=require('../models/Content');

//统一返回格式
var responseData={};
router.use(function (req,res,next) {
    responseData={
        code:0,
        message:''
    };
    next();
});

var preUrl;
/**
 *   登录注册
 */
router.get('/user/login',function (req,res) {
    preUrl=req.headers['referer'];
    res.render('api/login');
});
router.get('/user/register',function (req,res) {
    preUrl=req.headers['referer'];
    res.render('api/login');
});


/**
 *   注册
 */
router.post('/user/register',function (req,res) {
   //req.body :{object} 用户输入提交的数据 --post
    var username=req.body.username;
    var password=req.body.password;
    var repassword=req.body.repassword;

    var usernameReg =/[\u4E00-\u9FA5]/ ; //包含中文
    var pwdReg = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){5,19}$/; //密码规则：只能输入6-20个以字母开头、可带数字、“_”、“.”的字串

    if(username==''){
        responseData.code=1;
        responseData.message='用户名不能为空';
        res.json(responseData);
        return;
    }
    if(!usernameReg.test(username)){
        responseData.code=2;
        responseData.message='用户名必须包含中文';
        res.json(responseData);
        return;
    }
    if(password==''){
        responseData.code=3;
        responseData.message='密码不能为空';
        res.json(responseData);
        return;
    }
    if(!pwdReg.test(password)){
        responseData.code=4;
        responseData.message='密码只能输入6-20个以字母开头、可带数字、“_”、“.”的的组合';
        res.json(responseData);
        return;
    }
    if(repassword!=password){
        responseData.code=5;
        responseData.message='二次密码输入不同';
        res.json(responseData);
        return;
    }
    //用户是否被注册
    User.findOne({username:username}).then(function (userInfo) {
        //用户已经被注册
        if(userInfo){
            responseData.code=6;
            responseData.message='用户已经被注册,请重新输入';
            res.json(responseData);
            return;
        }
        //保存用户信息到数据库中
        var user=new User({username:username,password:password});
        return user.save();
    }).then(function (newUserInfo) {
        responseData.message='注册成功';
        //console.log(newUserInfo);
        responseData.personInfo={
            preUrl:preUrl,
            _id:newUserInfo._id,
            username:newUserInfo.username
        };
        req.cookies.set('userCookies',JSON.stringify({
            _id:newUserInfo._id,
            username:encodeURI(newUserInfo.username)
        }));
        res.json(responseData);
    })

});


/**
 *   登录
 */
router.post('/user/login',function (req,res) {
    var username=req.body.username;
    var password=req.body.password;

    if(username==''){
        responseData.code=1;
        responseData.message='用户名不能为空';
        res.json(responseData);
        return;
    }
    if(password==''){
        responseData.code=2;
        responseData.message='密码不能为空';
        res.json(responseData);
        return;
    }
    User.findOne({
        username:username,
        password:password
    }).then(function (userInfo) {
        if(!userInfo){
            responseData.code=3;
            responseData.message='用户名或密码不正确';
            res.json(responseData);
            return;
        }
        responseData.message='登录成功';
        responseData.personInfo={
            preUrl:preUrl,
            _id:userInfo._id,
            username:userInfo.username
        };
        req.cookies.set('userCookies',JSON.stringify({
            _id:userInfo._id,
            username:encodeURI(userInfo.username)
        }));
        res.json(responseData);
    });
});


/**
 *   退出
 */
router.get('/user/logout',function (req,res) {
    req.cookies.set('userCookies',null);
    responseData.message='退出';
    res.json(responseData);
});


/**
 * 评论提交
 */
router.post('/user/comment',function (req,res) {
    var id=req.body.contentId||'';
    var postData={
        username:req.userInfo.username,
        submitTime:new Date(),
        content:req.body.content
    };
    Content.findOne({_id:id}).then(function (content) {
        //console.log(content);
        content.comments.push(postData);
        return content.save();
    }).then(function (newContnet) {
        responseData.message='评论成功';
        responseData.data=newContnet;
        res.json(responseData);
    })
});


/**
 * 获取指定文章的所有评论
 */
router.get('/user/comment',function (req,res) {
    var id=req.query.contentId||'';
    Content.findOne({
        _id:id
    }).then(function (content) {
        responseData.data=content.comments;
        res.json(responseData);
    })
});




module.exports=router;