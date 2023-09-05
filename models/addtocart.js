const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    slug: { type: String, required: true },
    email: { type: String, required: true },
    title: { type: String, required: true },
    quantity: { type: Number, required: false, default: 1 },
    price: { type: String, required: true },
    name: { type: String, required: true },
    size: { type: String, required: true },
    varient: { type: String, required: true },
    img: { type: String, required: true }

}, { timestamps: true })
mongoose.models = {}
export default mongoose.model('cart', cartSchema)
