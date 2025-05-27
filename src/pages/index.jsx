import { useSession, signIn, signOut } from "next-auth/react";
import { useSelector, useDispatch} from "react-redux";
import {increment, decrement, reset} from "@/redux/counterSlice";
import Navbar from "./components/navbar";

export default function Home() {
  // const count = useSelector((state) => state.counter.value);
  // const dispatch = useDispatch();
   const { data: session,status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <div>
        <Navbar/>
        <p>Silakan login terlebih dahulu.</p>
        <button onClick={() => signIn()}>Login</button>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="container-fluid">
      <h1>ini untuk page home</h1>
      <div>
        <h1>Halo, {session.user.email}</h1>
        <button onClick={() => signOut()}>Logout</button>
      </div>
    </div>
    </>
  );
}
