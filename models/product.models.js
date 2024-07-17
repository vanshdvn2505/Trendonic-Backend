import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    discountPercentage: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    brand: { type: String, default: "Trendonic" },
    sku: { type: String },
    weight: { type: Number, default: "" },
    dimensions: {
        type: Object,
        default: {}
    },
    warrantyInformation: { type: String, default: "" },
    shippingInformation: { type: String },
    availabilityStatus: { type: String },
    reviews: {
        type: Array,
    },
    returnPolicy: { type: String, default: "" },
    minimumOrderQuantity: { type: Number },
    meta: {
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        barcode: { type: String },
        qrCode: { type: String }
    },
    images: { type: [String], default: [] },
    thumbnail: { type: String, default: "" }
})

const Product = mongoose.model("Products", productSchema);

export default Product