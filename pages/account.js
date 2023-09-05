import React from 'react'
import Head from 'next/head';
import Script from 'next/script';
import { useState, useEffect } from 'react';
import jsonwebtoken from 'jsonwebtoken'
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const checkout = ({ setSideCart }) => {
    const [name, setName] = useState('')
    const [user, setUser] = useState(null)
    const [email, setEmail] = useState('')
    const [pincode, setPincode] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [address, setAddress] = useState('')
    const [phone, setPhone] = useState('')
    // const [disable, setDisable] = useState(true)
    const disable = true;
    const router = useRouter()

    const handelChange = async (e) => {
        if (e.target.name == 'name') {
            setName(e.target.value)
            if (e.target.value.length > 4) {
                // setDisable(false)
                disable = false
            }
            else {
                // setDisable(true)
                disable = true
            }
        }
        else if (e.target.name == 'email') {
            setEmail(e.target.value)
            if (e.target.value.length > 10) {
                // setDisable(false)
                disable = false
            }
            else {
                // setDisable(true)
                disable = true
            }

        }
        else if (e.target.name == 'phone') {
            setPhone(e.target.value)
            if (e.target.value.length == 10) {
                // setDisable(false)
                disable = false
            }
            else {
                // setDisable(true)
                disable = true
            }

        }
        else if (e.target.name == 'address') {
            setAddress(e.target.value)
            if (e.target.value.length > 10) {
                // setDisable(false)
                disable = false
            }
            else {
                // setDisable(true)
                disable = true
            }
        }
        else if (e.target.name == 'pincode') {
            setPincode(e.target.value)
            if (e.target.value.length == 6) {
                const pinCodes = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincode`)
                let data = await pinCodes.json()
                if (Object.keys(data).includes(e.target.value)) {
                    setCity(data[e.target.value][0])
                    setState(data[e.target.value][1])
                    // setDisable(false)
                    disable = false
                }
                else {
                    setCity("This pincode is not available")
                    setState("This pincode is not available")
                    // setDisable(true)
                    disable = true
                }
            }
            else {
                setCity("This pincode is not available")
                setState("This pincode is not available")
                // setDisable(true)
                disable = true
            }
        }
        if (name.length > 3 && email.length > 3 && phone.length > 3 && address.length > 3 && pincode.length > 3) {
            // setDisable(false)
            disable = false
        }
        else {
            // setDisable(true)
            disable = true
        }
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

    const handleDetails = async (e) => {
        e.preventDefault()
        // 'phone': req.body.phone, 'name': req.body.name, 'address': req.body.address, pin: req.body.pincode 
        let body = { email: email, name: name, phone: phone, address: address, pin: pincode }
        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/updateuserdetail`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        const json = await res.json()
        toast.success('Details is changed successfully', {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }
    return (
        <>
            <div className=" md:p-12 bg-gray-900 text-gray-200 mx-auto">
                <Head>
                    <title>Account</title>
                    <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" /></Head>
                <Script type="application/javascript" crossorigin="anonymous" src={`${process.env.NEXT_PUBLIC_PAYTIM_HOST}/merchantpgpui/checkoutjs/merchants/${process.env.NEXT_PUBLIC_PAYTIM_MID}`} />

                <div className="flex flex-col w-full px-0 mx-auto md:flex-row">
                    <div className="flex flex-col md:w-full">
                        <h2 className="mb-4 font-bold md:text-xl text-heading ">MY account</h2>
                        <form method="POST" className="justify-center w-full mx-auto">
                            <div className="">
                                <div className="space-x-0 lg:flex lg:space-x-4">
                                    <div className="w-full">
                                        <label htmlFor="firstName" className="block mb-3 text-sm font-semibold text-gray-500">Name</label>
                                        <input onChange={handelChange} value={name} name="name" type="text" placeholder="Name"
                                            className="w-full px-4 py-3 text-sm border bg-gray-900 border-gray-500 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600" required />
                                    </div>
                                </div>
                                <div className="space-x-0 lg:flex lg:space-x-4 mt-5">
                                    <div className="w-full lg:w-1/2">
                                        <label htmlFor="city"
                                            className="block mb-3 text-sm font-semibold text-gray-500">City</label>
                                        <input onChange={handelChange} value={email} name="city" type="text" placeholder="City"
                                            className="w-full px-4 py-3 text-sm border bg-gray-900 border-gray-500 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600" required />
                                        <span className="block mb-1 text-sm font-semibold text-gray-500">Email cannot be changeable</span>
                                    </div>
                                    <div className="w-full lg:w-1/2">
                                        <label htmlFor="phone" className="block mb-3 text-sm font-semibold text-gray-500">Phone</label>
                                        <input onChange={handelChange} value={phone} name="phone" type="text" placeholder="Phone"
                                            className="w-full px-4 py-3 text-sm border bg-gray-900 border-gray-500 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600" required />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="w-full">
                                        <label htmlFor="Address"
                                            className="block mb-3 text-sm font-semibold text-gray-500">Address</label>
                                        <textarea onChange={handelChange} value={address}
                                            className="w-full px-4 py-3 text-xs border bg-gray-900 border-gray-500 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                                            name="address" cols="20" rows="4" placeholder="Address" required></textarea>
                                    </div>
                                </div>
                                <div className="space-x-0 lg:flex lg:space-x-4">

                                    <div className="w-full  ">
                                        <label htmlFor="postcode" className="block mb-3 text-sm font-semibold text-gray-500">
                                            PinCode</label>
                                        <input onChange={handelChange} required value={pincode} name="pincode" type="text" placeholder="Enter your PinCode"
                                            className="w-full px-4 py-3 text-sm border bg-gray-900 border-gray-500 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600" />
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
                                    <button disabled={disable} onClick={handleDetails} className="disabled:bg-gray-600 disabled:text-gray-500 w-full rounded-lg px-6 py-2 text-white bg-gray-900 active:bg-gray-800 ">Conform change</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        </>
    )
}


export default checkout