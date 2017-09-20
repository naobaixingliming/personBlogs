/** Created by Liming on 2017/9 */

var express=require('express');
var User=require('../models/User');
var Category=require('../models/Category');
var Content=require('../models/Content');

var router=express.Router();


router.use(function(req, res, next) {
    if (!req.userInfo.isAdmin) {
        //如果当前用户是非管理员
        res.send('对不起，只有管理员才可以进入后台管理');
        return;
    }
    next();
});

/**
 *   首页
 */
router.get('/',function (req,res) {
    res.render('admin/index',{
        userInfo:req.userInfo
    });
});


/**
 *   用户管理
 */
router.get('/user',function (req,res) {
    var page=Number(req.query.page||1);//用户输入的页码
    var limit=20;
    var totalPages=0;//总页数
    User.count().then(function (count) {
        totalPages=Math.ceil(count/limit);
        page=Math.max(page,totalPages);
        page=Math.min(1,page);
        var skip=(page-1)*limit;
        User.find().sort({_id:-1}).limit(limit).skip(skip).then(function (userData) {
            res.render('admin/userManage/user_index',{
                userInfo:req.userInfo,
                users:userData,
                count:count,
                page:page,
                totalPages:totalPages
            });
        });
    });
});



/**
 *   分类首页
 */
router.get('/category',function (req,res) {
    var page=Number(req.query.page||1);//用户输入的页码
    var limit=20;
    var totalPages=0;//总页数
    Category.count().then(function (count) {
        totalPages=Math.ceil(count/limit);
        totalPages=Math.min(1,totalPages);
        page=Math.max(page,totalPages);
        page=Math.min(1,page);
        var skip=(page-1)*limit;
        Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function (categoryData) {
           // console.log(categoryData);
            res.render('admin/category/category_index',{
                userInfo:req.userInfo,
                categories:categoryData,
                count:count,
                page:page,
                totalPages:totalPages
            });
        });
    });
});


/**
 *  修改--分类首页
 */
router.get('/category/edit',function (req,res) {
    var id=req.query.id||'';//url:   http://localhost:8081/admin/category/edit  ? id=59b760bee3a2560f64c77660
    //console.log(id); 59b760bee3a2560f64c77660
    Category.findOne({_id:id}).then(function (rs) {
        if(!rs){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类名称不存在'
            });
        }else {
            res.render('admin/category/category_edit',{
                userInfo:req.userInfo,
                category:rs
            })
        }
    })
});


/**
 *    提交--修改--分类首页
 */
router.post('/category/edit',function (req,res) {
    var id =req.query.id||'';
    var name=req.body.name||'';
    Category.findOne({_id:id}).then(function (rs) {
        if(!rs){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类信息不存在'
            });
            return Promise.reject();
        }else {
            if(name==''||name==rs.name){
                res.render('admin/error',{
                    userInfo:req.userInfo,
                    message:'提交的数据没有修改',
                    url:'/admin/category'
                });
                return Promise.reject();
            }else {
                return Category.findOne({
                    _id:{$ne:id},
                    name:name
                })
            }
        }
    }).then(function (sameInfo) {
        if(sameInfo){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'数据库中存在同名分类'
            });
            return Promise.reject();
        }else {
            return Category.update({_id:id},{name:name})
        }
    }).then(function (endInfo) {
        //console.log(endInfo);
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'修改成功',
            url:'/admin/category'
        });
    })
});


/**
 *      删除--修改--分类首页
 */
router.get('/category/delete',function (req,res) {
    var id=req.query.id||'';
    Category.remove({_id:id}).then(function (rs) {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'删除成功',
            url:'/admin/category'
        });
    })
});


/**
 *   分类添加
 */
router.get('/category/add',function (req,res) {
    res.render('admin/category/category_add',{
        userInfo:req.userInfo
    })
});


/**
 *   分类添加--提交
 */
router.post('/category/add',function (req,res) {
    var name=req.body.name||'';
    //console.log(req.body);前端提交的数据 { name: 'html' }
    if(name==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'分类名称不能为空'
        });
        return;
    }
    Category.findOne({name:name}).then(function (info) {
        //已存在相同分类名称
        if(info){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类名称已存在'
            });
            return Promise.reject();
        }else {
            // var category=new Category({name:name});
            // return category.save();
            return new Category({
                name:name
            }).save();
        }
    }).then(function (newInfo) {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'保存成功',
            url:'/admin/category'
        });
    });
});




/**
 *   内容添加
 */
router.get('/content/add',function (req,res) {
    Category.find().sort({_id:-1}).then(function (categories) {
        // console.log(categories);
        res.render('admin/content/content_add',{
            userInfo:req.userInfo,
            categories:categories
        });
    });
});




/**
 *   提交---内容添加  (这里有问题，不能写到数据库,提交不了)
 */
router.post('/content/add',function (req,res) {
    //console.log(req.body);
    var title=req.body.title;
    var description=req.body.description;
    var imgUrl=req.body.imgUrl;
    if(title==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'标题不能为空'
        });
        return;
    }
    if(description==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'简介'
        });
        return;
    }
    if(imgUrl==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'图片url不能为空'
        });
        return;
    }
    // http://images-lm.oss-cn-hangzhou.aliyuncs.com/node/node-1.jpg
    new Content({
        category:req.body.category,
        user:req.userInfo._id.toString(),
        title:req.body.title,
        description:req.body.description,
        imgUrl:req.body.imgUrl,
        content:req.body.content
    }).save().then(function (contentInfo) {
        //console.log(contentInfo);
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'保存成功',
            url:'/admin/content'
        });
    });
});


/**
 *   内容首页
 */
router.get('/content',function (req,res) {
    var page=Number(req.query.page||1);//用户输入的页码
    var limit=20;
    var totalPages=0;//总页数
    Content.count().then(function (count) {
        totalPages=Math.ceil(count/limit);
        totalPages=Math.min(1,totalPages);
        page=Math.max(page,totalPages);
        page=Math.min(1,page);
        var skip=(page-1)*limit;
        Content.find().sort({addTime:-1}).limit(limit).skip(skip).populate(['category','user']).then(function (contentData) {
             //console.log(contentData);
            res.render('admin/content/content_index',{
                userInfo:req.userInfo,
                contents:contentData,
                count:count,
                page:page,
                totalPages:totalPages
            });
        });
    });
});


/**
 *   内容--修改操作
 */
router.get('/content/edit',function (req,res) {
    var id=req.query.contentId||'';
    var categories=[];
    Category.find().sort({_id:-1}).then(function (rs) {
        categories=rs;
        return Content.findOne({_id:id}).populate('category');
    }).then(function (content) {
        // console.log(categories,content);
        if(!content){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'内容不存在'
            });
            return Promise.reject();
        }else {
            res.render('admin/content/content_edit',{
                userInfo:req.userInfo,
                categories:categories,
                content:content
            });
        }
    });
});


/**
 *   内容--提交--修改操作
 */
router.post('/content/edit',function (req,res) {
    var id=req.query.contentId||'';
    var title=req.body.title;
    var imgUrl=req.body.imgUrl;
    var description=req.body.description;
    var content=req.body.content;
    if(title==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'标题不能为空'
        });
        return;
    }
    if(imgUrl==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'图片url不能为空'
        });
        return;
    }
    if(description==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'简介不能为空'
        });
        return;
    }
    if(description==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'内容不能为空'
        });
        return;
    }
    var conditions ={_id:id};
    var update={
        category:req.body.category,
        title:title,
        imgUrl:imgUrl,
        content:content,
        description:description
    };
    Content.update(conditions,update).then(function (content) {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'修改保存成功',
            url:'/admin/content'
        });
    });
});


/**
 *   内容--删除操作
 */
router.get('/content/delete',function (req,res) {
    var id=req.query.contentId||'';
    Content.remove({_id:id}).then(function (content) {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'删除成功',
            url:'/admin/content'
        });
    })
});


module.exports=router;