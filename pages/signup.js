import React from 'react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head'
const signup = ({ setSideCart }) => {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState(false)
  useEffect(() => {
    setSideCart(false)
  }, [])
  const onSubmit = async (e) => {
    e.preventDefault()
    let body = { name, email, password, mode }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const json = await res.json()
      if (json.success == true) {
        localStorage.setItem("token", json.token)
        router.push('/')
        toast.success('Thanks for Signup', {
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
        toast.error('This email is already in use', {
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
      toast.error('Internal server error, Please try again', {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    setName("")
    setEmail("")
    setPassword("")
  }

  const onChange = (e) => {

    if (e.target.name == 'name') {
      setName(e.target.value)
    }
    if (e.target.name == 'email') {
      setEmail(e.target.value)
    }
    if (e.target.name == 'password') {
      setPassword(e.target.value)
    }
  }


  return (
    <>
      <Head>
        <title>Signup</title>
      </Head>

      <div className="bg-gray-900 flex text-white py-24">
        <div className="flex-col flex ml-auto mr-auto items-center w-full lg:w-2/3 md:w-3/5">
          <h1 className="font-bold text-2xl my-10 text-white"> SignUp </h1>
          <form onSubmit={onSubmit} className="mt-2 flex flex-col lg:w-1/2 w-8/12">
            <div className="flex flex-wrap items-stretch w-full relative h-15 bg-white rounded mb-6 ">

              <input name='name' onChange={onChange} value={name}
                type="text"
                className="bg-gray-900 border border-gray-200 rounded-md flex-shrink flex-grow leading-normal w-px flex-1 h-10 border-grey-light  px-3 self-center relative  font-roboto text-xl outline-none"
                placeholder="Name" required
              />
            </div>
            <div className="flex flex-wrap items-stretch w-full relative h-15 bg-white rounded mb-6 ">

              <input name='email' onChange={onChange} value={email}
                type="text"
                className="bg-gray-900 border border-gray-200 rounded-md flex-shrink flex-grow leading-normal w-px flex-1 h-10 border-grey-light  px-3 self-center relative  font-roboto text-xl outline-none"
                placeholder="Email" required
              />
            </div>
            <div className="flex flex-wrap  w-full relative h-15 bg-white items-center rounded mb-4">

              <input name='password' onChange={onChange} value={password}
                type="password"
                className="bg-gray-900 border border-gray-200 rounded-md flex-shrink flex-grow  leading-normal w-px flex-1 h-10 px-3 relative self-center font-roboto text-xl outline-none"
                placeholder="Password" required
              />

            </div>
            <Link href={'/login'}><span className='mt-5 cursor-pointer hover:underline'>Already! you have account.</span></Link>
            <button type="submit" className="bg-gray-900 py-4 text-center px-17 md:px-12 md:py-4 border border-gray-200 text-gray-200 rounded leading-tight text-xl md:text-base font-sans mt-4 mb-20 cursor-pointer active:bg-gray-800">SignUp</button>
          </form>
        </div>

      </div>
    </>
  )

}

export default signup