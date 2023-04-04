import { Link } from "wouter";
import { ReactComponent as AccountIcon } from "./icons/account_icon.svg";
import { ReactComponent as HomeIcon } from "./icons/home_icon.svg";
import { ReactComponent as SearchIcon } from "./icons/search_icon.svg";
import { useContext, useEffect, useState } from "react";
import AppContext from "./context";
import { apiLogIn, apiMe } from "./utils/apiUtil";
import config from "./utils/config";

export default function Navbar(){
    const app = useContext(AppContext);
    const [userId, setUserId] = useState<number | null>(null);
    useEffect(() => {
        apiLogIn({ username: "elonator", password: "Elonator123"}, app.accessToken);
        apiMe(app.accessToken)
            .then(user => {
                if (!user) return;
                app.currentUser = user;
                setUserId(app.currentUser?.user.id ?? null);
            });
    });
    return(


        
        <>
        <nav className="flex justify-center items-center gap-16 pt-2 pb-2 bg-white drop-shadow-lg">
            <Link to="/home"><HomeIcon className="scale-10 h-10"/></Link>
            <Link to="/search"><SearchIcon className="scale-10 h-10"/></Link>

            {
                userId ? 
                    <Link to={`/user/${userId}`}><img src={`${config.ServerURL}/pfps/${userId}.png`} className="scale-10 h-10"/></Link>
                :
                    <Link to={`/login`}>
                        <div className="w-100 h-100 bg-blue-400 p-2 pl-4 pr-4 rounded-full text-white">
                            Log in
                        </div>
                    </Link>
            }
        </nav>
        </>
    );
}

