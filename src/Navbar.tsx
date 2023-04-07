import { FocusEvent, useState } from "react";
import { Link } from "wouter";
import { useAppContext } from "./context";
import { ReactComponent as HomeIcon } from "./icons/home_icon.svg";
import { ReactComponent as SearchIcon } from "./icons/search_icon.svg";
import { apiLogOut } from "./utils/apiUtil";
import config from "./utils/config";

export default function Navbar(){
    const { context, setContext } = useAppContext();
    const userId = context.currentUser?.user.id;

    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);


    const logOut = () => {
        apiLogOut()
            .then(() => {
                setContext({ ...context, accessToken: null, currentUser: null })
                setDropdownOpen(false);
            })
            .catch(() => { /* server error */});
    };

    const closeDropdownBlur = (event: FocusEvent<HTMLDivElement, Element>) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setDropdownOpen(false);
        }
    };

    return(
        <>
        <nav className="flex justify-center items-center gap-16 pt-2 pb-2 bg-white drop-shadow-lg">
            <Link to="/home"><HomeIcon className="scale-10 h-10"/></Link>
            <Link to="/search"><SearchIcon className="scale-10 h-10"/></Link>

            { userId ? 
                <div tabIndex={0} onBlur={closeDropdownBlur} className="flex flex-col">
                    <button className="flex flex-row justify-center items-center gap-2" onClick={() => setDropdownOpen(!dropdownOpen)}>
                        <div>{context.currentUser!.user.username}</div>
                        <img src={`${config.ServerURL}/pfps/${userId}.png`} className="scale-10 h-10"/>
                    </button>
                    { dropdownOpen && 
                        <div className="rounded-lg overflow-hidden flex flex-col absolute -ml-5 top-14 bg-white drop-shadow-lg justify-start w-28 divide-y divide-gray-200">
                            <div className="flex flex-col">
                                <Link onClick={() => setDropdownOpen(false)} className="inline-block p-4 hover:bg-blue-100" to={`/user/${userId}`}>Profile</Link>
                                <Link onClick={() => setDropdownOpen(false)} className="inline-block p-4 hover:bg-blue-100" to={`/settings`}>Settings</Link>
                            </div>
                            <button className="inline-block text-left p-4 text-red-400 hover:text-white hover:bg-red-300" onClick={logOut}>Log out</button>
                        </div>
                    }
                </div>
                :
                <Link to={`/login`}>
                    <button className="w-100 h-100 bg-blue-400 p-2 pl-4 pr-4 rounded-full text-white">
                        Log in
                    </button>
                </Link>
            }
        </nav>
        </>
    );
}

