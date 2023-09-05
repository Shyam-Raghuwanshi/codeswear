import React from 'react'
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';
import { AiFillCloseCircle } from 'react-icons/ai';
import Head from 'next/head';
import Script from 'next/script';
import { useState, useEffect } from 'react';
import jsonwebtoken from 'jsonwebtoken'
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
const checkout = ({ cart, removeOneItem, removeFullItem, addToCart, clearCart, setSideCart, subtotal }) => {
  const [user, setUser] = useState(null)
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

  const handelChange = async (e) => {
    let names
    let email
    let phone
    let pincodes
    let address
    if (e.target.name == 'name') {
      setName(e.target.value)
      if (e.target.value.length > 4) {
        names = false
      }
      else {
        names = true
      }
    }
    if (e.target.name == 'email') {
      setEmail(e.target.value)
      if (e.target.value.length > 10) {
        email = false
      }
      else {
        email = true
      }
    }
    if (e.target.name == 'phone') {
      setPhone(e.target.value)
      if (e.target.value.length == 10) {
        phone = false
      }
      else {
        phone = true
      }
    }
    if (e.target.name == 'address') {
      setAddress(e.target.value)
      if (e.target.value.length > 10) {
        address = false
      }
      else {
        address = true
      }
    }
    if (e.target.name == 'pincode') {
      setPincode(e.target.value)
      if (e.target.value.length == 6) {
        const pinCodes = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincode`)
        let data = await pinCodes.json()
        if (Object.keys(data).includes(e.target.value)) {
          setCity(data[e.target.value][0])
          setState(data[e.target.value][1])
          pincodes = false
        }
        else {
          setCity("This pincode is not available")
          setState("This pincode is not available")
          pincodes = true
        }
      }
      else {
        setCity("This pincode is not available")
        setState("This pincode is not available")
        pincodes = false
      }
    }

    // if (name.length > 3 && email.length > 3 && phone.length > 3 && address.length > 3 && pincode.length > 3) {
    //   if (paymentType == 'Cash on Delivery' || paymentType == 'Pay' && city != 'This pincode is not available') {
    //     setDisable(false)

    //   }
    // }
    // else {
    //   setDisable(true)
    // }
  }
  const handlePyamentType = (paymenttype) => {
    setPaymentType(paymenttype)
  }

  useEffect(() => {
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



  let oid = Math.random() * Date.now()
  const conform = async (e) => {
    e.preventDefault()
    let body = { cart, subtotal, oid, email, address, pincode, phone, name }

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
      clearCart()
    }

  }
  const pay = async (e) => {
    e.preventDefault()
    let body = { price, subtotal, oid, email, address, pincode, phone, name }

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
      clearCart()
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
      clearCart()
    }).catch(function onError(error) {
      console.log("error => ", error);
    });


  }

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

  return (
    <>
      {cart == null || cart.length == 0 ? <div className='md:text-5xl text-gray-300 bg-gray-900 py-40 text-center font-bold'>Your cart is Empty. Please add some items for checkout :)</div> : <div className=" bg-gray-900 text-gray-200 mx-auto">
        <Head>
          <title>Buynow</title>
          <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" /></Head>
        <Script type="application/javascript" crossorigin="anonymous" src={`${process.env.NEXT_PUBLIC_PAYTIM_HOST}/merchantpgpui/checkoutjs/merchants/${process.env.NEXT_PUBLIC_PAYTIM_MID}`} />
        <div className="flex flex-col w-full px-0 mx-auto md:flex-row">
          <div className="flex flex-col md:w-full lg:pl-[2rem]">
            <h2 className="mb-4 font-bold md:text-xl text-heading ">Shipping Address</h2>
            <form method="POST" onSubmit={paymentType !== "Cash on Delivery" ? pay : conform} className="justify-center w-full mx-auto">
              <div className="">
                <div className="space-x-0 lg:flex lg:space-x-4">
                  <div className="w-full">
                    <label htmlFor="firstName" className="block mb-3 text-sm font-semibold text-gray-500">Name</label>
                    <input readOnly={user != null} onChange={handelChange} value={name} name="name" type="text" placeholder="Name"
                      className="w-full px-4 py-3 text-sm border bg-gray-900 border-gray-500 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600" required />
                  </div>
                </div>
                <div className="space-x-0 lg:flex lg:space-x-4 mt-5">
                  <div className="w-full lg:w-1/2">
                    <label htmlFor="city"
                      className="block mb-3 text-sm font-semibold text-gray-500">City</label>
                    <input readOnly={user != null} onChange={handelChange} value={email} name="city" type="text" placeholder="City"
                      className="w-full px-4 py-3 text-sm border bg-gray-900 border-gray-500 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600" required />
                  </div>
                  <div className="w-full lg:w-1/2">
                    <label htmlFor="phone" className="block mb-3 text-sm font-semibold text-gray-500">Phone</label>
                    <input readOnly={user != null} onChange={handelChange} value={phone} name="phone" type="text" placeholder="Phone"
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
                    <input readOnly={user != null} onChange={handelChange} required value={pincode} name="pincode" type="text" placeholder="Enter your PinCode"
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
                  <button disabled={disable} className="disabled:bg-gray-600 disabled:text-gray-500 w-full rounded-lg px-6 py-2 text-white bg-gray-700 active:bg-gray-800 ">{paymentType !== "Cash on Delivery" ? "Pay" : "Conform"}</button>
                </div>
              </div>
            </form>
          </div>
          < div className=" flex flex-col w-full ml-0 lg:ml-12 lg:w-2/5 px-[1rem] lg:pl-0 md:pr-[2rem] ">
            <div className="pt-12 md:pt-0 2xl:ps-4">
              <h2 className="text-xl font-bold">Order Summary</h2>
              <div className="mt-8 ">
                {cart !== undefined && cart !== null && cart.length == 0 && <div className='w-full flex text-center justify-center text-sm sm:text-xl font-semibold'>Cart is empty. Please add some items.</div>}
                {cart !== undefined && cart !== null && cart.map((k) => {
                  return (
                    <div key={k.slug} className="flex  mt-14 flex-col space-y-4 border-gray-300 border-b-2 pb-2">
                      <div className="flex space-x-4">
                        <div>
                          <img src={k.img} alt="image"
                            className="w-28" />
                          <div className="flex mt-3 items-center justify-center sm:text-lg">
                            <FaMinusCircle onClick={() => { removeOneItem(k.slug, k.title, k.price, k.name, k.size, k.varient) }} className=' cursor-pointer' /><span className='pl-3 pr-3'>{k.quantity}</span>
                            <FaPlusCircle onClick={() => { addToCart(k.email, k.slug, k.title, k.price, k.name, k.size, k.varient, k.img) }} className='cursor-pointer' />
                          </div>
                        </div>
                        <div>
                          <span className="sm:text-xl font-bold">{k.name}/{k.size}/{k.varient}</span>
                          <p className="text-sm"></p>
                          <span className="text-red-600">Price: </span>{k.price}
                        </div>
                        <div>
                          <AiFillCloseCircle onClick={() => { removeFullItem(k._id) }} className='sm:text-xl cursor-pointer' />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              < div
                className="flex items-center w-full py-4 text-sm font-semibold border-b border-gray-300 lg:py-5 lg:px-3 text-heading last:border-b-0 last:text-base last:pb-0" >
                Subtotal : <span className="ml-2" > {subtotal}</span></div>

            </div>
          </div>
        </div>
      </div >}
    </>
  )
}


export default checkout