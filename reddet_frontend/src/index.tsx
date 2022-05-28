import ReactDOM from "react-dom/client";
import App from "./App";

const MOUNT_NODE = document.getElementById("root") as HTMLElement;
ReactDOM.createRoot(MOUNT_NODE).render(<App />);
