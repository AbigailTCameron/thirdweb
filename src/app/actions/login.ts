"use server";
import { cookies } from "next/headers";
import { VerifyLoginPayloadParams, createAuth } from "thirdweb/auth";
import { privateKeyAccount } from "thirdweb/wallets";
import { redirect } from 'next/navigation'
import { client } from "../lib/client";


const privateKey = process.env.NEXT_PUBLIC_THIRDWEB_ADMIN_PRIVATE_KEY || "";

if (!privateKey) {
  throw new Error("Missing THIRDWEB_ADMIN_PRIVATE_KEY in .env file.");
}

const thirdwebAuth = createAuth({
  domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "",
  adminAccount: privateKeyAccount({ client, privateKey }),
  client: client,
});

export const generatePayload = thirdwebAuth.generatePayload;

export async function login(payload: VerifyLoginPayloadParams) {
  const verifiedPayload = await thirdwebAuth.verifyPayload(payload);
  if (verifiedPayload.valid) {
    const jwt = await thirdwebAuth.generateJWT({
      payload: verifiedPayload.payload,
    });
    (await cookies()).set("jwt", jwt);
  }
}


export async function isLoggedIn() {
  const jwt = (await cookies()).get("jwt");
  console.log("JWT:", jwt); // Debug log
  if (!jwt?.value) {
    return false;
  }

  const authResult = await thirdwebAuth.verifyJWT({ jwt: jwt.value });
  console.log("Auth Result:", authResult); // Debug log
  return authResult.valid;
}

export async function logout() {
  (await cookies()).delete("jwt");
  redirect('/');
}
