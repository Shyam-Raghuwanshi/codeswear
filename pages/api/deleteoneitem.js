import Cart from "../../models/addtocart"
import connectDb from "../../middleware/mongoose"

connectDb()

export default async function handler(req, res) {
    if (req.method == 'DELETE') {
        let d = await Cart.findByIdAndDelete(req.body._id)
        res.status(200).json({ success: true })
    }
    else {
        res.status(500).json({ error: 'This method is not allowed' })
    }
}
