const https = require('https');
const PaytmChecksum = require('paytmchecksum');
import Order from '../../models/Orders'
import connectDb from '../../middleware/mongoose'
import Product from '../../models/Product'
import Cart from '../../models/addtocart'

export default async function handler(req, res) {
    connectDb()
    if (req.method == 'POST') {
        let conformOrder
        // Inisate a order 


        if (req.body.type) {
            let order = new Order({
                email: req.body.email,
                OrderId: req.body.oid,
                address: req.body.address,
                amount: req.body.subtotal,
                products: req.body.cart
            })
            let product = await Product.findOne({ "slug": req.body.slug })
            let availableQty = (parseInt(product.availableQty) - parseInt(req.body.quantity))
            if (0 > availableQty) {

            }
            else {
                await Product.findOneAndUpdate({ "slug": req.body.slug }, { 'availableQty': parseInt(product.availableQty) - parseInt(req.body.quantity) })
            }
            await order.save()
            let userorder = await Order.findOneAndUpdate({ OrderId: req.body.oid }, { status: 'Cash on Delivery' })
            res.status(500).json({ success: true, OrderId: userorder._id })
        }
        else {
            let order = new Order({
                email: req.body.email,
                OrderId: req.body.oid,
                address: req.body.address,
                amount: req.body.subtotal,
                products: req.body.cart
            })
            let cart = await Cart.find({ "email": req.body.email })
            for (let i = 0; i < cart.length; i++) {
                const element = cart[i]
                let product = await Product.findOne({ "slug": element.slug })
                let qty = parseInt(element.quantity) <= parseInt(product.availableQty)
                if (!qty) {
                    if (parseInt(element.quantity) !== parseInt(product.availableQty)) {
                        conformOrder = 'false'
                        await Cart.findOneAndUpdate({ "slug": element.slug, "email": element.email }, { 'quantity': product.availableQty })
                    }
                }
                else {
                    conformOrder = 'true'
                    let availableQty = (parseInt(product.availableQty) - parseInt(element.quantity))
                    if (0 > availableQty) {

                    }
                    else {
                        await Product.findOneAndUpdate({ "slug": element.slug }, { 'availableQty': parseInt(product.availableQty) - parseInt(element.quantity) })
                    }
                }


            }

            // }
            await order.save()
            if (conformOrder == 'true') {
                if (req.body.paymentType == 'Pay') {
                    var paytmParams = {};
                    paytmParams.body = {
                        "requestType": "Payment",
                        "mid": process.env.NEXT_PUBLIC_PAYTIM_MID,
                        "websiteName": "YOUR_WEBSITE_NAME",
                        "orderId": req.body.oid,
                        "callbackUrl": `${process.env.NEXT_PUBLIC_HOST}/api/posttransaction`,
                        "txnAmount": {
                            "value": req.body.subtotal,
                            "currency": "INR",
                        },
                        "userInfo": {
                            "custId": req.body.email,
                        },
                    };

                    /*
                    * Generate checksum by parameters we have in body
                    * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
                    */
                    let checksum = await PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), process.env.NEXT_PUBLIC_PAYTIM_KMID)

                    paytmParams.head = {
                        "signature": checksum
                    };

                    var post_data = JSON.stringify(paytmParams);

                    const requestAsync = async () => {
                        return new Promise((resolve, reject) => {
                            var options = {

                                /* for Staging */
                                // hostname: 'securegw-stage.paytm.in',

                                /* for Production */
                                hostname: 'securegw.paytm.in',

                                port: 443,
                                path: `/theia/api/v1/initiateTransaction?mid=${process.env.NEXT_PUBLIC_PAYTIM_MID}&orderId=${req.body.oid}`,
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Content-Length': post_data.length
                                }
                            };
                            var response = "";
                            var post_req = https.request(options, function (post_res) {
                                post_res.on('data', function (chunk) {
                                    response += chunk;
                                });

                                post_res.on('end', function () {
                                    resolve(JSON.parse(response).body)
                                });
                            });

                            post_req.write(post_data);
                            post_req.end();
                        })
                    }

                    let myr = await requestAsync()
                    res.status(200).json(myr)

                }
                else {
                    let order = await Order.findOneAndUpdate({ OrderId: req.body.oid }, { status: 'Cash on Delivery' })
                    res.status(500).json({ success: true, OrderId: order._id })
                }
            }
            else {
                res.status(500).json({ success: false, error: "Some items of your cart is outofstock. We are remove them from cart!" })
            }
        }
    }

}