import React, { useState, useEffect } from 'react'
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script';
import Product from '../models/Product'
import connectDb from '../middleware/mongoose'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsonwebtoken from 'jsonwebtoken'
import Link from 'next/link'
const buynow = ({ product, setSideCart }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pincode, setPincode] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [disable, setDisable] = useState(true)
  const [paymentType, setPaymentType] = useState('')
  const router = useRouter()
  const [subtotal, setSubtotal] = useState(parseInt(product.price))
  const [user, setUser] = useState(null)

  // handle with type of payment user choose 
  const handlePyamentType = (paymenttype) => {
    setPaymentType(paymenttype)

  }

  // For input fill
  const handelChange = async (e) => {
    if (e.target.name == 'name') {
      setName(e.target.value)
      if (e.target.value.length > 4) {
        setDisable(false)
      }
      else {
        setDisable(true)
      }
    }
    else if (e.target.name == 'phone') {
      setPhone(e.target.value)
      if (e.target.value.length == 10) {
        setDisable(false)
      }
      else {
        setDisable(true)
      }

    }
    else if (e.target.name == 'address') {
      setAddress(e.target.value)
      if (e.target.value.length > 10) {
        setDisable(false)
      }
      else {
        setDisable(true)
      }
    }
    // else if (paymentType == '') {
    //   setDisable(true)

    // }
    else if (e.target.name == 'pincode') {
      setPincode(e.target.value)
      if (e.target.value.length == 6) {
        const pinCodes = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincode`)
        let data = await pinCodes.json()
        if (Object.keys(data).includes(e.target.value)) {
          setCity(data[e.target.value][0])
          setState(data[e.target.value][1])
          setDisable(false)
        }
        else {
          setCity("This pincode is not available")
          setState("This pincode is not available")
          setDisable(true)
        }
      }
      else {
        setCity("This pincode is not available")
        setState("This pincode is not available")
        setDisable(true)
      }
    }
    if (name.length > 3 && email.length > 3 && phone.length > 3 && address.length > 3 && pincode.length > 3) {
      setDisable(false)
    }
    else {
      setDisable(true)
    }
  }

  // Check token or expiry of token  if not of so redirect to home page
  useEffect(async () => {
    // findMode()
    setSideCart(false)
    let token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
    }
    else {
      let user = jsonwebtoken.verify(token, process.env.NEXT_PUBLIC_SECRET_KEY)
      setEmail(user.email)
      userDetails()
    }
  }, [])


  // if userDetails is present in database so fill automatically
  const userDetails = async () => {
    let token = localStorage.getItem('token')
    let user = jsonwebtoken.verify(token, process.env.NEXT_PUBLIC_SECRET_KEY)
    let body = { email: user.email, address, pin: pincode, phone, name, city, state }
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/userDetails`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    let json = await res.json()
    if (json.user) {
      setUser(json.user)
      setAddress(json.user.address)
      setPincode(json.user.pin)
      setPhone(json.user.phone)
      setName(json.user.name)
      setCity(json.user.city)
      setState(json.user.state)
    }
  }

  // Genrate order id for seprate order
  let oid = Math.random() * Date.now()

  // Whose order with payment type cash on delivery
  const conform = async (e) => {
    userDetails()
    let quantity = router.query.q
    e.preventDefault()
    let cart = [{
      slug: product.slug,
      varient: product.color,
      size: product.size,
      quantity: product.quantity,
      price: product.price,
      email: email,
      title: product.title,
      quantity: quantity,
      name: product.name,
    }]

    let body = { type: "buynow", cart, slug: product.slug, quantity, subtotal, oid, email, address, pincode, phone, name }
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pretranction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    let json = await res.json()
    if (!json.success) {
      toast.error(json.error, {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      router.push('/checkout')
      // console.clear()
    }
    else {
      router.push(`/order?id=${json.OrderId}`)
      toast.success("Your order is successfull", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

  }

  // Whose order with payment type pay online
  const pay = async (e) => {
    userDetails()
    e.preventDefault()
    let quantity = router.query.q
    let cart = [{
      slug: product.slug,
      varient: product.varient,
      size: product.size,
      quantity: product.quantity,
      price: product.subtotal,
      email: email,
      title: product.title,
      quantity: quantity,
      name: product.name,
    }]
    let body = { type: "buynow", cart, slug: product.slug, quantity, subtotal, oid, email, address, pincode, phone, name }

    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pretranction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    let json = await res.json()
    if (!json.success) {
      toast.error(json.error, {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      router.push('/checkout')
      // console.clear()
    }
    else {
      router.push(`/order?id=${json.OrderId}`)
      router.push(`/order?id=${json.OrderId}`)
      toast.success("Your order is successfull", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }



    const txnres = await res.json()
    let txnToken = txnres.txnToken
    var config = {
      "root": "",
      "flow": "DEFAULT",
      "data": {
        "orderId": oid, /* update order id */
        "token": txnToken, /* update token value */
        "tokenType": "TXN_TOKEN",
        "amount": subtotal /* update amount */
      },
      "handler": {
        "notifyMerchant": function (eventName, data) {
          // console.log("notifyMerchant handler function called");
          // console.log("eventName => ", eventName);
          // console.log("data => ", data);
        }
      }
    };

    // initialze configuration using init method 
    window.Paytm.CheckoutJS.init(config).then(function onSuccess() {
      // after successfully updating configuration, invoke JS Checkout
      window.Paytm.CheckoutJS.invoke();
    }).catch(function onError(error) {
      console.log("error => ", error);
    });


  }

  // Calculate subtotal of a product 
  const calculateSubTotal = () => {
    const p = parseInt(router.query.q) * product.price
    setSubtotal(p)
  }

  // useEffect for calculate subtotal and if user make some temperring with our query so redirect on homepage
  useEffect(() => {
    calculateSubTotal()
    if (parseInt(router.query.q) > product.availableQty) {
      router.push("/")
    }
    if (parseInt(router.query.q) <= 0) {
      router.push('/')
    }
  }, [parseInt(router.query.q)])

  // For increase product quantity
  const addProduct = () => {
    if (parseInt(product.availableQty) <= parseInt(router.query.q)) {
      toast.error("Item quantity is out of Stock!", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    else {
      if (parseInt(router.query.q) >= 10) {
        toast.error("Item's quantity cann't be more than 10", {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      else {
        toast.success("Item is updated", {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        router.push(`${process.env.NEXT_PUBLIC_HOST}/buynow?slug=${product.slug}&q=${parseInt(router.query.q) + 1}`)
      }
    }
  }

  // For decrease product quantity
  const removeProduct = () => {
    if (parseInt(router.query.q) <= 1) {
      toast.error("Item's quantity cann't be less than 1", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    else {
      toast.success("Item is updated", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      router.push(`${process.env.NEXT_PUBLIC_HOST}/buynow?slug=${product.slug}&q=${parseInt(router.query.q) - 1}`)
    }

  }
  return (
    <>
      <div className=" md:p-12 bg-gray-900 text-gray-200 mx-auto">
        <Head>
          <title>Buynow</title>
          <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" /></Head>
        <Script type="application/javascript" crossorigin="anonymous" src={`${process.env.NEXT_PUBLIC_PAYTIM_HOST}/merchantpgpui/checkoutjs/merchants/${process.env.NEXT_PUBLIC_PAYTIM_MID}`} />

        <div className="flex flex-col w-full px-0 mx-auto md:flex-row">
          <div className="flex flex-col md:w-full">
            <h2 className="mb-4 font-bold md:text-xl text-heading ">Shipping Address</h2>
            <form method="POST" onSubmit={paymentType !== "Cash on Delivery" ? pay : conform} className="justify-center w-full mx-auto">
              <div className="">
                <div className="space-x-0 lg:flex lg:space-x-4">
                  <div className="w-full">
                    <label htmlFor="firstName" className="block mb-3 text-sm font-semibold text-gray-500">Name</label>
                    <input onChange={handelChange} readOnly={user != null} value={name} name="name" type="text" placeholder="Name"
                      className="w-full px-4 py-3 text-sm border  bg-gray-900 border-gray-500 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600" required />
                  </div>
                </div>
                <div className="space-x-0 lg:flex lg:space-x-4 mt-5">
                  <div className="w-full lg:w-1/2">
                    <label htmlFor="city"
                      className="block mb-3 text-sm font-semibold text-gray-500">Email</label>
                    <input onChange={handelChange} readOnly={user != null} value={email} name="email" type="text" placeholder="Email"
                      className="w-full px-4 py-3 text-sm border bg-gray-900 border-gray-500 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600" required />
                    <span className="block mb-1 text-sm font-semibold text-gray-500">Email cann't be editable</span>
                  </div>
                  <div className="w-full lg:w-1/2">
                    <label htmlFor="phone" className="block mb-3 text-sm font-semibold text-gray-500">Phone</label>
                    <input onChange={handelChange} readOnly={user != null} value={phone} name="phone" type="text" placeholder="Phone"
                      className="w-full px-4 py-3 text-sm border bg-gray-900 border-gray-500 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600" required />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full">
                    <label htmlFor="Address"
                      className="block mb-3 text-sm font-semibold text-gray-500">Address</label>
                    <textarea onChange={handelChange} readOnly={user != null} value={address}
                      className="w-full px-4 py-3 text-xs border bg-gray-900 border-gray-500 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                      name="address" cols="20" rows="4" placeholder="Address" required></textarea>
                  </div>
                </div>
                <div className="space-x-0 lg:flex lg:space-x-4">

                  <div className="w-full lg:w-1/2 ">
                    <label htmlFor="postcode" className="block mb-3 text-sm font-semibold text-gray-500">
                      PinCode</label>
                    <input onChange={handelChange} readOnly={user != null} required value={pincode} name="pincode" type="text" placeholder="Enter your PinCode"
                      className="w-full px-4 py-3 text-sm border bg-gray-900 border-gray-500 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600" />
                  </div>


                  <div className="group  w-full lg:w-1/2 inline-block">
                    <label className="block mb-3 text-sm font-semibold text-gray-500">
                      Pyment Type</label>
                    <input onChange={handelChange} required value={paymentType} name="paymentType" type="text"
                      placeholder='Choose a Payment Type' className="w-full px-4 py-3  text-sm border bg-gray-900 border-gray-500 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600" />

                    <div className=" dropdown border rounded-sm transform scale-0 group-hover:scale-100 absolute flex flex-col transition duration-150 ease-in-out origin-top bg-gray-900">


                      <span onClick={(() => { handlePyamentType("Pay") })} className="rounded-sm px-3 py-1 cursor-pointer border border-b-white hover:bg-slate-400">Pay</span>
                      <span onClick={(() => { handlePyamentType("Cash on Delivery") })} className="rounded-sm px-3 py-1 cursor-pointer hover:bg-slate-600 ">Cash on Delivery</span>
                    </div>
                  </div>
                </div>
                <div className="space-x-0 lg:flex lg:space-x-4 mt-5">
                  <div className="w-full lg:w-1/2">
                    <label htmlFor="city"
                      className="block mb-3 text-sm font-semibold text-gray-500">City</label>
                    <input onChange={handelChange} value={city} name="city" type="text" placeholder="City"
                      className="w-full px-4 py-3 text-sm border bg-gray-900 border-gray-500 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600" />
                  </div>
                  <div className="w-full lg:w-1/2 ">

                    <label htmlFor="city" className="block mb-3 text-sm font-semibold text-gray-500">State</label>
                    <input onChange={handelChange} value={state} name="state" type="text" placeholder="State"
                      className="w-full px-4 py-3 text-sm border bg-gray-900 border-gray-500 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600" />
                  </div>
                </div>


                <div className="mt-4">
                  <Link href="/account"><button className="w-full md:w-3/12 mb-3 rounded-lg px-6 py-2 text-white bg-gray-800 active:bg-gray-800 ">Change Details</button></Link>
                  <button  className="disabled:bg-gray-600 w-full  disabled:text-gray-500 rounded-lg px-6 py-2 text-white bg-gray-800 active:bg-gray-800 ">{paymentType !== "Cash on Delivery" ? "Pay" : "Conform"}</button>
                </div>
              </div>
            </form>
          </div>
          <div className="mt-8 ">
            {product !== undefined &&
              <div key={product._id} className="flex  mt-14 flex-col space-y-4 border-gray-300 border-b-2 pb-2 px-10">
                <div className="flex space-x-4">
                  <div>
                    <img src={product.img} alt="image"
                      className="w-28" />
                    <div className="flex mt-3 items-center justify-center text-lg">
                      <FaMinusCircle onClick={removeProduct} className=' cursor-pointer' /><span className='pl-3 pr-3'>{product.quantity}</span>
                      <FaPlusCircle onClick={addProduct} className='cursor-pointer' />
                    </div>
                  </div>
                  <div>
                    <span className="text-xl font-bold">{product.title}/{product.size}/{product.color}</span>
                    <p className="text-sm"></p>
                    <span className="text-green-600 font-extrabold">Price: </span>{product.price}
                  </div>
                </div>
              </div>

            }
            < div
              className="flex flex-col py-4 px-10 text-sm font-semibold border-b border-gray-300 lg:py-5 lg:px-3 text-heading last:border-b-0 last:text-base last:pb-0" >
              <span className="ml-2 mb-3" > Quantity : {product !== undefined &&
                parseInt(router.query.q)
              }</span>
              <span className="ml-2" >Subtotal : {product !== undefined &&
                subtotal
              }</span></div>
          </div>
        </div>
      </div >
    </>
  )
}
export default buynow


export async function getServerSideProps(context) {
  connectDb()
  let product = await Product.findOne({ slug: context.query.slug })
  return {
    props: { product: JSON.parse(JSON.stringify(product)) }
  }
}



