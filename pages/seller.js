import React, { useState, useEffect } from 'react'
import jsonwebtoken from 'jsonwebtoken'
import Link from "next/link"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
function seller() {
    const [user, setUser] = useState(null)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [pincode, setPincode] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [address, setAddress] = useState('')
    const [phone, setPhone] = useState('')
    const [disable, setDisable] = useState(true)
    const router = useRouter()
    let knownNumber = null
    useEffect(() => {
        const token = localStorage.getItem('token')
        if(token){
            userDetails()
            fetchSellerDetails()
        }
        else{
            router.push('/login')
        }
    }, [])

    const fetchSellerDetails = async () =>{
        let token = localStorage.getItem('token')
        if(token){
        let user = jsonwebtoken.verify(token, process.env.NEXT_PUBLIC_SECRET_KEY)
        const body = {email:user.email}
        const url = `${process.env.NEXT_PUBLIC_HOST}/api/findMode`
        const res = await fetch(url, {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(body)
        })
        const json =await res.json()
        if(json.success == true){
            if(json.seller.email == user.email && knownNumber!= true){
                router.push('/admin')
            }
        }
    }
    }


    const saveSellerDetails = async () =>{
        const body = {name, email, phone, address, mode:true}
        const url = `${process.env.NEXT_PUBLIC_HOST}/api/seller`
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        const json = await res.json()
        if(json.success == true){
            console.log("yahi hai bhankaloda")
            router.push('/admin')
        }
        if(json.message == 'numbererror'){
            knownNumber = true
        toast.error("Sorry! This Number is already in use", {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })   
        }
    }

    const userDetails = async () => {
        let token = localStorage.getItem('token')
        let user = jsonwebtoken.verify(token, process.env.NEXT_PUBLIC_SECRET_KEY)
        setEmail(user.email)
        let body = { email: user.email, address, pin: pincode, phone, name, city, state }
        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/userDetails`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        let json = await res.json()
        if (json.user) {
            setUser(json.user)
            setEmail(json.user.email)
            setAddress(json.user.address)
            setPincode(json.user.pin)
            setPhone(json.user.phone)
            setName(json.user.name)
            setCity(json.user.city)
            setState(json.user.state)
        }
    }

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
        else if (e.target.name == 'email') {
            setEmail(e.target.value)
            if (e.target.value.length > 10) {
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
        if (name.length > 3 && email.length > 3 && phone.length > 3 && address.length > 3) {
            setDisable(false)
        }
        else {
            setDisable(true)
        }
    }


    return (
        <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
                <div className="lg:lg:w-[45%] md:w-1/2 md:pr-16 lg:pr-0 pr-0">
                    <h1 className="title-font font-medium text-3xl text-gray-900">CodesWear! Make your own business in simple steps :)</h1>
                    <p className="leading-relaxed mt-4">CodesWear!  Your choice here. Wear something new in form of code.</p>
                </div>
                <div className="lg:w-[47%] md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
                    <h2 className="text-gray-900 text-lg font-medium title-font mb-5">Sign Up</h2>
                    <div className="relative mb-4">
                        <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
                        <input onChange={handelChange} type="text" value={name} id="name" name="name" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                    </div>
                    <div className="relative mb-4">
                        <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
                        <input readOnly type="email" value={email} id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                    </div>
                    <div className="relative mb-4">
                        <label htmlFor="phone" className="leading-7 text-sm text-gray-600">Phone</label>
                        <input onChange={handelChange} type="phone" id="phone" name="phone" value={phone} className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                    </div>
                    <div className="relative mb-4">
                        <label htmlFor="Address" className="leading-7 text-sm text-gray-600">Address</label>
                        <input onChange={handelChange} type="Address" id="Address" name="address" value={address} className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                    </div>
                    <div className='flex justify-between'>
                        <button onClick={saveSellerDetails} disabled={disable} className="text-white w-[45%] bg-indigo-500 border-0 py-2 px-8 focus:outline-none disabled:bg-indigo-200 hover:bg-indigo-600 rounded text-lg">Continue</button>
                        {user == null ? <div></div> : <Link href={'/account'}><button className="text-white w-[45%] bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Change Details</button></Link>}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default seller

// export async function getServerSideProps(context) {

   
//     return {
//         props: { userVerify: JSON.parse(JSON.stringify(userVerify)) }
//     }
// }