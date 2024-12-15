'use client'

import { ConnectEmbed } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { base } from "thirdweb/chains";
import { client } from "./lib/client";
import { generatePayload, isLoggedIn, login, logout } from "./actions/login";
import { useRouter } from "next/navigation";
import { useEffect } from "react";



export default function Home() {

  const router = useRouter();

  // Redirect based on login status
  useEffect(() => {
    async function checkLoginStatus() {
      const loggedIn = await isLoggedIn(); // Check login status
      if (loggedIn) {
        router.push("/loggedin"); // Redirect to `/loggedIn` if logged in
      }
    }
    checkLoginStatus();
  }, [router]);
  

  const wallets = [
    inAppWallet({
      auth: {
        options: [
          "google",
          "apple",
          "facebook",
          "github",
          "email",
          "passkey",
          "phone",
        ],
      },
    }),
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
    createWallet("io.rabby"),
    createWallet("io.zerion.wallet"),
  ];


  return (
    <div className="flex w-screen h-screen items-center justify-center">

      <ConnectEmbed 
        client={client}
        wallets={wallets}
        modalSize="wide"
        chain={base}
        auth={{
          isLoggedIn: async (address) => {
            console.log("checking if logged in!", { address });    
            return await isLoggedIn();
          },
          doLogin: async (params) => {
            console.log("logging in!");
            await login(params);
            router.push("/loggedin"); 

          },
          getLoginPayload: async ({ address }) =>
            generatePayload({ address }),
          doLogout: async () => {
            console.log("logging out!");
            await logout();
          },
        }}
      />
     
    </div>
  );
}
