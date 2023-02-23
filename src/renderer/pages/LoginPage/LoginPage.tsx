import {TextField ,Button,Link} from "@mui/material";
import React,{useState} from "react";

const LoginPage = () => {









  return (
    <div>
    <TextField label="Email Address" required fullWidth name="email" autoComplete="email"/>
    <TextField label="Password" type="password" required fullWidth name="password"/>
    <Button type = "submit" variant="contained" sx={{mt:3}}>SIGN IN</Button>

    <Link>"Sign Up"</Link>
    </div>
  )
};

export default LoginPage
