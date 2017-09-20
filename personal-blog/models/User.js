/** Created by Liming on 2017/9 */
var mongoose=require('mongoose');
var userSchema=require('../schemas/users');

module.exports=mongoose.model('User',userSchema);
