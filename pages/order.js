import React, { useEffect } from 'react'
import Order from '../models/Orders'
import connectDb from '../middleware/mongoose'
import { useRouter } from 'next/router'
import Head from 'next/head';
const Myorder = ({ order, setSideCart }) => {

  let product = order.products
  const router = useRouter()
  useEffect(() => {
    // findMode()
    setSideCart(false)
    if (Object.keys(order).length == 0) {
      router.push('/')
    }

  }, [])


  return (
    <>
      <Head>
        <title>Order</title>
      </Head>
      <section className="text-gray-300 body-font bg-gray-900">
        {Object.keys(order).length == 0 ? <div className='text-6xl text-center py-44 font-bold'>No have Orders</div> : <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">ROOTCHOICE</h2>
              <h1 className="text-gray-300 text-3xl title-font font-medium mb-4">Your OrderID: {order.OrderId}</h1>
              <span>Your order has been successfully placed. Your payment Status is: <span className='font-bold underline'>{order.status}</span></span>
              <div className="flex mb-4 mt-8">
                <a className="flex-grow py-2 text-lg px-1">Item Description</a>
                <a className="flex-grow  py-2 text-lg px-1">Quantity</a>
                <a className="flex-grow  py-2 text-lg px-1">Item Total</a>
              </div>
              {product.map((e) => {
                return (
                  <div key={e.slug} className="flex  border-t border-gray-200 py-2">
                    <span className="px-1 flex-grow w-20 md:w-32 py-2 text-gray-300">{e.slug} ({e.size}/{e.varient})</span>
                    <span className="px-1 flex-grow  py-2 ml-auto text-gray-300">{e.quantity}</span>
                    <span className="px-1 flex-grow  py-2 ml-auto text-gray-300">₹{e.price}</span>
                  </div>
                )
              })}

              <div className="flex mt-5 flex-col">
                <span className='font-bold '>SubTotal: ₹{order.amount}</span>
                <button className="ml-2  hover:border-white bg-slate-800 border-2 border-slate-700 mt-3 hover:text-white  text-gray-400  py-2 px-6 focus:outline-none active:bg-gray-800 rounded">Track Order</button>
              </div>
            </div>
            <img alt="ecommerce" className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded" src="https://dummyimage.com/400x400" />
          </div>
        </div>}
      </section>
    </>
  )

}

export async function getServerSideProps(context) {
  connectDb()
  let order
  if (context.query.id == undefined) {
    order = {}
  }
  else {

    order = await Order.findById({ "_id": context.query.id })
  }
  return {
    props: { order: JSON.parse(JSON.stringify(order)) }
  }
}

export default Myorder