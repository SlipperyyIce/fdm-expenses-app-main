import React, { useState,useRef } from "react";
import {db} from "../lib/firebase";
import {storage} from "../lib/firebase";
import { collection, addDoc, query,where,getDocs } from "firebase/firestore"; 
import { UserContext } from "../lib/context";
import { useContext } from "react";
import { ref,uploadBytes  } from "firebase/storage";


const ExpenseMenu = () => {
    const [ontoggle, setToggle] = useState(false); //For more no reciept section
    const [categoryId, setCategoryId] = useState(-1);
    const {user} = useContext(UserContext);

    const fileInputRef = useRef(null);
    const fileInputRef2 = useRef(null);
    const amount = useRef(null);
    const amount2 = useRef(null);
    const category = useRef(null);
    const category2 = useRef(null);
    const currency = useRef(null);
    const currency2 = useRef(null);
    var ManangerName = "";
    const name = useRef(null);
    const name2 = useRef(null);
    const sortC = useRef(null);
    const sortC2 = useRef(null);
    const accountNo = useRef(null);
    const accountNo2 = useRef(null);

    const [fileName, setFileName] = useState(" ");
    const [fileName2, setFileName2] = useState(" ");

    
    const handleFileChange = () => {
        let filePath = fileInputRef.current?.value || "";
        setFileName(filePath ? filePath.split("\\").pop().replace(/^.*[\\\/]/, "") : "");
        console.log("File Name:", fileName);
    };

    const handleFileChange2 = () => {
        let filePath = fileInputRef2.current?.value || "";
        setFileName2(filePath ? filePath.split("\\").pop().replace(/^.*[\\\/]/, "") : "");
        
    };


    async function getManagerName(){
        const q = query(collection(db, "Employees"), where("EmployeeUID","array-contains", user.uid),); 
        const querySnapshot = await getDocs(q);
        for (const doc of querySnapshot.docs) {ManangerName = doc.data().ManagerName}
    }

    const inputFields: any = [
        {
            "Travel Company": "WizzAir",
            "Ticket Number": "A6",
            "Date of Departure": "dd/mm/yy",
            "Time of Departure": "hh:mm",
            "Reference Number": "XXXXXXXX",
        },
        {
            "Hotel Company": "Marriott",
            "Room Number": "11B",
            "Check-in date": "dd/mm/yy",
            "Check-out date": "dd/mm/yy",
            "Reference Number": "XXXXXXXX",
        },
    ];
    getManagerName();
    return (
        <>
            <div id="addX" className="hero min-h-screen bg-base-200 pb-10">
                <div className="hero-content text-center">
                    <div className="">
                        <h1 className="my-8 text-4xl font-bold">Add Expense</h1>
                        <div className="grid grid-cols-2 gap-10 ">
                            <div className="card w-96 bg-primary text-primary-content">
                                <div className="card-body items-center text-center">
                                    <h2 className="card-title text-2xl">
                                        Small Expense
                                    </h2>
                                    <p>This is for expenses under £250</p>
                                    <form action="" id="form1" onSubmit={(e) => {e.preventDefault();}}>
                                        <div className="form-control py-1">
                                            <label className="label">
                                                <span className="label-text mb-1">
                                                    Expense
                                                </span>
                                            </label>

                                            <label className="input-group">
                                                <span className="w-32 bg-[#0369a1]">
                                                    Amount
                                                </span>
                                                <input
                                                    type="text"
                                                    ref={amount}
                                                    placeholder="10"
                                                    className="input input-bordered w-28 bg-neutral" required></input>
                                                <select className="no-arrow w-20 bg-[#0369a1] text-center focus:outline-none" ref={currency}>
                                                    <option
                                                        
                                                        className="">
                                                        GBP
                                                    </option>
                                                    <option>USD</option>
                                                    <option>EUR</option>
                                                    <option>JPY</option>
                                                    <option>AUD</option>
                                                    <option>CAD</option>
                                                    <option>CNY</option>
                                                    <option>INR</option>
                                                    <option>HKD</option>
                                                </select>
                                            </label>
                                        </div>

                                        <div className="form-control py-1">
                                        <label className="label">
                                                <span className="label-text mb-1">
                                                    Catergory
                                                </span>
                                            </label>
                                            <div className="input-group  ">
                                                <select
                                                    ref={category}
                                                    id="typeSelect"
                                                    className="select select-bordered w-80 bg-neutral">
                                                    <option disabled >
                                                        Pick a category
                                                    </option>
                                                    <option>Travel</option>
                                                    <option>Hospitality</option>
                                                    <option>Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-control py-1">
                                            <label className="label">
                                                <span className="label-text">
                                                    Card Credentials
                                                </span>
                                            </label>

                                            <label className="input-group py-1">
                                                <span className="w-32 bg-[#0369a1]">
                                                    Name
                                                </span>
                                                <input
                                                    ref={name}
                                                    type="text"
                                                    placeholder="John Doe"
                                                    className="w-50  input input-bordered bg-neutral" required></input>
                                            </label>

                                            <label className="input-group py-1">
                                                <span className="w-32 bg-[#0369a1]">
                                                    Sort Code
                                                </span>
                                                <input
                                                    ref={sortC}
                                                    type="text"
                                                    placeholder="XX-XX-XX"
                                                    className="w-50  input input-bordered bg-neutral" required></input>
                                            </label>

                                            <label className="input-group py-1">
                                                <span className="w-32 bg-[#0369a1]">
                                                    Account No.
                                                </span>
                                                <input
                                                    ref={accountNo}
                                                    type="text"
                                                    placeholder="36829639"
                                                    className="w-50  input input-bordered bg-neutral" required></input>
                                            </label>
                                        </div>

                                        <div className="form-control">
                                        
                                            <label className="label">
                                                <span className="label-text">
                                                    Add Reciept
                                                </span>
                                            </label>
                                            <button className="btn w-36 border-none bg-secondary text-center outline hover:opacity-40 " onClick={addFile}>
                                                Attach File
                                            </button>
                                            <label className="label"><span className="label-text" style={{ height:"10px"}}>
                                                {fileName}</span>
                                            </label>
                                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} id="input-field" name="input-field" style={{ display: 'none' }}></input>
                                                                  
                                        </div>
                                    
                                    <div className="card-actions justify-center">
                                        <button
                                            onClick={submitexpense}
                                            type="submit"
                                            className=" btn mt-8 mb-2 mb-[-0.3rem]  w-80 rounded-2xl border-2 border-transparent bg-info font-semibold text-white  hover:opacity-40">
                                            Submit
                                        </button>
                                    </div>
                                    </form>
                                </div>
                            </div>

                            <div className="card w-96 bg-[#4c1d95] text-primary-content">
                                <div className="card-body items-center text-center">
                                    <h2 className="card-title text-2xl">
                                        Large Expense
                                    </h2>
                                    <p>This is for expenses over £250</p>
                                    <form action="" id="form2" onSubmit={(e) => {e.preventDefault();}}>
                                        <div className="form-control py-1">
                                            <label className="label">
                                                <span className="label-text">
                                                    Expense
                                                </span>
                                            </label>

                                            <label className="input-group py-1">
                                                <span className="w-32 bg-secondary">
                                                    Amount
                                                </span>
                                                <input
                                                    type="text"
                                                    ref={amount2}
                                                    placeholder="10"
                                                    className="input input-bordered w-28 bg-neutral" required></input>
                                                <select className="no-arrow w-20 bg-secondary text-center focus:outline-none" ref={currency2}>
                                                    <option
                                                        
                                                        className="">
                                                        GBP
                                                    </option>
                                                    <option>USD</option>
                                                    <option>EUR</option>
                                                    <option>JPY</option>
                                                    <option>AUD</option>
                                                    <option>CAD</option>
                                                    <option>CNY</option>
                                                    <option>INR</option>
                                                    <option>HKD</option>
                                                </select>
                                            </label>
                                        </div>

                                        <div className="form-control ">
                                            <label className="label">
                                                <span className="label-text mb-1">
                                                    Category
                                                </span>
                                            </label>
                                            <div className="input-group  ">
                                                
                                                <select
                                                    ref={category2}
                                                    
                                                    className="select select-bordered w-80 bg-neutral">
                                                    <option disabled value={-1}>
                                                        Pick category
                                                    </option>
                                                    <option>
                                                        Travel
                                                    </option>
                                                    <option>
                                                        Hospitality
                                                    </option>
                                                    <option>Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-control py-1.5 ">
                                            <label className="label">
                                                <span className="label-text">
                                                    Card Credentials
                                                </span>
                                            </label>

                                            <label className="input-group py-1">
                                                <span className="w-32 bg-secondary">
                                                    Name
                                                </span>
                                                <input
                                                    ref={name2}
                                                    type="text"
                                                    placeholder="John Doe"
                                                    className="w-50  input input-bordered bg-neutral" required></input>
                                            </label>

                                            <label className="input-group py-1">
                                                <span className="w-32 bg-secondary ">
                                                    Sort Code
                                                </span>
                                                <input
                                                    ref={sortC2}
                                                    type="text"
                                                    placeholder="XX-XX-XX"
                                                    className="w-50 input input-bordered bg-neutral" required></input>
                                            </label>

                                            <label className="input-group py-1">
                                                <span className="w-32 bg-secondary">
                                                    Account No.
                                                </span>
                                                <input
                                                    ref={accountNo2}
                                                    type="text"
                                                    placeholder="36829639"
                                                    className="w-50 input input-bordered bg-neutral" required></input>
                                            </label>
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">
                                                    Add Reciept (Compulsory)
                                                </span>
                                            </label>
                                            <button className="btn w-36 border-none bg-secondary text-center outline hover:opacity-40 " onClick={addFile2}>
                                                Attach File
                                            </button>
                                            <label className="label"><span className="label-text" style={{ height:"10px"}}>
                                                {fileName2}</span>
                                            </label>
                                            <input type="file" accept="image/*" ref={fileInputRef2} onChange={handleFileChange2} id="input-field2" name="input-field" style={{ display: 'none' }} required></input>
                                        </div>

                                        <p
                                            className={
                                                "more-info-link mt-2 cursor-pointer text-sm underline hover:opacity-90 " +
                                                (categoryId < 0
                                                    ? "opacity-60 hover:opacity-60"
                                                    : "")
                                            }
                                            onClick={() => {
                                                if (categoryId >= 0)
                                                    setToggle(!ontoggle);
                                            }}>
                                            Don't have a reciept? Click here.
                                        </p>
                                    

                                        <div className="card-actions justify-center">
                                            <button
                                                type="submit"
                                                onClick={submitLexpense}
                                                className="btn mt-1 mb-[-0.3rem] w-80  rounded-2xl border-2  border-transparent bg-indigo-600 font-semibold  text-white hover:opacity-40">
                                                Submit
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                <a href={"#modal-1"} id="modal_lk" style={{display: "none"}}></a>
                                <div
                                        className="modal"
                                        id={"modal-1"}>
                                        <div className="modal-box">
                                            <h3 className="text-lg font-bold">
                                                Expense Submitted
                                            </h3>
                                            
                                            <div className="modal-action">
                                                <a href="#" className="btn">
                                                    Close
                                                </a>
                                            </div>
                                        </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
    
    async function submitexpense(event: any) {

        try {
            
            if(document.getElementById("form1").checkValidity()){

                const file = fileInputRef.current.files[0];
                var hasFile = false;
                if(file){
                    hasFile = true;
                    
                }
                const docRef = await addDoc(collection(db, "exp"), {
                
                UserId: user.uid,
                Date: new Date().getTime(),  
                Amount: parseInt(amount.current.value) , 
                Currency: currency.current.value, 
                Category: category.current.value,
                Card: {
                    Name: name.current.value,
                    SortCode: sortC.current.value,
                    AccountNo: parseInt(accountNo.current.value),
                },
                            
                Expense: "Small",
                Appeal: "None",
                Statement: "None",
                LineManager: ManangerName,
                State: "Pending",
                hasFile: hasFile,          
                });
                console.log(ManangerName);
                if(file){
                    const imagesRef = ref(storage, ('reciepts/'+ docRef.id));
                    uploadBytes(imagesRef, file);
                }
                
                document.getElementById("modal_lk").click();
            }
        } catch (e) {
            console.error("Error adding document: ", e);
        }
        
    }

    async function submitLexpense(event: any) {
        
        try {
            if(document.getElementById("form1").checkValidity()){
                
                const docRef = await addDoc(collection(db, "exp"), {
                
                UserId: user.uid,
                Date: new Date().getTime(),  
                Amount: parseInt(amount2.current.value) , 
                Currency: currency2.current.value, 
                Category: category2.current.value,
                Card: {
                    Name: name2.current.value,
                    SortCode: sortC2.current.value,
                    AccountNo: parseInt(accountNo2.current.value),
                },
                            
                Expense: "Large",
                Appeal: "None",
                Statement: "None",
                LineManager: "????",
                State: "Pending",   
                
                });

                const imagesRef = ref(storage, ('reciepts/'+ docRef.id));
                const file = fileInputRef.current.files[0];
                uploadBytes(imagesRef, file);
                console.log(fileInputRef.current.value);
                console.log("OLOL Document written with ID: ", docRef.id);
                document.getElementById("modal_lk").click();
            }
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    function addFile(event: any) {
        document.getElementById("input-field").click();
        event.preventDefault();
    }
    function addFile2(event: any) {
        document.getElementById("input-field2").click();
        
    }

};

export default ExpenseMenu;



function setToggle(arg0: boolean): void {
    throw new Error("Function not implemented.");
}
function render() {
    throw new Error("Function not implemented.");
}

