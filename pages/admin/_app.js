import * as React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme from "../src/theme/theme";
import createEmotionCache from "../src/createEmotionCache";
import FullLayout from "../src/layouts/FullLayout";
import { useRouter } from "next/router"
import "../styles/style.css";
const clientSideEmotionCache = createEmotionCache();
import Error from 'next/error'
export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const router = useRouter()
  const token = localStorage.getItem('token')
  const checktoken = () => {
    if (!token) {
      router.push('/')
    }
  }
  if (!token) {
    return <Error statusCode={404} />
  }

  return (
    <CacheProvider value={emotionCache}>
      <style jsx global>{`
        footer {
          display:none
        }`}</style>
      <Head>
        <title>ROOTCHOICE-admin</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <FullLayout >
          <Component errorFunction={errorFunction}  checktoken={checktoken} {...pageProps} />
        </FullLayout>
      </ThemeProvider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};