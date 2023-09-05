const mongoose = require('mongoose')

const SellerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true }
}, { timestamps: true })

mongoose.models = {}
export default mongoose.model('Seller', SellerSchema)