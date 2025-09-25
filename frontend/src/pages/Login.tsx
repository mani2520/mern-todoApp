import React from "react";
import {useState} from "react"
import {}

interface LoginProps {
  token: string;
  message: string;
}

const Login = () => {
    const [email, setEmail]=useState("")
    const [password, setPassword]=useState("")
    const [error, setError]=useState("")

    const navigate = useNavigate()

  return <div>Login</div>;
};

export default Login;
