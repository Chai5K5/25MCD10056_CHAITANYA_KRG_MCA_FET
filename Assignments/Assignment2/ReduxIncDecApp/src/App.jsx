import { useSelector, useDispatch } from "react-redux";
import { increment, decrement } from "./store";

function GrandChild() {
  const dispatch = useDispatch();

  return (
    <div>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  );
}

function Child() {
  return <GrandChild />;
}

function Parent() {
  return <Child />;
}

function GrandParent() {
  const count = useSelector((state) => state.counter.count);

  return (
    <div>
      <h1>Count: {count}</h1>
      <Parent />
    </div>
  );
}

function App() {
  return <GrandParent />;
}

export default App;