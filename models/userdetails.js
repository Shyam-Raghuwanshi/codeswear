const mongoose = require('mongoose')

const userDetailSchema = new mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String },
    address: { type: String },
    phone: { type: Number },
    pin: { type: Number },
    city: { type: String },
    state: { type: String },
}, { timestamps: true })


// export default mongoose.model.Order || mongoose.model('Order', OrderSchema)
mongoose.models = {}
export default mongoose.model('userDetail', userDetailSchema)