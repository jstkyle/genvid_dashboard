import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NextUIProvider } from "@nextui-org/react";
import { DashboardLayout } from "../components/layout/layout";
import { LandingLayout } from "../components/landinglayout/landinglayout";

function MyApp({ Component, pageProps, router }: AppProps) {
  // Check if the current route is the landing page
  const isLanding = router.pathname === '/';

  // Choose the layout based on the route
  const Layout = isLanding ? LandingLayout : DashboardLayout;

  return (
    <NextThemesProvider defaultTheme="system" attribute="class">
      <NextUIProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </NextUIProvider>
    </NextThemesProvider>
  );
}

export default MyApp;
