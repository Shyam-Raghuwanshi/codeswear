import User from '../../models/User'
import connectDb from '../../middleware/mongoose'
var jwt = require('jsonwebtoken');
var CryptoJS = require("crypto-js");
export default async function handler(req, res) {
    connectDb()
    try {
        if (req.method == 'POST') {
            let user = await User.findOne({ 'email': req.body.email })
            let bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
            var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
            if (req.body.password == decryptedData) {
                var token = jwt.sign({ 'email': req.body.email, 'password': req.body.password }, process.env.SECRET_KEY, { expiresIn: "2d" })
                res.status(200).json({ token, success: true })
            }
            else {
                res.status(404).json({ success: false, Error: "Wrong Cradencials" })
            }
        }
        else {
            res.status(500).json({ message: "This method is not allowed" })
        }
    }
    catch{
        res.status(500).json({ success: false, Error: "Internal server error" })
    }
}
