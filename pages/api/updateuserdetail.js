import connectDb from '../../middleware/mongoose'
import userDetails from '../../models/userdetails'
connectDb()

export default async function handler(req, res) {
    if (req.method == 'POST') {
        await userDetails.findOneAndUpdate({ "email": req.body.email }, { 'phone': req.body.phone, 'name': req.body.name, 'address': req.body.address, 'pin': req.body.pin })
        res.status(200).json({ success: "success" })
    }
    else {
        res.status(200).json({ error: "This method is not allowed" })

    }
}



