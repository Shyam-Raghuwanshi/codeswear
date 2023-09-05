import { useRouter } from 'next/router'
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../../src/theme/theme";
import Product from '../../../models/Product'
import connectDb from '../../../middleware/mongoose'
import { useState, useEffect } from 'react'
import FullLayout from "../../../src/layouts/FullLayout";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BaseCard from "../../../src/components/baseCard/BaseCard";
import {
    Grid,
    Stack,
    TextField,
    FormControlLabel,
    RadioGroup,
    Radio,
    FormLabel,
    FormControl,
} from "@mui/material";
const slug = ({ productval }) => {
    const [token, setToken] = useState(undefined)
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [img, setImg] = useState('')
    const [category, setCategory] = useState('')
    const [size, setSize] = useState('')
    const [color, setColor] = useState('')
    const [price, setPrice] = useState('')
    const [availableQty, setAvailableQty] = useState('')
    const [product, setProduct] = useState(productval)
    const router = useRouter()

    useEffect(() => {
        let token = localStorage.getItem('token')
        setToken(token)
        if (!token) {
            router.push("/")
        }
        setTitle(product.title)
        setDesc(product.desc)
        setImg(product.img)
        setCategory(product.category)
        setSize(product.size)
        setColor(product.color)
        setPrice(product.price)
        setAvailableQty(product.availableQty)
    }, [])



    const handelChange = async (e) => {
        let priceReg = /[^-][0-9]/
        let a = priceReg.test(parseInt(e.target.value))
        console.log(a)
        if (e.target.name == 'title') {
            setTitle(e.target.value)

        }
        else if (e.target.name == 'desc') {
            setDesc(e.target.value)

        }
        else if (e.target.name == 'size') {
            setSize(e.target.value)

        }
        else if (e.target.name == 'color') {
            setColor(e.target.value)


        }
        else if (e.target.name == 'price') {
            setPrice(e.target.value)

        }
        else if (e.target.name == 'availableQty') {
            setAvailableQty(e.target.value)

        }
        else if (e.target.name == 'category') {
            setCategory(e.target.value)

        }


    }

    const handleSubmit = async () => {
        // if (!price.includes(parseInt('-')) && !price.includes(parseInt('+')) && !availableQty.includes(parseInt('-')) && !availableQty.includes(parseInt('+'))) {

        if (title.length < 5) {
            validation('Title can\'t be null or can\'t less than five word')
        }
        else if (desc.length < 15) {
            validation('Description is can\'t be null or can\'t less than fiveteen word')
        }
        else if (!img) {
            validation('Img is can\'nt be null')
        }
        else if (!category) {
            validation('Product category is can\'nt be null')
        }
        else if (!size) {
            validation('Product size is can\'nt be null')
        }
        else if (!color) {
            validation('Product color is can\'nt be null')
        }
        else if (!price) {

            validation('Product price is can\'nt be null')
        }
        else if (!availableQty) {
            validation('Product availableQuantity is can\'nt be null')
        }
        else {
            let body = { id: product._id, title, desc, img, category, size, color, price, availableQty }
            const addProduct = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/updateProducts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
            const json = await addProduct.json()
            if (!json.success) {
                toast.error("Internal Server Error, Please try again", {
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
                router.push('/admin/viewProducts')
                toast.success("Changes saved", {
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
        // }
        // else {
        //     validation('Price or AvailableQty must be right')
        // }
    }

    const validation = (message) => {
        toast.error(message, {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    function uploadFile() {
        const image = document.getElementById('image')
        var file = image.files[0];
        if (file) {
            const fsize = Math.round(file.size / 1024)
            if (!file.type.includes('video')) {
                if (fsize > 18000) {
                    toast.error('The image is two large. Image is less then 18mb', {
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
                    var reader = new FileReader();
                    reader.onloadend = function () {
                        setImg(reader.result);
                    }
                    reader.readAsDataURL(file);
                }
            }
            else {
                image.value = ''
                setImg(undefined)
                toast.error("Video not supported", {
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

    return (
        <ThemeProvider theme={theme}>
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
            <style jsx global>{`
                header  {
                    display:none
                 }
                footer {
                    display:none
            }`}</style>
            <FullLayout>
                <Grid container spacing={0}>
                    <Grid item xs={12} lg={12}>
                        {/* {noOfProducts.map(() => { */}
                        <BaseCard title="Update Product Detials">
                            <Stack spacing={3}>
                                <label htmlFor="Title">Title</label>
                                <TextField onChange={handelChange}
                                    id="name-basic"
                                    name="title"
                                    variant="outlined"
                                    placeholder="Enter product title"
                                    value={title}
                                />
                                <label htmlFor="Description">Description</label>
                                <TextField onChange={handelChange}
                                    id="email-basic"
                                    name="desc"
                                    variant="outlined"
                                    placeholder="How type of product"
                                    value={desc}
                                />
                                <label htmlFor="Quantity">Quantity</label>
                                <TextField onChange={handelChange}
                                    id="er-basic"
                                    name="availableQty"
                                    type="number"
                                    placeholder="Enter product Quantity"
                                    value={availableQty}
                                />
                                <label htmlFor="Price">Price</label>
                                <TextField onChange={handelChange}
                                    id="er-basic2"
                                    name="price"
                                    type="number"
                                    placeholder="Enter product Price"
                                    value={price}
                                />
                                <FormControl >
                                    <FormLabel id="demo-radio-buttons-group-label">Category</FormLabel>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue={product.category}

                                    >
                                        <FormControlLabel onChange={handelChange}
                                            value="tshirt"
                                            control={<Radio />}
                                            label="Tshirt"
                                            name="category"
                                        />
                                        <FormControlLabel onChange={handelChange}
                                            value="hoodies"
                                            control={<Radio />}
                                            label="Hoodies"
                                            name="category"
                                        />
                                        <FormControlLabel onChange={handelChange}
                                            value="mugs"
                                            control={<Radio />}
                                            label="Mugs"
                                            name="category"
                                        />

                                    </RadioGroup>
                                </FormControl>
                                <FormControl >
                                    <FormLabel id="demo-radio-buttons-group-label">Size</FormLabel>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue={product.size}
                                        name="size"
                                    >
                                        <FormControlLabel onChange={handelChange}
                                            value="S"
                                            control={<Radio />}
                                            label="S"
                                            name="size"
                                        />
                                        <FormControlLabel onChange={handelChange}
                                            value="M"
                                            control={<Radio />}
                                            label="M"
                                            name="size"
                                        />
                                        <FormControlLabel onChange={handelChange}
                                            value="L"
                                            control={<Radio />}
                                            label="L"
                                            name="size"
                                        />
                                        <FormControlLabel onChange={handelChange}
                                            value="XL"
                                            control={<Radio />}
                                            label="XL"
                                            name="size"
                                        />
                                        <FormControlLabel onChange={handelChange}
                                            value="XXL"
                                            control={<Radio />}
                                            label="XXL"
                                            name="size"
                                        />

                                    </RadioGroup>
                                </FormControl>
                                <FormControl >
                                    <FormLabel id="demo-radio-buttons-group-label">Color</FormLabel>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue={product.color.slice(0, 1).toUpperCase() + product.color.slice(1, product.color.length)}
                                        name="color"
                                    >
                                        <FormControlLabel onChange={handelChange}
                                            value="White"
                                            control={<Radio />}
                                            label="White"
                                            name="color"
                                        />
                                        <FormControlLabel onChange={handelChange}
                                            value="Black"
                                            control={<Radio />}
                                            label="Black"
                                            name="color"
                                        />
                                        <FormControlLabel onChange={handelChange}
                                            value="Red"
                                            control={<Radio />}
                                            label="Red"
                                            name="color"
                                        />
                                        <FormControlLabel onChange={handelChange}
                                            value="Brown"
                                            control={<Radio />}
                                            label="Brown"
                                            name="color"
                                        />
                                        <FormControlLabel onChange={handelChange}
                                            value="Green"
                                            control={<Radio />}
                                            label="Green"
                                            name="color"
                                        />
                                        <FormControlLabel onChange={handelChange}
                                            value="Yellow"
                                            control={<Radio />}
                                            label="Yellow"
                                            name="color"
                                        />
                                        <FormControlLabel onChange={handelChange}
                                            value="Pink"
                                            control={<Radio />}
                                            label="Pink"
                                            name="color"
                                        />
                                    </RadioGroup>
                                </FormControl>
                                <label htmlFor="Image">Image</label>
                                <div className="">
                                    <span>Product Image. If you should change the image please choose another one :)</span>
                                    <img className='h-28 mt-5' src={img} alt="img" />
                                    <input className="mt-5" onChange={uploadFile} id="image" type="file" />
                                </div>
                            </Stack>
                        </BaseCard>
                        {/* })} */}
                    </Grid>
                    <button className="ml-[17px] bg-pink-500 px-8 py-2 rounded-md active:bg-pink-400 " onClick={handleSubmit} variant="contained" mt={2}>
                        Save Changes
                    </button>
                </Grid>
            </FullLayout>
        </ThemeProvider>
    )
}
export default slug;

export async function getServerSideProps(context) {
    connectDb()
    let productval = await Product.findOne({ slug: context.query.slug })
    return {
        props: { productval: JSON.parse(JSON.stringify(productval)) }
    }
}
