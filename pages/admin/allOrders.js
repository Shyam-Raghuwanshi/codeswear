import { ThemeProvider } from "@mui/material/styles";
import theme from "../../src/theme/theme";
import FullLayout from "../../src/layouts/FullLayout";
import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import ProductPerfomance from "../../src/components/dashboard/ProductPerfomance";
import Error from 'next/error'
export default function AllOrders() {
  const [token, setToken] = useState(undefined)
  useEffect(() => {
    setToken(localStorage.getItem("token"))
  }, [])

  if (token == null) {
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
            <ProductPerfomance />
          </Grid>
        </Grid>
      </FullLayout>
    </ThemeProvider>
  );
}
