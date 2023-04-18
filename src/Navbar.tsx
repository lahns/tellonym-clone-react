import { ChangeEvent, FocusEvent, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import Button from "./Button";
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
        <nav className="sticky top-0 z-50 w-full flex justify-center items-center p-2 bg-white drop-shadow-md">
            <div className="w-full lg:w-3/4 xl:w-2/3 justify-between items-center flex flex-row">
                <div className="w-1/7 md:w-1/5 lg:w-1/4 flex flex-row justify-start items-center">
                    <Link to="/" className="w-fit flex flex-row items-center justify-center">
                        <AskletIcon className="w-10 h-10 fill-primary-bg"/>
                        <h1 className="md:block hidden text-gray-onBg text-2xl font-logo">Asklet</h1>
                    </Link>
                </div>
                <SearchBar userId={context.currentUser?.user.id}/>

                <div className="w-1/7 md:w-1/5 lg:w-1/4 flex flex-row justify-end items-center">
                    { context.currentUser ? 
                        <ProfileButton context={context} setContext={setContext}/>
                        :
                        <Link to={`/login`}>
                            <Button.Primary additionalStyle="">
                                Log in
                            </Button.Primary>
                        </Link>
                    }
                </div>
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

        if (isSearching && newQuery === "") {
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
        <div onBlur={closeSearchBlur} className="w-4/6 md:w-1/2 mx-2 relative justify-center items-center">
            {/* https://stackoverflow.com/questions/60362442/cant-center-absolute-position-tailwind-css */}
            { !isSearching && query === "" && 
                <div className="pointer-events-none flex flex-row -ml-3 justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <SearchIcon className="fill-gray-onBg scale-5 h-5 -mr-3 -mb-1"/>
                    <div className="text-gray-onBg">Search</div>
                </div>
            }
            <input  tabIndex={0} onFocus={openSearchFocus} ref={inputRef} onChange={onSearchChange} className="w-full p-1 bg-gray-bg focus:outline-none focus:border-primary-bg border-gray-outline border-2 rounded-lg"></input>
            { isSearching &&
                <div className="bg-white rounded-lg overflow-hidden flex flex-col drop-shadow-md w-full mt-1 justify-center items-center absolute left-1/2 transform -translate-x-1/2">
                    {isLoading && 
                        <div className="w-full py-2 text-center text-primary-onBg">
                            Loading...
                        </div>
                    }
                    {filteredUsers.map(user => <ProfileResult key={user.id} user={user} onProfileClick={onProfileClick}/>)}
                    {filteredUsers.length > 5 && 
                        <div className="w-full py-2 text-center text-primary-onBg hover:text-white hover:bg-primary-bg">
                            Click to see more
                        </div>
                    }    
                    {!isLoading && filteredUsers.length === 0 && 
                        <div className="w-full py-2 text-center text-primary-onBg">
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
        <Link onClick={onProfileClick} to={`/user/${user.id}`} className="w-full flex flex-row items-center justify-between gap-2 px-2 hover:bg-gray-bg p-2">
           <img alt="" src={`${config.ServerURL}/pfps/${user.id}.png`} className="scale-14 h-14 rounded-full"/>
            <div className="w-full flex flex-col justify-center overflow-hidden">
               <div className="text-text-header"><b>{user.username}</b></div> 
               <div className="truncate text-text-normal">{user.bio}</div> 
            </div>
            <Button.Primary>
                Follow
            </Button.Primary>
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
            <div className="flex flex-row justify-center items-center gap-2" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <img alt="" src={`${config.ServerURL}/pfps/${userId}.png`} className="text-text-header rounded-full h-10 w-10"/>
                <div className="md:block hidden text-text-header">{context.currentUser!.user.username}</div>
                <ExpandIcon className={`h-5 w-5 ${dropdownOpen && "rotate-180"}`}/>
            </div>
            { dropdownOpen && 
                <div className="rounded-lg overflow-hidden flex flex-col absolute bg-white drop-shadow-md justify-center top-full mt-2 right-0 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-[175px] w-auto divide-y divide-gray-outline">
                    <div className="flex flex-col">
                        <Link onClick={() => setDropdownOpen(false)} className="inline-block p-4 hover:bg-gray-bg" to={`/user/${userId}`}>Profile</Link>
                        <Link onClick={() => setDropdownOpen(false)} className="inline-block p-4 hover:bg-gray-bg" to={`/settings`}>Settings</Link>
                    </div>
                    <button className="inline-block text-left p-4 text-error-onBg hover:text-white hover:bg-error-bg" onClick={logOut}>Log out</button>
                </div>
            }
        </div>
    );
}