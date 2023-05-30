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
            <div className="navbar fixed z-10 h-24 bg-base-100 px-8 opacity-90">
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
                        <ul className="menu menu-horizontal p-0">
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
                        </ul>
                    )}
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
