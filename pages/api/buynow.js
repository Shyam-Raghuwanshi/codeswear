import Product from '../../models/Product'
import connectDb from '../../middleware/mongoose'
connectDb()

export default async function handler(req, res) {
    if (req.method == 'POST') {
        let pro = await Product.findOne({ slug: req.body.slug })
        
        res.status(200).json({ pro})
    }
    else {
        res.status(200).json({ error: 'This method is not allowed' })

    }
}
