import "./App.css";
import * as MyComponent from "@savicheema/configure-app-component";

function App() {
  return (
    <>
      <MyComponent.default person={{ name: "goo", age: 24 }} />
    </>
  );
}

export default App;
