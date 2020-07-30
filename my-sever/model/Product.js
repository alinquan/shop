const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    id: Schema.Types.ObjectId,
    name:String,
    img:String,
    price:Number,
    company:String,
    city:String,
    type:Number,
});

//发布模型
mongoose.model('Product', productSchema);