import ReactDOM from "react-dom/client";
import App from "./App";

const root = document.getElementById("game-container");
if (root) {
  ReactDOM.createRoot(root).render(<App />);
}
