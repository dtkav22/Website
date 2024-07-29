import {useNavigate} from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    const logOut = (e) => {
        e.preventDefault();
        localStorage.clear();
        navigate("/", {replace:true});
    }
    return (
        <div className={"App"}>
            <input type={"button"} onClick={logOut} value={"Log-Out"}/>
        </div> );
}