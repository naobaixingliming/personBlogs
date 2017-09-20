/** Created by Liming on 2017/9 */
var mongoose=require('mongoose');
var contentSchema=require('../schemas/contents');

module.exports=mongoose.model('Content',contentSchema);
