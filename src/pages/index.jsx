import { useSelector, useDispatch } from "react-redux";
import {increment, decrement, reset} from "@/redux/counterSlice";
import Navbar from "./components/navbar";

export default function Home() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <>
    <Navbar/>
    <div className="container-fluid">
      <h1>ini untuk page home</h1>
    </div>
    </>
  );
}
