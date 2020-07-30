const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TypeSchema = new Schema({
    id: Schema.Types.ObjectId,
    typeId:Number,
    typeName:String,
});

//发布模型
mongoose.model('Type', TypeSchema);