import User from '../../models/User'
import connectDb from '../../middleware/mongoose'
var CryptoJS = require("crypto-js");
var jwt = require('jsonwebtoken');
connectDb()
export default async function handler(req, res) {
    let user;
    try {
        if (req.method == 'POST') {
            let data = req.body.password
            let encryptedPassword = CryptoJS.AES.encrypt(data, process.env.SECRET_KEY).toString();
            var token = jwt.sign({ 'email': req.body.email, 'password': req.body.password, 'name':req.body.name }, process.env.SECRET_KEY, { expiresIn: "2d" })
            user = new User({
                name: req.body.name,
                email: req.body.email,
                // password: req.body.password
                password: encryptedPassword
            })
            await user.save()

            res.status(200).json({ token, success: true })
        }
        else {
            res.status(200).json({ success: false })
        }
    }
    catch {

        res.status(400).json({ success: false, message: "Internal server error" })
    }



}
