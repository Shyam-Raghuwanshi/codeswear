import { ThemeProvider } from "@mui/material/styles";
import theme from "../../src/theme/theme";
import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import FullLayout from "../../src/layouts/FullLayout";
import ProductPerfomance from "../../src/components/dashboard/ProductPerfomance";
import Error from 'next/error'
import Product from '../../models/Product'
import connectDb from '../../middleware/mongoose'

export default function ViewProducts({ productsval }) {
  const [products, setProducts] = useState(productsval)
  const [token, setToken] = useState(undefined)
  const [key, setKey] = useState(0)
  useEffect(() => {
    setToken(localStorage.getItem("token"))
  }, [])

  if (token == null) {
    return <Error statusCode={404} />
  }
  return (
    <ThemeProvider key={key} theme={theme}>
      <style jsx global>{`
      header{
        display:none
      }
        footer {
          display:none
        }`}</style>
      <FullLayout>
        <Grid container spacing={0}>
          <Grid item xs={12} lg={12}>
            products &&<ProductPerfomance products={products} setProducts={setProducts} setKey={setKey} />
          </Grid>
        </Grid>
      </FullLayout>
    </ThemeProvider>
  );
}

export async function getServerSideProps(context) {
  connectDb()
  let productsval = await Product.find()
  return {
    props: { productsval: JSON.parse(JSON.stringify(productsval)) }
  }
}