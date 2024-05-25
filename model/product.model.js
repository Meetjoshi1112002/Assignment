import mongoose from "mongoose";

// Define Option Schema
const optionSchema = mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true }
});

// Define Specification Schema without `productsToUseIn`
const specificationSchema = mongoose.Schema({
    type: { type: String, required: true },
    options: { type: [optionSchema], required: true }
});


export const setSchema = mongoose.Schema({
    setName:{
        type:String
    },
    questions:{
        type:[String]
    },
    svg:{type:String},
    approxImages:{
        type:Number,
        default:10
    }
})

const themeSchema = mongoose.Schema({
    name: { 
        type: String,
    },
    description: { 
        type: String 
    },

    // chaged by the vendor (all CRUD)
    questions: [
        { type: setSchema }
    ],
    addedPrice: { 
        type: Number 
    },
    discount: { 
        type: Number 
    },
    introducedBy: { 
        type: String 
    },
    trendy: { 
        type: Boolean 
    },
    available: { 
        type: Boolean 
    },
    images: [
        { type: String }
    ],
    counter:{
        ai:{
            type:Number,
            default:0
        },
        design:{
            type:Number,
            default:0
        },
        ete:{
            type:Number,
            default:0
        }
    }
});

const productSchema = mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        unique:true
    },
    numberOfSeller:{
        type:Number,
        default:0
    },
    description: { 
        type: String, 
        required: true 
    },
    dimensions: { 
        width:String,
        height:String
    },
    images: [
        {
            name:{type:String,required:true},
            mediaLink:{type:String,required:true}
        }
    ],
    type1: { 
        type: String 
    },
    type2: {
        type:String
    },
    introducedBy: { 
        type: String 
    },
    accessTo: [
        { type: String }
    ],
    structureOfMaking: {
        isPreview: { type: Boolean },
        segregation: { type: Boolean }
    },
    // Not able to be changed by vendors as this is cost price for the vendors
    variants: [
        {
        pages: { type: Number, required: true },
        basePrice: { type: Number,default:500 },
        printPrice: {type:Number,default:25},  // -- > printprice/pages
        image:{
            name:{type:String},
            mediaLink:{type:String}
        }
        }
    ],
    // not changed by vendor
    pricing:{
        ai:{
            type:Number,
            default:0
        },
        design:{
            type:Number,
            default:0
        },
        ete:{
            type:Number,
            default:0
        }
    },
    prompts:{
        title:{
            type:String
        },
        content:{
            type:String
        },
        caption:{
            type:String
        }
    },
    themes: {
        type:[themeSchema]
    },
    avgMarketEvaluation: { 
        type: Number 
    },
    approxMakingTime: { 
        type: Number 
    },
    specifications: [
        {
            specificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Specification'},
        }
    ],
    active:{
        type:Boolean,
        default:true
    }
});

const Product = mongoose.model("product", productSchema);
export const Specification = mongoose.model("specification", specificationSchema);

export default Product;
