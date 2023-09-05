import Seller from '../../models/Seller'
import connectDb from '../../middleware/mongoose'
connectDb()
export default async function handler(req, res) {

    try {
        if (req.method == 'POST') {
            try {
                const seller = await Seller.findOne({ "email": req.body.email })
                if (!seller) {
                    res.status(200).json({ success: false, message:'Seller not found' })
                }
                else {
                    res.status(200).json({ success: true, seller })
                }
            }
            catch {
                res.status(400).json({ success: false, message: "This email is not present" })
            }
        }
        else {
            res.status(200).json({ success: false, message: "This method is not allowed" })
        }
    }
    catch {
        res.status(400).json({ success: false, message: "Internal server error" })
    }
}
