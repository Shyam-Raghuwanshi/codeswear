import { useRouter } from 'next/router'
import React from 'react'
import { useState, useEffect } from 'react'
import Product from '../../models/Product'
import connectDb from '../../middleware/mongoose'
import Link from 'next/link'
import jsonwebtoken from 'jsonwebtoken'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Error from 'next/error'
const slug = ({ addToCart, product, varients, error }) => {
  const router = useRouter()
  const { slug } = router.query;
  const [pin, setPin] = useState('')
  const [service, setService] = useState()
  const [color, setColor] = useState(product != null && product.color)
  const [size, setSize] = useState(product != null && product.size)
  const [email, setEmail] = useState(null)
  useEffect(() => {
    let token = localStorage.getItem('token')
    if (token) {
      let user = jsonwebtoken.verify(token, process.env.NEXT_PUBLIC_SECRET_KEY)
      setEmail(user.email)
    }
  }, [])

  useEffect(() => {
    if (!error) {
      setColor(product.color)
      setSize(product.size)
    }
  }, [router.query])

  const handelPinCode = async () => {
    const pinCodes = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincode`)
    let data = await pinCodes.json()
    if (Object.keys(data).includes(pin)) {
      setService(true)
    }
    else {
      setService(false)
    }
  }

  const onChangePin = async (e) => {
    setPin(e.target.value)
  }

  const reloadPage = (newSize, newColor) => {
    let url = `http://localhost:3000/products/${varients[newColor][newSize]['slug']}`
    router.push(url)
  }

  const loginRequired = (string) => {
    toast.error(string, {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
  if (error) {
    return <Error statusCode={404} />
  }
  return <>

    <section className="text-gray-300 bg-gray-900 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          <img alt="ecommerce" className="rounded xl:h-96 mt-8" src={product.img} />
          <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">ROOTCHOICE</h2>
            <h1 className=" text-3xl title-font font-medium mb-1">{product.title} ({product.size}/{product.color})</h1>
            <p className="leading-relaxed mt-2">{product.desc}</p>
            <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
              <div className="flex">
                <span className="mr-3 mt-2">Color</span>
                {/* {Object.keys(varients).map((e) => {
                  { Object.keys(varients).includes("red") && Object.keys(varients['red']).includes(Object.keys(varients.e)) && <button onClick={() => { reloadPage(size, 'red') }} className={`mx-1 mt-2 border ${color === 'red' ? 'border-white' : 'border-gray-900'} bg-red-600 rounded-full w-6 h-6 focus:outline-none`}></button> }
                })} */}
                {product && Object.keys(varients).includes("red") && Object.keys(varients['red']).includes(Object.keys(varients).map((e) => { e })) && <button onClick={() => { reloadPage(size, 'red') }} className={`mx-1 mt-2 border ${color === 'red' ? 'border-white' : 'border-gray-900'} bg-red-600 rounded-full w-6 h-6 focus:outline-none`}></button>}

                {Object.keys(varients).includes("white") && Object.keys(varients['white']).includes(size) && <button onClick={() => { reloadPage(size, 'white') }} className={`mx-1 mt-2 border ${color === 'white' ? 'border-white' : 'border-gray-900'} bg-white rounded-full w-6 h-6 focus:outline-none`}></button>}

                {Object.keys(varients).includes("black") && Object.keys(varients['black']).includes(size) && <button onClick={() => { reloadPage(size, 'black') }} className={`mx-1 mt-2 border ${color === 'black' ? 'border-white' : 'border-gray-900'} bg-black rounded-full w-6 h-6 focus:outline-none`}></button>}

                {Object.keys(varients).includes("brown") && Object.keys(varients['brown']).includes(size) && <button onClick={() => { reloadPage(size, 'brown') }} className={`mx-1 mt-2 border ${color === 'brown' ? 'border-white' : 'border-gray-900'} bg-red-900  rounded-full w-6 h-6 focus:outline-none`}></button>}

                {Object.keys(varients).includes("green") && Object.keys(varients['green']).includes(size) && <button onClick={() => { reloadPage(size, 'green') }} className={`mx-1 mt-2 border ${color === 'green' ? 'border-white' : 'border-gray-900'}  bg-green-900 rounded-full w-6 h-6 focus:outline-none`}></button>}

                {Object.keys(varients).includes("yellow") && Object.keys(varients['yellow']).includes(size) && <button onClick={() => { reloadPage(size, 'yellow') }} className={`mx-1 mt-2 border ${color === 'yellow' ? 'border-white' : 'border-gray-900'}  bg-yellow-500 rounded-full w-6 h-6 focus:outline-none`}></button>}

                {Object.keys(varients).includes("pink") && Object.keys(varients['pink']).includes(size) && <button onClick={() => { reloadPage(size, 'pink') }} className={`mx-1 mt-2 border ${color === 'pink' ? 'border-white' : 'border-gray-900'} bg-pink-700 rounded-full w-6 h-6 focus:outline-none`}></button>}


              </div>
              <div className="flex ml-6 items-center">
                <span className="mr-3">Size</span>
                <div className="relative">
                  <select value={size} onChange={(e) => { reloadPage(e.target.value, color) }} className="rounded border appearance-none border-gray-300 py-2 focus:outline-none bg-gray-900 focus:ring-2 focus:bg-gray-900 focus:border-indigo-500 text-base pl-3 pr-10">
                    {Object.keys(varients[color]).includes('S') && <option value={'S'}>S</option>}
                    {Object.keys(varients[color]).includes('M') && <option value={'M'}>M</option>}
                    {Object.keys(varients[color]).includes('L') && <option value={'L'}>L</option>}
                    {Object.keys(varients[color]).includes('XL') && <option value={'XL'}>XL</option>}
                    {Object.keys(varients[color]).includes('XXL') && <option value={'XXL'}>XXL</option>}
                  </select>
                  <span className="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4" viewBox="0 0 24 24">
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex pb-6 justify-between">
              {product.availableQty != '0' && <span className="title-font font-medium text-2xl">₹ {product.price}</span>}
              {product.availableQty == '0' && <span className="title-font text-red-400 ">Sorry!, Item is outofstock.</span>}
              <div className='flex'>
                {email == null ? <Link href={`http://localhost:3000/login`}><button onClick={() => { loginRequired("Please login or signup for buynow") }} disabled={product.availableQty <= 0} className="flex ml-auto text-white bg-gray-700 border-0 py-2 px-3 disabled:bg-slate-500 focus:outline-none active:bg-gray-600 rounded">Buy Now</button></Link> :
                  <Link href={`http://localhost:3000/buynow?slug=${slug}&q=${1}`}><button disabled={product.availableQty <= 0} className="flex ml-auto text-white bg-gray-700 border-0 py-2 px-3 disabled:bg-slate-500 focus:outline-none active:bg-gray-600 rounded">Buy Now</button></Link>}

                {email == null ? <Link href={'http://localhost:3000/login'}><button onClick={() => { loginRequired("Please login or signup for build your cart") }} disabled={product.availableQty <= 0} className="ml-2 flex text-white disabled:bg-slate-500 bg-gray-700 border-0 py-2 px-3 focus:outline-none active:bg-gray-600 rounded">Add to Cart</button></Link>
                  : <button onClick={() => { addToCart(email, slug, 1, product.price, product.title, size, color, product.img) }} disabled={product.availableQty <= 0} className="ml-2 disabled:bg-slate-500 flex text-white bg-gray-700 border-0 py-2 px-3 focus:outline-none active:bg-gray-600 rounded">Add to Cart</button>}
              </div>
            </div>
            <div className="w-full">
              <div className="">Pleae check your pincode, your are aligable or not for delivery this item</div>
              <div className="flex mt-5">
                <input onChange={onChangePin} className='border-2 bg-gray-900 border-slate-400 rounded-l-md' placeholder='Enter your pin' />
                <button onClick={handelPinCode} className=' text-white border-slate-400 border-2 border-l-0 rounded-r-md py-2 px-4 bg-gray-900'>Check</button>
              </div>
              {(service && service != null) && <span className='text-green-600'>Yeh! This item is availabe for this pincode</span>}
              {(!service && service != null) && <span className='text-red-600 block mt-2'>Sorry! This item is not availabe for this pincode</span>}

            </div>
          </div>
        </div>
      </div>
    </section>
  </>

}

export async function getServerSideProps(context) {
  connectDb()
  let product = await Product.findOne({ slug: context.query.slug })
  if (product == null) {
    return {
      props: { error: 'error' }
    }
  }
  let varients = await Product.find({ title: product.title, category: 'tshirt' })
  let colorSizeSlug = {};
  for (let item of varients) {
    if (Object.keys(colorSizeSlug).includes(item.color)) {
      /*
       { 'black': { 'S' : {slug: 'askdkdsjkfja'}},
                  { 'M' : {slug:  "skdjfkalsjd"}},
                  { 'L' : {slug:  "ksdjkfjsd"}}
      }   
      */
      colorSizeSlug[item.color][item.size] = { slug: item.slug }
    }
    else {
      colorSizeSlug[item.color] = {}
      colorSizeSlug[item.color][item.size] = { slug: item.slug }
      /*
       {
          'black': { 'S' : {slug: 'askdkdsjkfja'}},
          'white': { 'L' : {slug: 'askskdjfdkdja'}},
          'yellow': { 'XXL' : {slug: 'askdsjkfja'}}
      }   
      */

    }
  }
  return {
    props: { product: JSON.parse(JSON.stringify(product)), varients: JSON.parse(JSON.stringify(colorSizeSlug)) }
  }
}
export default slug