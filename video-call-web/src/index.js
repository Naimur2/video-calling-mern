import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import MainContexProvider from "./store/MainContexProvider";
import SocketProvider from "./store/SocketProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <>
        <MainContexProvider>
           
                <SocketProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </SocketProvider>
           
        </MainContexProvider>
    </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
