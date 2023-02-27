import React, { useRef, useEffect, useState } from "react";
import Sidebar from "../Chat";
import styles from "../../styles/chat.module.css";
import { orderBy, doc, addDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "../../firebase";
import { collection } from "firebase/firestore";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import Image from "next/image";
import { useSession } from "next-auth/react";
import LoadingPage from "@/components/LoadingPage";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { query } from "firebase/firestore";
import { db } from "../../firebase";
import getOtherEmail from "@/utils/getOtherEmail";
import Head from "next/head";
const Messaging = () => {
  const msgRef = useRef(null);
  const bottomScrollRef = useRef();
  const [input, setInput] = useState("");
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [user, loading] = useAuthState(auth);
  const q =
    !loading &&
    query(collection(db, "chats", id, "messages"), orderBy("timestamp"));
  const [messages] = useCollectionData(q);

  const [chat] = useDocumentData(!loading && doc(db, "chats", id));

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input.trimEnd()) {
      await addDoc(collection(db, "chats", id, "messages"), {
        text: input,
        sender: session.user.email,
        timestamp: serverTimestamp(),
      });
      setInput("");
    }
    if (msgRef.current) msgRef.current.value = null;
  };

  useEffect(() => {
    setTimeout(
      !loading &&
        bottomScrollRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }),
      100
    );
  }, [messages]);

  if (session && !loading) {
    return (
      <div className={styles.homePage}>
        <Head>
          <title>Chat app</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/post.png" />
        </Head>
        <Sidebar />
        <div className={styles.chat}>
          <div className={styles.container}>
            <div className={styles.topBar}>
              <div className={styles.topBarCont}>
                <img
                  src="/user.png"
                  alt="image"
                  width={60}
                  height={60}
                  style={{ borderRadius: 50 }}
                />
                <p>{getOtherEmail(chat?.users, session.user)}</p>
              </div>
            </div>
            <div className={styles.msgBar}>
              <div className={styles.messages}>
                <div className={styles.messagesCont}>
                  {!loading && messages
                    ? messages.map((e, index) => {
                        const sender = e.sender === session.user.email;
                        return (
                          <p
                            className={sender ? styles.gotMsg : null}
                            style={
                              !sender
                                ? { textAlign: "left" }
                                : { textAlign: "right" }
                            }
                            key={index}
                          >
                            {e.text} <span>{}</span>
                          </p>
                        );
                      })
                    : console.log("wef")}
                  <div ref={bottomScrollRef}></div>
                </div>
              </div>
            </div>

            <div className={styles.footer}>
              <input
                type="text"
                ref={msgRef}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type some text...."
              />
              <Image
                src="/post.png"
                alt="post image"
                width={51.2}
                height={51.2}
                onClick={sendMessage}
              />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <LoadingPage />;
  }
};

export default Messaging;