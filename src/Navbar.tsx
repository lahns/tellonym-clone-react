import { ChangeEvent, FocusEvent, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { useAppContext } from "./context";
import { ReactComponent as AskletIcon } from "./icons/asklet2.svg";
import { ReactComponent as ExpandIcon } from "./icons/expand.svg";
import { ReactComponent as SearchIcon } from "./icons/search_icon.svg";
import { User } from "./types";
import { apiLogOut, apiSearch } from "./utils/apiUtil";
import config from "./utils/config";

export default function Navbar(){
    const { context, setContext } = useAppContext();

    return (
        <nav className="sticky top-0 z-50 w-full flex justify-center items-center gap-16 p-2 bg-white drop-shadow-md">
            <div className="w-full lg:w-3/4 xl:w-2/3 justify-between items-center flex flex-row">
                <Link to="/" className="flex flex-row items-center justify-center">
                    <AskletIcon className="scale-10 w-10 h-10 fill-blue-300"/>
                    <h1 className="md:block hidden text-gray-300 text-2xl font-logo">Asklet</h1>
                </Link>
                <SearchBar userId={context.currentUser?.user.id}/>

                { context.currentUser ? 
                    <ProfileButton context={context} setContext={setContext}/>
                    :
                    <Link to={`/login`} className="bg-blue-300 rounded-lg p-2 w-16 text-white flex justify-center items-center">
                        Log in
                    </Link>
                }
            </div>
        </nav>
    );
}

const SearchBar = ({userId}: { userId: number | undefined }) => {
    const [ isSearching, setIsSearching ] = useState<boolean>(false);
    const [ query, setQuery ] = useState<string>("");
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ users, setUsers ] = useState<User[]>([]);
    const filteredUsers = useMemo(() => users.filter(({username}) => username.includes(query)), [users, query]);
    const inputRef = useRef<HTMLInputElement>(null);

    const onProfileClick = () => {
        setQuery("");
        if (inputRef.current) inputRef.current.value = "";
        setUsers([]);
        setIsSearching(false);
    }

    const closeSearchBlur = (event: FocusEvent<HTMLDivElement, Element>) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsSearching(false);
        }
    };

    const openSearchFocus = (event: FocusEvent<HTMLDivElement, Element>) => {
      if (query !== "") {
        setIsSearching(true);
      }  
    };

    const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value.trim();

        if (isSearching && newQuery == "") {
            setIsSearching(false);
        } else if (!isSearching) {
            setIsSearching(true);
        }

        // Fetch only if this is a "new" query aka the searchbar was empty beforehand 
        // this will result in fetching users whose usernames contain the first letter of the query
        // pretty inefficient but pagination would be needed in order to do better
        if (query === "" && newQuery !== "") {
            setIsLoading(true);
            
            apiSearch(newQuery)
                .then(results => {
                    if (!results) {
                        // no results
                        return; 
                    } else {
                        setUsers(results);
                    }
                    setIsLoading(false);
                })
                .catch(() => { /* server error */});
            
        } else if (newQuery === "") {
            // The user has just reset the query so clear cached users
            setUsers([]);
        }

        setQuery(newQuery);
    }

    return (
        <div onBlur={closeSearchBlur} className="w-3/4 md:w-1/2 mx-2 relative justify-center items-center">
            {/* https://stackoverflow.com/questions/60362442/cant-center-absolute-position-tailwind-css */}
            { !isSearching && query === "" && 
                <div className="pointer-events-none flex flex-row -ml-3 justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <SearchIcon className="fill-gray-400 scale-5 h-5 -mr-3 -mb-1"/>
                    <div className="text-gray-400">Search</div>
                </div>
            }
            <input  tabIndex={0} onFocus={openSearchFocus} ref={inputRef} onChange={onSearchChange} className="w-full p-1 bg-gray-100 focus:outline-none focus:border-blue-300 border-gray-200 border-2 rounded-lg"></input>
            { isSearching &&
                <div className="bg-white rounded-lg overflow-hidden flex flex-col drop-shadow-md w-full mt-1 justify-center items-center absolute left-1/2 transform -translate-x-1/2">
                    {isLoading && 
                        <div className="w-full py-2 text-center text-blue-400">
                            Loading...
                        </div>
                    }
                    {filteredUsers.map(user => <ProfileResult key={user.id} user={user} onProfileClick={onProfileClick}/>)}
                    {filteredUsers.length > 5 && 
                        <div className="w-full py-2 text-center text-blue-400 hover:text-white hover:bg-blue-300">
                            Click to see more
                        </div>
                    }    
                    {!isLoading && filteredUsers.length === 0 && 
                        <div className="w-full py-2 text-center text-blue-400">
                            No matching results
                        </div>
                    }    
                </div> 
            }
        </div>
    );
} 

const ProfileResult = ({user, onProfileClick}: { user: User, onProfileClick: () => void }) => {
    return (
        <Link onClick={onProfileClick} to={`/user/${user.id}`} className="w-full flex flex-row items-center justify-between gap-2 px-2 hover:bg-gray-100 p-2">
           <img src={`${config.ServerURL}/pfps/${user.id}.png`} className="scale-14 h-14 rounded-full"/>
            <div className="flex flex-col justify-center overflow-hidden">
               <div><b>{user.username}</b></div> 
               <div className="truncate">{user.bio}</div> 
            </div>
            <button className="ml-auto bg-blue-300 p-2 pl-4 pr-4 rounded-lg text-white">
                Follow
            </button>
        </Link>
    );
}

const ProfileButton = ({context, setContext}: ReturnType<typeof useAppContext>) => {
    
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const userId = context.currentUser?.user.id;

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

    return (
        <div tabIndex={0} onBlur={closeDropdownBlur} className="flex flex-col relative">
            <button className="flex flex-row justify-center items-center gap-2" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <img src={`${config.ServerURL}/pfps/${userId}.png`} className="rounded-full scale-10 h-10 w-10 ml-2"/>
                <div className="md:block hidden">{context.currentUser!.user.username}</div>
                <ExpandIcon className={`scale-5 h-5 w-5 ${dropdownOpen && "rotate-180"}`}/>
            </button>
            { dropdownOpen && 
                <div className="rounded-lg overflow-hidden flex flex-col absolute bg-white drop-shadow-md justify-start top-full mt-2 w-auto right-0 divide-y divide-gray-200">
                    <div className="flex flex-col">
                        <Link onClick={() => setDropdownOpen(false)} className="inline-block p-4 hover:bg-gray-100" to={`/user/${userId}`}>Profile</Link>
                        <Link onClick={() => setDropdownOpen(false)} className="inline-block p-4 hover:bg-gray-100" to={`/settings`}>Settings</Link>
                    </div>
                    <button className="inline-block text-left p-4 text-red-400 hover:text-white hover:bg-red-300" onClick={logOut}>Log out</button>
                </div>
            }
        </div>
    );
}