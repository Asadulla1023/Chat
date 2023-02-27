import Head from "next/head";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import styles from "../styles/auth.module.css";
import { auth } from "../firebase";
import { useRouter } from "next/router";
import "firebase/database";
import LoadingPage from "@/components/LoadingPage";
import Sidebar from "@/pages/Chat";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [user, loading, error] = useAuthState(auth);
  // signOut()
  return (
    <>
      <Head>
        <title>Chat app</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/post.png" />
      </Head>
      {loading === true ? (
        <LoadingPage />
      ) : !session ? (
        <AuthPage />
      ) : (
        <div className={styles.homePage}>
          <div className={styles.container}>
            <Sidebar />
          </div>
        </div>
      )}
    </>
  );
}

function AuthPage() {
  return (
    <div className={styles.authPage}>
      <div className={styles.form}>
        <button onClick={() => signIn({ callbackUrl: "/" })}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}