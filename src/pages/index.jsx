import { useSession, signIn, signOut } from "next-auth/react";
import { useSelector, useDispatch} from "react-redux";
import {increment, decrement, reset} from "@/redux/counterSlice";
import Navbar from "./components/navbar";
import LoginForm from "./components/loginForm";

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
        <p>ini home</p>
        <div className="mx-auto min-vh-100 d-flex align-items-center justify-content-center">
          <LoginForm/>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto">
    <Navbar/>
    <div className="container-fluid">
      <h1>ini untuk page home</h1>
      <div>
        <h1>Halo, {session.user.email}</h1>
        <button onClick={() => signOut()}>Logout</button>
      </div>
    </div>
    </div>
  );
}
