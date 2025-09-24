import React,{useRef,useState} from 'react'
import './CSS/login.css'
import axios from "axios";
import { useNavigate } from 'react-router-dom';
function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const nav = useNavigate();

    const handleLogin = async(e) => {
        e.preventDefault();
        setError(""); 
        setSuccess(""); 
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        try{
            const res = await axios.post("http://localhost:8000/login",{
                email,password
            })
            setSuccess(res.data.message);
            emailRef.current.value = "";
            passwordRef.current.value = "";
            nav('/dashboard');
        }catch(err){
            if(err.response){
                setError(err.response.data.detail || "login failed  ");
            }else{
                setError("Network Error");
            }
        }
    }
    return (
    <div className="login-page">
        <div className="login-card">
            <h2>Education Portal Login</h2>
            {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
            {success && <p style={{ color: "green", textAlign: "center" }}>{success}</p>}
            <form>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Enter your email" ref={emailRef}/>

                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Enter your password" ref={passwordRef}/>
                <button type="submit" className="btn" onClick={handleLogin}>Login</button>
            </form>
        </div>
    </div>)
}

export default Login;