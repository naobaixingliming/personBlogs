/** Created by Liming on 2017/9*/

var mongoose=require('mongoose');

//用户的表结构
var Schema=mongoose.Schema;
module.exports= new Schema({
    username:String,
    password:String,
    isAdmin:{
        type:Boolean,
        default:false
    }
});