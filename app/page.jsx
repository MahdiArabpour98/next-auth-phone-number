"use client";

import { signIn, signOut, useSession } from "next-auth/react";

const Home = () => {
  const { data: session } = useSession();
  console.log("first-page-session", session);
  return (
    <div className="p-5 bg-gray-200 shadow-md w-full">
      {session && session.user ? (
        <>
          <button onClick={signOut} className="py-2 px-4 bg-red-400 rounded-md">
            خروج از سایت
          </button>
          <p>{session.phoneNumber}</p>
        </>
      ) : (
        <button onClick={signIn} className="py-2 px-4 bg-green-400 rounded-md">
          ورود به سایت
        </button>
      )}
    </div>
  );
};

export default Home;
