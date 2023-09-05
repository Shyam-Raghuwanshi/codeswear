import connectDb from '../../middleware/mongoose'
import userDetails from '../../models/Seller'
connectDb()

export default async function handler(req, res) {
    try{
    if (req.method == 'POST') {
        await userDetails.findOneAndUpdate({ "email": req.body.email }, { 'mode': req.body.mode })
        res.status(200).json({ success: "success" })
    }
    else {
        res.status(200).json({ error: "This method is not allowed" })

    }
}
catch{
    res.status(500).json({message:"Internal server eroor"})
}
}



