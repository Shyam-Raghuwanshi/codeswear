import connectDb from '../../middleware/mongoose'
import userDetails from '../../models/userdetails'
connectDb()
export default async function handler(req, res) {
    if (req.method == 'POST') {
        let user = await userDetails.findOne({ 'email': req.body.email })
        if (!user) {
            if (req.body.phone == null || req.body.address == '' || req.body.pin == '') {

            }
            else {
                let userdetails = new userDetails({
                    email: req.body.email,
                    name: req.body.name,
                    address: req.body.address,
                    phone: req.body.phone,
                    pin: req.body.pin,
                    city: req.body.city,
                    state: req.body.state,
                })
                await userdetails.save()
                res.status(200).json({ success: "success" })
            }
            res.status(500).json({ error:'error' })

        }
        else {
            res.status(500).json({ user })
        }

    }
    else {
        res.status(200).json({ notallowed: 'This method is not allowed' })
    }
}