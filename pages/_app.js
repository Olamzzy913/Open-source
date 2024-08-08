import "@/styles/globals.css";
import "leaflet/dist/leaflet.css";
import Script from "next/script";
import { UserProvider } from "@/store/user/user.context";
import { LoadingProvider } from "@/store/isLoading/loadingMessage";
import { ToggleProvider } from "@/store/dataFound/toggle.context";

// export default function App({ Component, pageProps }) {
//   return (
//     <LoadingProvider>
//       <UserProvider>
//         <Component {...pageProps} />
//       </UserProvider>
//     </LoadingProvider>
//   );
// }

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Script
        src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
        integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
        crossOrigin=""
        strategy="beforeInteractive"
      />
      <ToggleProvider>
        <LoadingProvider>
          <UserProvider>
            <Component {...pageProps} />
          </UserProvider>
        </LoadingProvider>
      </ToggleProvider>
    </>
  );
}

export default MyApp;
