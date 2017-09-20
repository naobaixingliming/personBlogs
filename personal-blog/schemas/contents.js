/** Created by Liming on 2017/9 */
var mongoose=require('mongoose');

module.exports= new mongoose.Schema({
    //关联字段--内容分类的id
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
    //关联字段 - 用户id
    user:{
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref:'User'
    },
    //标题字段
    title:String,
    //简介字段
    description:{
        type:String,
        default:''
    },
    //内容字段
    content:{
        type:String,
        default:''
    },
    //图片字段
    imgUrl:{
        type:String,
        default:''
    },
    //添加时间
    addTime:{
        type:Date,
        default:new Date()
    },
    //阅读量
    views:{
        type:Number,
        default:0
    },
    //评论
    comments:{
        type:Array,
        default:[]
    }

});