import { Link } from "wouter";
import { ReactComponent as AccountIcon } from "./icons/account_icon.svg";
import { ReactComponent as HomeIcon } from "./icons/home_icon.svg";
import { ReactComponent as SearchIcon } from "./icons/search_icon.svg";

export default function Navbar(){
    return(
        <>
        <nav className="flex justify-center items-center gap-16 pt-2 pb-2 bg-white drop-shadow-lg">
            <Link to="/home"><HomeIcon className="scale-10 h-10"/></Link>
            <Link to="/search"><SearchIcon className="scale-10 h-10"/></Link>
            <Link to='/profile/{]'><AccountIcon className="scale-10 h-10"/></Link>
        </nav>
        </>
    );
}