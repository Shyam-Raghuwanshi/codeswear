const mongoose = require('mongoose')

const new_post = new mongoose.Schema({
    img: { type: String, required: true }

}, { timestamps: true })
mongoose.models = {}
export default mongoose.model('Image', new_post)
