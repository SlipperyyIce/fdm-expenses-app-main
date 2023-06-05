import Link from "next/link";
import { useRouter } from 'next/router';
import { faFileShield } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext,useState, useEffect } from "react";
import { UserContext } from "../lib/context";
import { auth, provider } from "../lib/firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { query, where , collection, orderBy, getDocs} from "firebase/firestore";
import {db} from "../lib/firebase";

const Navbar = () => {
    const { user } = useContext(UserContext) as any;
    var isManager = false;
    const [isManager2, setPerms] = useState(false);
    const q = query(collection(db, "Managers"), where("ManagerId", "array-contains", user.uid));  
     
    async function checkPriv() {
        const querySnapshot = await getDocs(q);
        
        
        querySnapshot.forEach((doc) => {           
            isManager = true;
                              
            });                   
    }
        
    
    
    useEffect(() => {
        checkPriv();
        setTimeout(() => {
            setPerms(isManager);
            
          }, 505);
         
    }, []);
    
    
    return (
        <>
            <div className="navbar fixed z-10 h-24 bg-base-100 px-8 opacity-90 ">
                <div className="flex-1">
                    <a
                        href="/#showcase"
                        className="btn btn-ghost text-xl normal-case">
                        FDM Expenses
                    </a>
                </div>
                <div className="flex-none">
                    {/* User not logged in */}
                    {!user && (
                        <ul className="menu menu-horizontal p-0">
                            <li>
                                <Link href="/login">Login</Link>
                            </li>
                        </ul>
                    )}
                    {/* User logged in */}
                    
                    {user && (
                                               
                        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                            
                            <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                                <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0">
                                    
                                    <li>
                                        <Link href="/">Home</Link>
                                    </li>
                                    <li>
                                        <Link href="/#addX">Add Expense</Link>
                                    </li>
                                    <li>
                                        <Link href="/track">Track Expenses</Link>
                                    </li>
                                    <li>
                                        <Link href="/history">View History</Link>
                                    </li>
                                    {isManager2 ? <li>
                                        <Link href="/approve">Approve Expenses</Link>
                                    </li> : (
                                        <p></p>
                                    )}
                                    
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
                <div className="dropdown-end dropdown ml-3">
                                    <label
                                        tabIndex={0}
                                        className="avatar btn btn-ghost btn-circle">
                                        <div className="w-10 rounded-full">
                                            <img src="https://loremflickr.com/320/320/face" /*src={user.photoURL}*/ />
                                        </div>
                                    </label>

                                    <ul
                                        tabIndex={0}
                                        className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow">
                                        <li>
                                            
                                                <a className="justify-between">
                                                    Profile
                                                    {/* <span className="badge">New</span> */}
                                                </a>
                                            
                                        </li>
                                        <li>
                                            <a>Settings</a>
                                        </li>
                                        <li>
                                            <SignOutButton></SignOutButton>
                                        </li>
                                    </ul>
                                    
                                </div>
                                <div className="dropdown-end dropdown ml-3 md:hidden">
                                    <label
                                        tabIndex={0}
                                        className="">
                                        <div className="w-10 rounded-full">
                                        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"></path></svg>
                                        </div>
                                    </label>

                                    <ul
                                        tabIndex={0}
                                        className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow">
                                        <li>
                                        <Link href="/">Home</Link>
                                    </li>
                                    <li>
                                        <Link href="/#addX">Add Expense</Link>
                                    </li>
                                    <li>
                                        <Link href="/track">Track Expenses</Link>
                                    </li>
                                    <li>
                                        <Link href="/history">View History</Link>
                                    </li>
                                    {isManager2 ? <li>
                                        <Link href="/approve">Approve Expenses</Link>
                                    </li> : (
                                        <p></p>
                                    )}
                                    </ul>
                                </div>
            </div>
        </>
    );
};

function SignOutButton() {
    const router = useRouter();
    return <button onClick={() => {
        auth.signOut()
        router.push('/', undefined, { shallow: true });
    }}>
    Sign Out</button>;
    
}

export default Navbar;
