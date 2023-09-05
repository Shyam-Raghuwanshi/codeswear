import Order from '../../models/Orders'
import connectDb from '../../middleware/mongoose'
export default async function handler(req, res) {
    connectDb()
    if (req.body.STATUS == 'TXN_SUCCESS') {
        let order = await Order.findOneAndUpdate({ OrderId: req.body.ORDERID }, { status: 'Paid', paymentInfo: JSON.stringify(req.body) })
        res.redirect(`/order?id=${order._id}`, 200)
    }
    else if (req.body.STATUS == 'PENDING') {
        let order = await Order.findOneAndUpdate({ OrderId: req.body.ORDERID }, { status: 'Pending', paymentInfo: JSON.stringify(req.body) })
        res.redirect(`/order?id=${order._id}`, 200)
    }
    else {
        res.status(500).json({ error: 'error' })
    }
}
