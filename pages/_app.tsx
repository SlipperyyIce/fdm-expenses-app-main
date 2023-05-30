import "../styles/globals.css";
import type { AppProps } from "next/app";
import { UserContext } from "../lib/context";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import LoginContent from "../components/login-content";
import Footer from "../components/footer";

function MyApp({ Component, pageProps }: AppProps) {
    const [user] = useAuthState(auth);
    

    return (
        <UserContext.Provider value={{ user }}>
            {user && <Component {...pageProps} />}

            {!user && (
                <>
                    <LoginContent></LoginContent>

                    <Footer></Footer>
                </>
            )}
        </UserContext.Provider>
    );
    
}

export default MyApp;
