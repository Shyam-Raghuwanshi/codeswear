import Product from '../../models/Product'
import connectDb from '../../middleware/mongoose'

connectDb()
export default async function handler(req, res) {
    let prodcuts = await Product.find()
    let tshirts = {};
    for (let item of prodcuts) {

        if (item.title in tshirts) {
            let a = tshirts[item.title]
            if (!tshirts[item.title].color.includes(item.color) && item.availableQty > 0) {
                tshirts[item.title].color.push(item.color)
            }
            if (!tshirts[item.title].size.includes(item.size) && item.availableQty > 0) {
                tshirts[item.title].size.push(item.size)
            }

        }
        else {
            tshirts[item.title] = JSON.parse(JSON.stringify(item))
            if (item.availableQty > 0) {
                tshirts[item.title].color = [item.color]
                tshirts[item.title].size = [item.size]
            }
        }
    }
    res.status(200).json({ tshirts })
}