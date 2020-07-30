const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const cartSchema = new Schema({
    id: ObjectId,
    productId: {
        type: ObjectId,
        ref: 'Product' //关联model
    },
    userId: ObjectId,
    ctime: {type: Date, default: Date.now()}
});

//发布模型
mongoose.model('Cart', cartSchema);