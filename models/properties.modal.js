import mongoose from "mongoose";

const propertiesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter a title"],
        trim: true,
        minLength: 2,
        maxLength: 50,
    },
    description: {
        type: String,
        minLength: 2,
        maxLength: 500,
    },
    type:{
        type: String,
        enum: ["rent", "sale"],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
    },
    status: {
        type: String,
        enum: ["available", "sold"],
        default: "available",
    },
    images: {
        type: [String],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    city:{
        type: String,
        required: true,
    },
    state:{
        type: String,
        required: true,
    },
    bedrooms:{
        type: Number,
        required: true,
    },
    bathrooms:{
        type: Number,
    },
    amenities:{
        type: [String],
    }

}, {timestamps: true});

const Property = mongoose.model('Property', propertiesSchema);
export  default Property;