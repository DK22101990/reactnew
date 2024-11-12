import React, { useEffect } from "react";
import MainNavbar from "../components/UI/MainNavbar";
import Header from "../components/UI/Header";

const Home = ()=>{
    useEffect(()=>{
        localStorage.setItem('complianceType','');
    },[])
    return(
        <>
        <MainNavbar />
        <Header role={"HOME"} />
        <h1>Compliance Framework</h1>
        </>
    )
}

export default Home;