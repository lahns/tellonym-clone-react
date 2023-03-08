import React from "react";
import search_icon from "./icons/search_icon.svg";
import home_icon from "./icons/home_icon.svg";
import account_icon from "./icons/account_icon.svg";

export default function Navbar(){
    return(
        <>
        <nav className="flex justify-center items-center gap-8 pt-4 pb-4">
            <img className="scale-82" src={home_icon}></img>
            <img className="scale-82" src={search_icon}></img>
            <img className="scale-82" src={account_icon}></img>
        </nav>
        </>
    );
}