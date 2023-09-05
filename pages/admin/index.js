import { Grid } from "@mui/material";
// import BlogCard from "../../src/components/dashboard/BlogCard";
import SalesOverview from "../../src/components/dashboard/SalseOverview";
// import DailyActivity from "../../src/components/dashboard/DailyActivity";
// import ProductPerfomance from "../../src/components/dashboard/ProductPerfomance";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../src/theme/theme";
import FullLayout from "../../src/layouts/FullLayout";
import { useEffect, useState } from "react";
import Error from 'next/error'
import { useRouter } from "next/router";
export default function Index() {
  const router = useRouter()
  const [token, setToken] = useState(undefined)
  useEffect(() => {
    setToken(localStorage.getItem("token"))
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
      if (Math.floor((new Date).getTime() / 1000) >= expiry) {
        localStorage.removeItem('token')
        router.push('/')
      }
    }
  }, [router.query])


  if (!token) {
    return <Error statusCode={404} />
  }
  return (
    <ThemeProvider theme={theme}>
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
            <SalesOverview />
          </Grid>
          
        </Grid>
      </FullLayout>
    </ThemeProvider>
  )
}