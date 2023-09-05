import Product from '../../models/Product'
import connectDb from '../../middleware/mongoose'

connectDb()
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '20mb',
        },
    },
}
export default async function handler(req, res) {
    if (req.method === "POST") {
        await Product.findByIdAndUpdate(req.body.id, { title: req.body.title, desc: req.body.desc, img: req.body.img, category: req.body.category, size: req.body.size, color: req.body.color, price: req.body.price, availableQty: req.body.availableQty })
        res.status(200).json({ success: 'success' })
    }
    else {
        res.status(404).json({ error: "This method is not allowed" })
    }
}