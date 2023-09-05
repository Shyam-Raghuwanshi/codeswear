import React from 'react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
const Myorders = ({ setSideCart, findMode }) => {
    const [orders, setOrders] = useState({})
    let router = useRouter()
    useEffect(async () => {
        // findMode()
        setSideCart(false)
        let token = localStorage.getItem("token")
        if (!token) {
            router.push('/')
        }
        else {
            let body = { token }
            const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/myorders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
            const json = await res.json()
            setOrders(json.order)
        }
    }, [])

    return (
        <>
            <Head>
                <title>Orders</title>
            </Head>
            <div className="bg-gray-900 text-white flex flex-col pt-20 pb-96">

                {Object.keys(orders).length == 0 ? <div></div> : <span className='text-center text-4xl ml-20 mb-5 underline'>My Orders</span>}
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="overflow-hidden">
                            {Object.keys(orders).length == 0 ? <div className='text-6xl text-center mt-10 font-bold'>No have Orders</div> : <table className=" min-w-full text-center">
                                <thead className="border-b">
                                    <tr>
                                        <th scope="col" className="text-sm font-medium  px-6 py-4">
                                            OrderID
                                        </th>
                                        <th scope="col" className="text-sm font-medium  px-6 py-4">
                                            Status
                                        </th>
                                        <th scope="col" className="text-sm font-medium  px-6 py-4">
                                            Product Quantity
                                        </th>
                                        <th scope="col" className="text-sm font-medium  px-6 py-4">
                                            Amount
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className=''>
                                    {
                                        Object.keys(orders).map((item) => {
                                            return (
                                                <Link key={orders[item]._id} href={`/order?id=${orders[item]._id}`}><tr className="border-b cursor-pointer h-20 bg-gray-800 boder-gray-900">
                                                    <td className="text-sm text-white font-medium px-6 py-4 whitespace-nowrap">
                                                        #{orders[item].OrderId}
                                                    </td>
                                                    <td className="text-sm text-white font-light px-6 py-4 whitespace-nowrap">
                                                        {orders[item].status}
                                                    </td>
                                                    <td className="text-sm text-white font-light px-6 py-4 whitespace-nowrap">
                                                        {orders[item].products[0].quantity}
                                                    </td>
                                                    <td className="text-sm text-white font-light px-6 py-4 whitespace-nowrap">
                                                        {orders[item].amount}
                                                    </td>
                                                </tr></Link>
                                            )
                                        })
                                    }




                                </tbody>
                            </table>}
                            {Object.keys(orders).length == 0 ? <div className='text-center font-light  mt-5'>Please place some Orders for preview :)</div> : <div></div>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default Myorders