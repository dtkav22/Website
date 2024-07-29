import { Outlet, Link } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <Link to="/Login"/>
            <Link to="/Register"/>
            <Link to="/Home"/>
            <Outlet />
        </>
    )
};

export default Layout;