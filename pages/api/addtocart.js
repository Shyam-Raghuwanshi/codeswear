import Cart from "../../models/addtocart"
import connectDb from "../../middleware/mongoose"
connectDb()
export default async function handler(req, res) {
    if (req.method == 'POST') {

        let cart = new Cart({
            slug: req.body.slug,
            email: req.body.email,
            title: req.body.title,
            quantity: req.body.quantity,
            price: req.body.price,
            name: req.body.name,
            size: req.body.size,
            varient: req.body.varient,
            img: req.body.img
        })
        let data = await cart.save()
        res.status(200).json({ success: data })

    }
    else {
        res.status(500).json({ error: 'This method is not allowed' })
    }
}
