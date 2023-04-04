import { Link } from "wouter";
import { ReactComponent as AccountIcon } from "./icons/account_icon.svg";
import { ReactComponent as HomeIcon } from "./icons/home_icon.svg";
import { ReactComponent as SearchIcon } from "./icons/search_icon.svg";
import { useContext, useEffect, useState } from "react";
import AppContext from "./context";
import { apiLogIn } from "./utils/apiUtil";

export default function Navbar(){
    let app = useContext(AppContext);
    useEffect(() => {
        apiLogIn({ username: "tester", password: "Tester123"}, app.accessToken);
    });
    let userID = app.currentUser?.user.id;
    return(


        
        <>
        <nav className="flex justify-center items-center gap-16 pt-2 pb-2 bg-white drop-shadow-lg">
            <Link to="/home"><HomeIcon className="scale-10 h-10"/></Link>
            <Link to="/search"><SearchIcon className="scale-10 h-10"/></Link>
            <Link to={`/user/${userID}`}><AccountIcon className="scale-10 h-10"/></Link>
        </nav>
        </>
    );
}

