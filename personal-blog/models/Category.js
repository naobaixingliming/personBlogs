/** Created by Liming on 2017/9 */
var mongoose=require('mongoose');
var categorySchema=require('../schemas/category');
module.exports = mongoose.model('Category',categorySchema);
// module.exports=mongoose.model('Category',require('../schemas/category'));