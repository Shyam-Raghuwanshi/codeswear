import Cart from "../../models/addtocart"
import connectDb from "../../middleware/mongoose"

connectDb()
export default async function handler(req, res) {
    if (req.method == 'POST') {
        let cart = await Cart.find({ 'email': req.body.email })
        res.status(200).json(cart)
    }
    else {
        res.status(500).json({ error: "This method is not allowed" })
    }
}
