import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
const login = ({ setSideCart }) => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  useEffect(() => {
    setSideCart(false)
  }, [])
  const onSubmit = async (e) => {
    e.preventDefault()
    let body = { email, password }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const json = await res.json()
      if (json.success == true) {
        localStorage.setItem("token", json.token)
        router.push('/')
        toast.success('You are loged in', {
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
        console.clear()
        toast.error('Wrong Credentails', {
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
    catch {
      toast.error('Internal Server error', {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    setEmail("")
    setPassword("")
  }

  const onChange = (e) => {
    if (e.target.name == 'email') {
      setEmail(e.target.value)
    }
    if (e.target.name == 'password') {
      setPassword(e.target.value)
    }
  }



  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Head>
        <title>Login</title>
      </Head>
      <div className="bg-gray-900 flex py-32">
        <div className="flex-col flex ml-auto mr-auto items-center w-full lg:w-2/3 md:w-3/5">
          <h1 className="font-bold text-2xl my-10 text-white"> Login </h1>
          <form onSubmit={onSubmit} method="POST" className="mt-2 flex flex-col lg:w-1/2 w-8/12">
            <div className="flex flex-wrap items-stretch w-full relative h-15 bg-gray-900 rounded mb-6 pr-10">
              <div className="flex -mr-px justify-center w-15 p-4 bg-gray-900 ">

              </div>
              <input value={email} name="email" onChange={onChange}
                type="text"
                className="rounded-md text-gray-200 flex-shrink flex-grow leading-normal w-px flex-1 border h-10 bg-gray-900  border-gray-400  px-3 self-center relative  font-roboto text-xl outline-none"
                placeholder="Email"
              />
            </div>
            <div className="flex flex-wrap  w-full relative h-15  items-center rounded mb-4  pr-10">
              <div className="flex -mr-px justify-center w-15 p-4 bg-gray-900 ">

              </div>
              <input value={password} name="password"
                onChange={onChange} type="password"
                className="rounded-md text-gray-200 text-flex-shrink flex-grow  border  leading-normal w-px flex-1 bg-gray-900   border-gray-400  h-10 px-3 relative self-center font-roboto text-xl outline-none"
                placeholder="Password"
              />
             
            </div>
            <div className='flex justify-between'>
              <Link href={'/forgot'}><span className=" cursor-pointer  text-white  font-roboto\ hover:underline mb-6">Forget Password ?</span></Link>
              <Link href={'/signup'}><span className="text-base cursor-pointer text-white  font-roboto leading-normal hover:underline mb-6">Create account</span></Link>
            </div>
            <button className="cursor-pointer bg-gray-900 active:bg-gray-800 border border-gray-400 py-4 text-center px-17 md:px-12 md:py-4 text-white rounded leading-tight text-xl md:text-base font-sans mt-4 mb-20">Login</button>
          </form>
        </div>
      </div>
    </>
  )
}
export default login