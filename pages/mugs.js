import Link from 'next/link'
import React, {useEffect} from 'react'
import Product from '../models/Product'
import connectDb from '../middleware/mongoose'
import Head from 'next/head';
const mugs = ({ mugs, setSideCart, findMode }) => {
  useEffect(() => {
    // findMode()
    setSideCart(false)
  }, [])
  return (
    <>
    <Head>
        <title>Mugs</title>
      </Head>
      {Object.keys(mugs).length == 0 && <div className='text-center py-64 text-2xl font-bold'>Sorry, mugs is not availabe at this time. Please check few days later.</div>}
      { }
      <section className="bg-gray-900 text-white body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-5 justify-center">
            {Object.keys(mugs).map((item) => {
              return (
                <Link key={mugs[item]._id} href={`/products/${mugs[item].slug}`}>
                  <div className="lg:w-1/4 md:w-1/2 xl:ml-24 lg:ml-24 md:ml-52 mt-11 w-full cursor-pointer">
                    <a className="rounded">
                      <img alt="ecommerce" className="rounded-md" src={mugs[item].img} />
                    </a>
                    <div className="mt-4 flex justify-end text-center flex-col">
                      <h3 className="text-xs tracking-widest title-font mb-1">{mugs[item].title}</h3>
                      <hr className='mb-2' />
                      <p className="mt-1">₹ {mugs[item].price}</p>
                      <div>
                        {mugs[item].size.includes("S") && <span className='border border-gray-400 rounded-sm ml-1  px-1'>S</span>}
                        {mugs[item].size.includes("M") && <span className='border border-gray-400 rounded-sm ml-1  px-1'>M</span>}
                        {mugs[item].size.includes("L") && <span className='border border-gray-400 rounded-sm ml-1  px-1'>L</span>}
                        {mugs[item].size.includes("XL") && <span className='border border-gray-400 rounded-sm ml-1  px-1'>XL</span>}
                        {mugs[item].size.includes("XXL") && <span className='border border-gray-400 rounded-sm ml-1  px-1'>XXL</span>}
                      </div>

                      <div>
                        {mugs[item].color.includes("red") && <button className="mx-1 mt-2 border border-white bg-red-600 rounded-full w-6 h-6 focus:outline-none"></button>}
                        {mugs[item].color.includes("white") && <button className="mx-1 mt-2 border border-white bg-white rounded-full w-6 h-6 focus:outline-none"></button>}
                        {mugs[item].color.includes("black") && <button className="mx-1 mt-2 border border-white bg-black rounded-full w-6 h-6 focus:outline-none"></button>}
                        {mugs[item].color.includes("brown") && <button className="mx-1 mt-2 border border-white bg-red-900  rounded-full w-6 h-6 focus:outline-none"></button>}
                        {mugs[item].color.includes("green") && <button className="mx-1 mt-2 border border-white  bg-green-900 rounded-full w-6 h-6 focus:outline-none"></button>}
                        {mugs[item].color.includes("yellow") && <button className="mx-1 mt-2 border border-white  bg-yellow-500 rounded-full w-6 h-6 focus:outline-none"></button>}
                        {mugs[item].color.includes("pink") && <button className="mx-1 mt-2 border border-white bg-pink-600 rounded-full w-6 h-6 focus:outline-none"></button>}
                      </div>

                    </div>
                  </div>
                </Link>
              )
            })}

          </div>
        </div>
      </section>
    </>
  )
}
export async function getServerSideProps(context) {
  connectDb()
  let prodcuts = await Product.find({ category: 'mugs' })

  let mugs = {};
  for (let item of prodcuts) {

    if (item.title in mugs) {
      if (!mugs[item.title].color.includes(item.color) && item.availableQty > 0) {
        mugs[item.title].color.push(item.color)
      }
      if (!mugs[item.title].size.includes(item.size) && item.availableQty > 0) {
        mugs[item.title].size.push(item.size)
      }

    }
    else {
      mugs[item.title] = JSON.parse(JSON.stringify(item))
      if (item.availableQty > 0) {
        mugs[item.title].color = [item.color]
        mugs[item.title].size = [item.size]
      }
    }
  }
  return {
    props: { mugs: JSON.parse(JSON.stringify(mugs)) }
  }
}
export default mugs;




// import React from 'react'
// import Link from 'next/link'

// const mugs = () => {
//   return (
//     <>
//     <section className="bg-gray-900 text-white body-font">
//       <div className="container px-5 py-24 mx-auto">
//         <div className="flex flex-wrap -m-5">
//           <Link href={'/products/wear-the-code'}>
//           <div className=" lg:w-1/4 md:w-1/2 xl:ml-24 lg:ml-24 md:ml-52 mt-11 w-full cursor-pointer">
//             <a className="rounded">
//               <img alt="ecommerce" className="rounded-md" src="https://m.media-amazon.com/images/I/51HS1hlnWKL._AC_UL480_FMwebp_QL65_.jpg"/>
//             </a>
//             <div className="mt-4 flex justify-center text-center flex-col">
//               <h3 className="text-xs tracking-widest title-font mb-1">T-shirt</h3>
//               <h2 className="title-font text-lg font-medium">The Catalyzer</h2>
//               <p className="mt-1">₹499</p>
//             </div>
//           </div>
//           </Link>
//           <Link href={'/products/wear-the-code'}>
//           <div className=" lg:w-1/4 md:w-1/2 lg:ml-24 md:ml-52 mt-11 w-full cursor-pointer">
//             <a className="rounded">
//               <img alt="ecommerce" className="rounded-md" src="https://m.media-amazon.com/images/I/51HS1hlnWKL._AC_UL480_FMwebp_QL65_.jpg"/>
//             </a>
//             <div className="mt-4 flex justify-center text-center flex-col">
//               <h3 className="text-xs tracking-widest title-font mb-1">T-shirt</h3>
//               <h2 className="title-font text-lg font-medium">The Catalyzer</h2>
//               <p className="mt-1">₹499</p>
//             </div>
//           </div>
//           </Link>
//           <Link href={'/products/wear-the-code'}>
//           <div className=" lg:w-1/4 md:w-1/2 lg:ml-24 md:ml-52 mt-11 w-full cursor-pointer">
//             <a className="rounded">
//               <img alt="ecommerce" className="rounded-md" src="https://m.media-amazon.com/images/I/51HS1hlnWKL._AC_UL480_FMwebp_QL65_.jpg"/>
//             </a>
//             <div className="mt-4 flex justify-center text-center flex-col">
//               <h3 className="text-xs tracking-widest title-font mb-1">T-shirt</h3>
//               <h2 className="title-font text-lg font-medium">The Catalyzer</h2>
//               <p className="mt-1">₹499</p>
//             </div>
//           </div>
//           </Link>
//           <Link href={'/products/wear-the-code'}>
//           <div className=" lg:w-1/4 md:w-1/2 lg:ml-24 md:ml-52 mt-11 w-full cursor-pointer">
//             <a className="rounded">
//               <img alt="ecommerce" className="rounded-md" src="https://m.media-amazon.com/images/I/51HS1hlnWKL._AC_UL480_FMwebp_QL65_.jpg"/>
//             </a>
//             <div className="mt-4 flex justify-center text-center flex-col">
//               <h3 className="text-xs tracking-widest title-font mb-1">T-shirt</h3>
//               <h2 className="title-font text-lg font-medium">The Catalyzer</h2>
//               <p className="mt-1">₹499</p>
//             </div>
//           </div>
//           </Link>
//           <Link href={'/products/wear-the-code'}>
//           <div className=" lg:w-1/4 md:w-1/2 lg:ml-24 md:ml-52 mt-11 w-full cursor-pointer">
//             <a className="rounded">
//               <img alt="ecommerce" className="rounded-md" src="https://m.media-amazon.com/images/I/513UUvdpbiS._AC_UL480_FMwebp_QL65_.jpg"/>
//             </a>
//             <div className="mt-4 flex justify-center text-center flex-col">
//               <h3 className="text-xs tracking-widest title-font mb-1">T-shirt</h3>
//               <h2 className="title-font text-lg font-medium">The Catalyzer</h2>
//               <p className="mt-1">₹499</p>
//             </div>
//           </div>
//           </Link>
//           <Link href={'/products/wear-the-code'}>
//           <div className=" lg:w-1/4 md:w-1/2 lg:ml-24 md:ml-52 mt-11 w-full cursor-pointer">
//             <a className="rounded">
//               <img alt="ecommerce" className="rounded-md" src="https://m.media-amazon.com/images/I/513UUvdpbiS._AC_UL480_FMwebp_QL65_.jpg"/>
//             </a>
//             <div className="mt-4 flex justify-center text-center flex-col">
//               <h3 className="text-xs tracking-widest title-font mb-1">T-shirt</h3>
//               <h2 className="title-font text-lg font-medium">The Catalyzer</h2>
//               <p className="mt-1">₹499</p>
//             </div>
//           </div>
//           </Link>
//           <Link href={'/products/wear-the-code'}>
//           <div className=" lg:w-1/4 md:w-1/2 lg:ml-24 md:ml-52 mt-11 w-full cursor-pointer">
//             <a className="rounded">
//               <img alt="ecommerce" className="rounded-md" src="https://m.media-amazon.com/images/I/513UUvdpbiS._AC_UL480_FMwebp_QL65_.jpg"/>
//             </a>
//             <div className="mt-4 flex justify-center text-center flex-col">
//               <h3 className="text-xs tracking-widest title-font mb-1">T-shirt</h3>
//               <h2 className="title-font text-lg font-medium">The Catalyzer</h2>
//               <p className="mt-1">₹499</p>
//             </div>
//           </div>
//           </Link>
//           <Link href={'/products/wear-the-code'}>
//           <div className=" lg:w-1/4 md:w-1/2 lg:ml-24 md:ml-52 mt-11 w-full cursor-pointer">
//             <a className="rounded">
//               <img alt="ecommerce" className="rounded-md" src="https://m.media-amazon.com/images/I/513UUvdpbiS._AC_UL480_FMwebp_QL65_.jpg"/>
//             </a>
//             <div className="mt-4 flex justify-center text-center flex-col">
//               <h3 className="text-xs tracking-widest title-font mb-1">T-shirt</h3>
//               <h2 className="title-font text-lg font-medium">The Catalyzer</h2>
//               <p className="mt-1">₹499</p>
//             </div>
//           </div>
//           </Link>
//           <Link href={'/products/wear-the-code'}>
//           <div className=" lg:w-1/4 md:w-1/2 lg:ml-24 md:ml-52 mt-11 w-full cursor-pointer">
//             <a className="rounded">
//               <img alt="ecommerce" className="rounded-md" src="https://m.media-amazon.com/images/I/41UFaecbUWL._AC_UL480_FMwebp_QL65_.jpg"/>
//             </a>
//             <div className="mt-4 flex justify-center text-center flex-col">
//               <h3 className="text-xs tracking-widest title-font mb-1">T-shirt</h3>
//               <h2 className="title-font text-lg font-medium">The Catalyzer</h2>
//               <p className="mt-1">₹499</p>
//             </div>
//           </div>
//           </Link>
//           <Link href={'/products/wear-the-code'}>
//           <div className=" lg:w-1/4 md:w-1/2 lg:ml-24 md:ml-52 mt-11 w-full cursor-pointer">
//             <a className="rounded">
//               <img alt="ecommerce" className="rounded-md" src="https://m.media-amazon.com/images/I/41UFaecbUWL._AC_UL480_FMwebp_QL65_.jpg"/>
//             </a>
//             <div className="mt-4 flex justify-center text-center flex-col">
//               <h3 className="text-xs tracking-widest title-font mb-1">T-shirt</h3>
//               <h2 className="title-font text-lg font-medium">The Catalyzer</h2>
//               <p className="mt-1">₹499</p>
//             </div>
//           </div>
//           </Link>
//           <Link href={'/products/wear-the-code'}>
//           <div className=" lg:w-1/4 md:w-1/2 lg:ml-24 md:ml-52 mt-11 w-full cursor-pointer">
//             <a className="rounded">
//               <img alt="ecommerce" className="rounded-md" src="https://m.media-amazon.com/images/I/41UFaecbUWL._AC_UL480_FMwebp_QL65_.jpg"/>
//             </a>
//             <div className="mt-4 flex justify-center text-center flex-col">
//               <h3 className="text-xs tracking-widest title-font mb-1">T-shirt</h3>
//               <h2 className="title-font text-lg font-medium">The Catalyzer</h2>
//               <p className="mt-1">₹499</p>
//             </div>
//           </div>
//           </Link>
//           <Link href={'/products/wear-the-code'}>
//           <div className=" lg:w-1/4 md:w-1/2 lg:ml-24 md:ml-52 mt-11 w-full cursor-pointer">
//             <a className="rounded">
//               <img alt="ecommerce" className="rounded-md" src="https://m.media-amazon.com/images/I/41UFaecbUWL._AC_UL480_FMwebp_QL65_.jpg"/>
//             </a>
//             <div className="mt-4 flex justify-center text-center flex-col">
//               <h3 className="text-xs tracking-widest title-font mb-1">T-shirt</h3>
//               <h2 className="title-font text-lg font-medium">The Catalyzer</h2>
//               <p className="mt-1">₹499</p>
//             </div>
//           </div>
//           </Link>
         
//         </div>
//       </div>
//     </section>
//   </>
//   )
// }

// export default mugs