import '../styles/globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import LoadingBar from 'react-top-loading-bar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsonwebtoken from 'jsonwebtoken'
// import Seller from '../models/Seller'
// import connectDb from '../middleware/mongoose'


function MyApp({ Component, pageProps }) {
  const [sideCart, setSideCart] = useState(false)
  const [progress, setProgress] = useState(0)
  const [cart, setCart] = useState(null)
  const [subtotal, setSubtotal] = useState(0)
  const [slug, setSlug] = useState()
  const [user, setUser] = useState({ value: null })
  const [key, setKey] = useState()
  // const [token, setToken] = useState(null)
  const [useremail, setUseremail] = useState(null)
  const router = useRouter()


  // toggle cart 
  const toggleCart = () => {
    setSideCart(!sideCart)
  };

  // Calculate subtotal
  const calculateSubTotal = async () => {
    let token = localStorage.getItem("token")
    if (token) {
      let user = jsonwebtoken.verify(token, process.env.NEXT_PUBLIC_SECRET_KEY)
      // const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
      // if (Math.floor((new Date).getTime() / 1000) >= expiry) {
      //   logout()
      //   localStorage.removeItem('token')
      // }
      if (token) {
        let body = { email: user.email }
        const fetchCart = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/fetchcart`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
        let newcart = await fetchCart.json()
        let price = 0
        let priceArr = []
        for (let i = 0; i < newcart.length; i++) {
          price += newcart[i].price * newcart[i].quantity
          priceArr.push(price)
        }
        setSubtotal(price)
      }
      else {
        router.push('/')
      }
    }

    else {
      setSubtotal(0)
    }

  }

  // Fetch all added items for backend cart
  const fetchCartFunction = async () => {
    try {
      let token = localStorage.getItem("token")
      if (token) {
        let user = jsonwebtoken.verify(token, process.env.NEXT_PUBLIC_SECRET_KEY)
        let body = { email: user.email }
        const fetchCart = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/fetchcart`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
        let newcart = await fetchCart.json()
        setCart(newcart)
        calculateSubTotal()
      }
      else {

      }
    }
    catch {
      router.push("/")
    }
  }


  // This is useEffect is callback is run only one time
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
      if (Math.floor((new Date).getTime() / 1000) >= expiry) {
        logout()
        localStorage.removeItem('token')
      }
    }
    fetchCartFunction()
    calculateSubTotal()
    setKey(Math.random())
    router.events.on('routeChangeStart', () => {
      setProgress(10)
    })
    router.events.on('routeChangeComplete', () => {
      setProgress(100)
    })
    const checkExpiry = () => {
      if (token) {
        setUser({ value: token })
        let t = localStorage.getItem('token')
        if (t) {
          try {
            let user = jsonwebtoken.verify(token, process.env.NEXT_PUBLIC_SECRET_KEY)
            setUseremail(user.email)
          }
          catch {
            router.push("/")
          }
        }
      }
      else {
        setCart(null)
      }

    }

    checkExpiry()
  }, [router.query])

  useEffect(() => {
    let token = localStorage.getItem('token')
    if (token) {
      // for token is expired or not 
      const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
      if (Math.floor((new Date).getTime() / 1000) >= expiry) {
        logout()
        localStorage.removeItem('token')
      }
    }
  }, [router.query])




  // Logout function
  const logout = () => {
    setCart(null)
    localStorage.removeItem('token')
    setUser({ value: null })
    setKey(Math.random())
    toast.success('Logout successfully', {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
  // Remove and decrease a item quantity function for cart
  const removeOneItem = async (slug, title, price, name, size, varient) => {
    let token = localStorage.getItem("token")
    if (token) {
      let user = jsonwebtoken.verify(token, process.env.NEXT_PUBLIC_SECRET_KEY)
      let body = { email: user.email }
      const fetchCart = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/fetchcart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const fetchCartData = await fetchCart.json()

      for (let i = 0; i < fetchCartData.length; i++) {
        const element = fetchCartData[i];
        if (slug == element.slug) {
          let updateCartBody = { _id: element._id, slug, title, price, name, size, varient, quantity: element.quantity - 1 }
          await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/updatecart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateCartBody)
          })

          fetchCartFunction()
          calculateSubTotal()
          toast.success('Item is updated', {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          });
          if (element.quantity <= 1) {
            let removeFromCartBody = { _id: element._id }
            await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/removefromcart`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(removeFromCartBody)
            })
            fetchCartFunction()
            toast.success('Product is removed', {
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
      }
    }
  }

  // Add and increase a item quantity function for cart
  const addToCart = async (email, slug, title, price, name, size, varient, img) => {
    let body = { email, slug, title, price, name, size, varient, img }
    let token = localStorage.getItem('token')
    try {
      if (token) {
        let user = jsonwebtoken.verify(token, process.env.NEXT_PUBLIC_SECRET_KEY)
        let emailBody = { email: user.email }
        const fetchCart = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/fetchcart`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailBody)
        })

        const fetchCartData = await fetchCart.json()
        let item = []
        let checkEmail = []; ''
        for (let element in fetchCartData) {
          item.push(fetchCartData[element].slug)
          checkEmail.push(fetchCartData[element].email)

        }
        if (fetchCartData.length == 0 || !item.includes(slug) || !checkEmail.includes(email)) {
          await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/addtocart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          })
          fetchCartFunction()
          toast.success('Product is added', {
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
          for (let i = 0; i < fetchCartData.length; i++) {
            const element = fetchCartData[i];
            if (slug == element.slug) {
              let body = { _id: element._id, quantity: element.quantity + 1, slug }
              const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/updatecart`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
              })
              let json = await res.json()
              if (!json.success) {
                toast.error(json.error, {
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
                toast.success('Item is updated', {
                  position: "bottom-center",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
                fetchCartFunction()
              }
            }
          }
        }
      }
    }
    catch {
      router.push('/')
    }
  }


  const clearCart = async () => {
    let token = localStorage.getItem('token')
    if (token) {
      let user = jsonwebtoken.verify(token, process.env.NEXT_PUBLIC_SECRET_KEY)
      let body = { email: user.email }
      const fetchCart = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/fetchcart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const fetchCartData = await fetchCart.json()
      for (let i = 0; i < fetchCartData.length; i++) {
        const element = fetchCartData[i];
        let clearCartBody = { _id: element._id }
        await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/removefromcart`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(clearCartBody)
        })
      }
      fetchCartFunction()
      calculateSubTotal()
      toast.success('Cart is clear', {
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

  const removeFullItem = async (id) => {
    let deleteoneitemBody = { _id: id }
    await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/deleteoneitem`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deleteoneitemBody)
    })
    fetchCartFunction()
    calculateSubTotal()
    toast.success('Product is removed', {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }


  const buynow = async (slug) => {
    let body = { slug }
    let response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/products/buynow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    let json = await response.json()
    setSlug(json)
    localStorage.setItem('slug', slug)
  }

  return <>
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
    <LoadingBar
      color='#f11946'
      progress={progress}
      onLoaderFinished={() => { setProgress(0) }}
      shadow={true}
      height={3}
      transitionTime={1000}
      loaderSpeed={500}
      waitingTime={400}
    />
    <Navbar toggleCart={toggleCart} sideCart={sideCart} setSideCart={setSideCart} user={user} Key={key} logout={logout} cart={cart} clearCart={clearCart} removeOneItem={removeOneItem} addToCart={addToCart} setCart={setCart} subtotal={subtotal} fetchCartFunction={fetchCartFunction} />

    <Component toggleCart={toggleCart} setSideCart={setSideCart} setSlug={setSlug} buynow={buynow} slug={slug} removeFullItem={removeFullItem} cart={cart} clearCart={clearCart} removeOneItem={removeOneItem} addToCart={addToCart} setCart={setCart} subtotal={subtotal} fetchCartFunction={fetchCartFunction} {...pageProps} />
    <Footer />
  </>
}

export default MyApp;


