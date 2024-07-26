import "@/styles/globals.css";
import { UserProvider } from "@/store/user/user.context";
import { LoadingProvider } from "@/store/isLoading/loadingMessage";

export default function App({ Component, pageProps }) {
  return (
    <LoadingProvider>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </LoadingProvider>
  );
}
