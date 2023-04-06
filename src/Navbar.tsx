import { Link } from "wouter";
import { useAppContext } from "./context";
import { ReactComponent as HomeIcon } from "./icons/home_icon.svg";
import { ReactComponent as SearchIcon } from "./icons/search_icon.svg";
import config from "./utils/config";

export default function Navbar(){
    const { context } = useAppContext();
    const userId = context.currentUser?.user.id;

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

