import React, { useEffect } from "react";

import styles from "../styles/chat.module.css";
import { doc, setDoc, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { useSession } from "next-auth/react";
import getOtherEmail from "@/utils/getOtherEmail";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import Image from "next/image";

export const Sidebar = () => {
  const [user, loading1, err] = useAuthState(auth);
  useEffect(() => {
    const aboutUser = doc(db, "user", session.user.uid);
    !loading1 &&
      setDoc(
        aboutUser,
        {
          name: session.user.name,
          email: session.user.email,
          userPic: session.user.image,
        },
        { merge: true }
      );
  });
  const router = useRouter();

  const redirect = (id) => {
    router.push(`/chat/${id}`);
  };
  const [snapshot, loading, error] = useCollection(collection(db, "chats"));
  const chats = snapshot?.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const { data: session } = useSession();

  const chatExists = (email) =>
    chats?.find(
      (chat) =>
        chat.users.includes(session.user.email) && chat.users.includes(email)
    );

  const newChat = async () => {
    const input = prompt("enter user email");
    if (!chatExists(input) && input !== session.user.email && input && input.trimEnd()) {
      await addDoc(collection(db, "chats"), {
        users: [session.user.email, input],
      });
    } else {
      alert("Chat has already exists");
    }
  };

  const chatlist = () => {
    return (
      session &&
      !loading &&
      chats
        ?.filter((chat) => chat.users.includes(session.user.email))
        .map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div className={styles.chats}>
              <div
                className={styles.container}
                style={{ display: "flex", alignItems: "center" }}
              >
                <Image
                  src="/user.png"
                  alt="user image"
                  width={360}
                  height={360}
                />
                <p>{getOtherEmail(chat.users, session.user)}</p>
              </div>
            </div>
          </Link>
        ))
    );
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarCont}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarLeft}>
            <img
              src={session ? session.user.image : ""}
              style={{ width: 60, height: 60, borderRadius: "50px" }}
            />
            <p>
              {session ? session.user.name : null}
              <br />
              {session.user.email}
            </p>
          </div>
        </div>
        <button onClick={newChat}>New Chat</button>
        <div className={styles.sidebarChats}>{chatlist()}</div>
      </div>
    </div>
  );
};
