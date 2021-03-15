import "styles/globals.css";
import "tailwindcss/tailwind.css";

import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DataProvider } from "store/GlobalState";

NProgress.configure({ showSpinner: false });
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }) {
  return (
    <DataProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <Component {...pageProps} />
    </DataProvider>
  );
}

export default MyApp;
