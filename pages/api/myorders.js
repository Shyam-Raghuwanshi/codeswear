import Order from '../../models/Orders'
import connectDb from '../../middleware/mongoose'
import jsonwebtoken from 'jsonwebtoken'
export default async function handler(req, res) {
    connectDb()
    let user = jsonwebtoken.verify(req.body.token, process.env.SECRET_KEY)
    let order = await Order.find({ 'email': user.email })
    res.status(200).json({ order })
}
