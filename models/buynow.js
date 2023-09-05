const mongoose = require('mongoose')

const buynow = new mongoose.Schema({
    slug: { type: String, unique: true },
}, { timestamps: true })
mongoose.models = {}
export default mongoose.model('buynow', buynow)