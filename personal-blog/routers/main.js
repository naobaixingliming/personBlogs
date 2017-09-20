/** Created by Liming on 2017/9 */

var express=require('express');
var router=express.Router();

var Category=require('../models/Category');
var Content=require('../models/Content');


/**
 *   处理通用的数据
 */
var data;
router.use(function (req,res,next) {
    data={
        userInfo:req.userInfo,
        categories:[]
    };
    Category.find().then(function (categories) {
        data.categories=categories;
        next();
    });
});



/**
 *   首页
 */
router.get('/',function (req,res) {
    //console.log(req.query.category);
    data.category=req.query.category||'';
    data.count=0;
    data.page=Number(req.query.page||1);
    data.limit=5;
    data.pages=0;

    var where={};
    if(data.category){
        where.category=data.category;
    }
    Content.where(where).count().then(function (count) {
        data.count=count;
        data.pages=Math.ceil(data.count/data.limit);              //总页数
        data.page=Math.min(data.page,data.pages);                 //取值不能超过pages
        data.page=Math.max(data.page,1);                          //取值不能小于1
        var skip=(data.page-1)*data.limit;
        return Content.where(where).find().limit(data.limit).skip(skip).populate(['category','user']).sort({addTime:-1});
    }).then(function (content) {
        data.contents=content;
       // console.log(data);
        res.render('main/index',data);
    });
});


/**
 *   详情页
 */
router.get('/views',function (req,res) {
    var id=req.query.viewId||'';
    Content.findOne({
        _id:id
    }).then(function (content) {
        data.content=content;
        //console.log(content);
        content.views++;
        content.save();
        res.render('main/view',data);
    });
});


module.exports=router;