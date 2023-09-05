import Seller from '../../models/Seller'
import connectDb from '../../middleware/mongoose'
connectDb()
export default async function handler(req, res) {

    try {
        if (req.method == 'POST') {
            try {
                let seller = new Seller({
                    name: req.body.name,
                    email: req.body.email,
                    address: req.body.address,
                    phone: req.body.phone,
                    mode: req.body.mode
                })
                await seller.save()

                res.status(200).json({ success: true })
            }
            catch {
                res.status(400).json({ success: false, message: "numbererror" })
            }
        }
        else {
            res.status(200).json({ success: false })
        }
    }
    catch {

        res.status(400).json({ success: false, message: "Internal server error" })
    }



}
