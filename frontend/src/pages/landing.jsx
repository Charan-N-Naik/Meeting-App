import React from "react";
import "../App.css"
import { Link, useNavigate } from "react-router";

import { Navigate } from "react-router";
function LandingPage() {
    const Router=useNavigate();
    return (
        <div className="LandingPageContainer">
            <nav>
                <div className="navHeader">
                    <h2>Video Call</h2>
                </div>
                <div className="navlist">
                    <p onClick={()=>{
                        Router(`/${Math.floor(Math.random() * 9000) + 1000}`)
                    }}>Join as Guest</p>
                    <p onClick={()=>Router("/auth")}>Register</p>
                    <div role="button" onClick={()=>Router("/auth")}>
                        Login
                    </div>
                </div>
            </nav>
            <main>
                <div className="lendingMaincontainer">
                    <div>
                        <h1>
                            <span style={{ color: "#FF9839" }}>Connect</span> with Loved Ones
                        </h1>
                        <p>Cover a distance by Video Call</p>
                        <div role="button">
                            <Link to={'/auth'}>
                                Get Started
                            </Link>
                        </div> 
                    </div>
                    <div>
                        <img src="/mobile.png" alt=""></img>
                    </div>
                </div>
            </main>
        </div>
    )
}
export default LandingPage;