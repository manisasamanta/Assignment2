const mongoose = require('mongoose');

const SubcategorySchema = new mongoose.Schema({
    subcategoryName: { 
        type: String, 
        required: true 
    },
    categoryId: { 
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'category' 
    },
});

const subCategory = mongoose.model('subcategory', SubcategorySchema);
module.exports = subCategory
