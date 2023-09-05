import Product from "../../models/Product"
import connectDb from "../../middleware/mongoose"

connectDb()

export default async function handler(req, res) {
    if (req.method == 'DELETE') {
        await Product.findByIdAndDelete(req.body.productId)
        let product = await Product.find()
        res.status(200).json({ product })
    }
    else {
        res.status(500).json({ error: 'This method is not allowed' })
    }
}
