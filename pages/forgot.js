import Head from 'next/head';
import React, { useEffect } from 'react'
const htmlForgot = ({ findMode }) => {
    useEffect(() => {
        // findMode()
    }, [])

    return (
        <>
            <Head>
                <title>Forgot</title>
            </Head>
            <div className="font-mono bg-gray-900 text-white">

                <div className="container mx-auto">
                    <div className="flex justify-center py-32">

                        <div className="w-full xl:w-3/4 lg:w-11/12 flex justify-center">

                            <div className="w-full pl-16 lg:w-1/2 bg-gray-900 text-white p-5 rounded-lg lg:rounded-l-none">
                                <htmlform className="px-8 pt-6 pb-8 mb-4  rounded">
                                    <div className="mb-4">
                                        <label className="block mb-2 text-lg font-bold text-gray-300" htmlFor="email">
                                            Email
                                        </label>
                                        <input
                                            className="bg-gray-900 text-gray-200  border-gray-400 w-full px-3 py-2 text-lg leading-tight  border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                            id="email"
                                            type="text"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    {/* <div className="mb-4">
                                    <label className="block mb-2 text-lg font-bold text-gray-300" >
                                        Password
                                    </label>
                                    <input
                                        className="bg-gray-900 text-gray-200  border-gray-400 w-full px-3 py-2 mb-3 text-lg leading-tight  border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                        id="password"
                                        type="password"
                                        placeholder='password'
                                    />
                                    <p className="text-xs italic ">Please choose a password.</p>
                                </div> */}

                                    <div className="text-center mt-6"><span
                                        className="inline-block border  px-4 py-1 rounded-lg cursor-pointer border-gray-400 text-lg bg-gray-900 text-gray-300 align-baseline active:bg-gray-800"
                                        href="./register.html"
                                    >
                                        Continue
                                    </span>
                                    </div>

                                </htmlform>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default htmlForgot