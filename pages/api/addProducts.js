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
        try {
            for (let i = 0; i < req.body.length; i++) {
                const slug = req.body[i].title.toLowerCase().replace(/ /g, '-') + Math.random(0, 1000)
                let product = new Product({
                    title: req.body[i].title,
                    slug: slug,
                    desc: req.body[i].desc,
                    img: req.body[i].img,
                    category: req.body[i].category,
                    size: req.body[i].size,
                    color: req.body[i].color,
                    price: req.body[i].price,
                    availableQty: req.body[i].availableQty
                })
                await product.save()
            }
            res.status(200).json({ success: true, message: "Product is added" })
        }
        catch {
            res.status(500).json({ success: false, message: "Internal Server Error" })
        }

    }
    else {
        res.status(404).json({ success: false, message: "This method is not allowed" })
    }
}
