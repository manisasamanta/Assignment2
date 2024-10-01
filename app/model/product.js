const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
},
  categoryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'category'
},
subcategoryId: {  
  type: mongoose.Schema.Types.ObjectId, 
  ref: 'subcategory' 
},
  price: { 
    type: Number
},
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product
