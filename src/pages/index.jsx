import { useSelector, useDispatch } from "react-redux";
import {increment, decrement, reset} from "@/redux/counterSlice";

export default function Home() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <>
    <h1>halo dek</h1>
    <div>
      <h3> Counter: {count}</h3>
      <div>
        <button  onClick={() => dispatch(increment())}>tambah</button>
        <button onClick={() => dispatch(decrement())}>kurang</button>
        <button onClick={() => dispatch(reset())}>reset</button>
      </div>
    </div>
    </>
  );
}
