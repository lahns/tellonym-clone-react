import React from "react";
import search_icon from "./icons/search_icon.svg";
import home_icon from "./icons/home_icon.svg";
import account_icon from "./icons/account_icon.svg";
import { Link  } from "wouter";

export default function Navbar(){
    return(
        <>
        <nav className="flex justify-center items-center gap-16 pt-2 pb-2 bg-white drop-shadow-lg">
            <Link to="/home"><img className="scale-10 h-10" src={home_icon}></img></Link>
            <Link to="/search"><img className="scale-10 h-10" src={search_icon}></img></Link>
            <Link to='/profile/{]'><img className="scale-10 h-10" src={account_icon}></img></Link>
        </nav>
        </>
    );
}