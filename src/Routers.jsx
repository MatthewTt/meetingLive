import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home"
import Login from "./pages/Login";
const Routers = () => {
    return (
        <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    )
}

export default Routers