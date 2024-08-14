import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './Login';
import Register from "./Register";
import Home from "./Home";
import Layout from "./Layout";
export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Login />} />
                    <Route path="Register" element={<Register />} />
                    <Route path="Home" element={<Home />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}