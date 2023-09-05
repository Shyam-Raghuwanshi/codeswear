import Cart from "../../models/addtocart"
import connectDb from "../../middleware/mongoose"

connectDb()
export default async function handler(req, res) {
    if (req.method == 'DELETE') {
        let cart = await Cart.findByIdAndDelete({ _id: req.body._id })
        res.status(200).json({ cart })
    }
}
