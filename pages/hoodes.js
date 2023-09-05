import Link from 'next/link'
import React, { useEffect } from 'react'
import Product from '../models/Product'
import connectDb from '../middleware/mongoose'
import Head from 'next/head';
const hoodes = ({ hoodes, setSideCart }) => {
  useEffect(() => {
    setSideCart(false)
  }, [])
  return (
    <>
      <Head>
        <title>Hoodes</title>
      </Head>
      
      <section className="bg-gray-900 text-white body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-5 justify-center">
          {Object.keys(hoodes).length == 0 ? <div className='text-center py-64 text-2xl font-bold'>Sorry, Hoodes is not availabe at this time. Please check few days later.</div> : { }}
      
            {Object.keys(hoodes).map((item) => {
              return (
                <Link key={hoodes[item]._id} href={`/products/${hoodes[item].slug}`}>
                  <div className="lg:w-1/4 md:w-1/2 xl:ml-24 lg:ml-24 md:ml-52 mt-11 w-full cursor-pointer">
                    <a className="rounded">
                      <img alt="ecommerce" className="rounded-md" src={hoodes[item].img} />
                    </a>
                    <div className="mt-4 flex justify-end text-center flex-col">
                      <h3 className="text-xs tracking-widest title-font mb-1">{hoodes[item].title}</h3>
                      <hr className='mb-2' />
                      <p className="mt-1">₹ {hoodes[item].price}</p>
                      <div>
                        {hoodes[item].size.includes("S") && <span className='border border-gray-400 rounded-sm ml-1  px-1'>S</span>}
                        {hoodes[item].size.includes("M") && <span className='border border-gray-400 rounded-sm ml-1  px-1'>M</span>}
                        {hoodes[item].size.includes("L") && <span className='border border-gray-400 rounded-sm ml-1  px-1'>L</span>}
                        {hoodes[item].size.includes("XL") && <span className='border border-gray-400 rounded-sm ml-1  px-1'>XL</span>}
                        {hoodes[item].size.includes("XXL") && <span className='border border-gray-400 rounded-sm ml-1  px-1'>XXL</span>}
                      </div>

                      <div>
                        {hoodes[item].color.includes("red") && <button className="mx-1 mt-2 border border-white bg-red-600 rounded-full w-6 h-6 focus:outline-none"></button>}
                        {hoodes[item].color.includes("white") && <button className="mx-1 mt-2 border border-white bg-white rounded-full w-6 h-6 focus:outline-none"></button>}
                        {hoodes[item].color.includes("black") && <button className="mx-1 mt-2 border border-white bg-black rounded-full w-6 h-6 focus:outline-none"></button>}
                        {hoodes[item].color.includes("brown") && <button className="mx-1 mt-2 border border-white bg-red-900  rounded-full w-6 h-6 focus:outline-none"></button>}
                        {hoodes[item].color.includes("green") && <button className="mx-1 mt-2 border border-white  bg-green-900 rounded-full w-6 h-6 focus:outline-none"></button>}
                        {hoodes[item].color.includes("yellow") && <button className="mx-1 mt-2 border border-white  bg-yellow-500 rounded-full w-6 h-6 focus:outline-none"></button>}
                        {hoodes[item].color.includes("pink") && <button className="mx-1 mt-2 border border-white bg-pink-600 rounded-full w-6 h-6 focus:outline-none"></button>}
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
  let prodcuts = await Product.find({ category: 'hoodes' })

  let hoodes = {};
  for (let item of prodcuts) {

    if (item.title in hoodes) {
      if (!hoodes[item.title].color.includes(item.color) && item.availableQty > 0) {
        hoodes[item.title].color.push(item.color)
      }
      if (!hoodes[item.title].size.includes(item.size) && item.availableQty > 0) {
        hoodes[item.title].size.push(item.size)
      }

    }
    else {
      hoodes[item.title] = JSON.parse(JSON.stringify(item))
      if (item.availableQty > 0) {
        hoodes[item.title].color = [item.color]
        hoodes[item.title].size = [item.size]
      }
    }
  }
  return {
    props: { hoodes: JSON.parse(JSON.stringify(hoodes)) }
  }
}
export default hoodes;