
import User from '../../models/addtocart'
import Product from '../../models/Product'
import connectDb from '../../middleware/mongoose'
connectDb()
export default async function handler(req, res) {
    if (req.method == 'POST') {
        let product = await Product.findOne({ 'slug': req.body.slug })
        if (product.availableQty < req.body.quantity) {
            res.status(200).json({ success: false, error: "'Sorry! Quantity is outof stock'" })
        }
        else if (req.body.quantity > 10) {
            res.status(200).json({ success: false, error: "Sorry! You cann't order more than 10 items" })
        }
        else {
            let u = await User.find({ "_id": req.body._id })
            for (let i = 0; i < u.length; i++) {
                let newcart = { quantity: req.body.quantity }
                let user = await User.findByIdAndUpdate(req.body._id, newcart)
                res.status(200).json({ "success": user })
            }
        }
    }
    else {
        res.status(500).json({ error: "this method is not allowed" })
    }
}
