import { UserContext } from "../lib/context";
import { useContext, useState } from "react";
import {db} from "../lib/firebase";
import React, { useRef } from "react";
import { doc, collection, query, where, getDocs, orderBy} from "firebase/firestore"; 
const TrackComponent = () => {   
    const items2 = [{
        date: "Apr 29, 2021",
        amount: 34.0,
        ccy: "£",
        type: "Travel",
        card: "Visa****",
        expense: "Small",
        appeal: "May 16, 2021",
        statement:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias suscipit at nostrum cupiditate perspiciatis eveniet eos! Asperiores aperiam ipsum recusandae assumenda, tempore at commodi magni.",
        lineManager: "John Hudson",
    }];
    const [items, setItems] = useState<Item[]>([]);
    var [renderedItems, setRender] = useState();
    
    interface Item {
        date: String,
        amount: String,
        ccy: String,
        type: String,
        card: String,
        expense: String,
        appeal : String,
        statement: String,
        lineManager: String,
    }

    function createItem(date, amount, ccy, type, card, expense, appeal, statement, lineManager)  {
        let dateString = new Date(date).toLocaleDateString(undefined,{ 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        let currency;

        switch (ccy) {
            case "GBP":
                currency = "£";
                break;
            case "USD":
                currency = "$";
                break;
            case "EUR":
                currency = "€";
                break;
            case "JPY":
                currency = "¥";
                break;
            case "AUD":
                currency = "A$";
                break;
            case "CAD":
                currency = "C$";
                break;
            case "CNY":
                currency = "¥";
                break;
            case "INR":
                currency = "₹";
                break;
            case "HKD":
                currency = "HK$";
                break;
            default:
                currency = "";
                break;
        }
        var newItem: Item = {
            date: dateString,
            amount: amount,
            ccy: currency,
            type: type,
            card: card,
            expense: expense,
            appeal: appeal,
            statement: statement,
            lineManager: lineManager,

        };      
        
        items2.push(newItem);
        
        
        
        
    }
    
    async function getExpenses() {
        const {user} = useContext(UserContext);
        try{
            const q = query(collection(db, "exp"), where("UserId", "==", user.uid), orderBy("Date"));
        
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
            
            const data = doc.data()
            
            createItem(data.Date, data.Amount, data.Currency, data.Category,data.Card.SortCode, data.Expense, data.Appeal, data.Statement, data.LineManager);
            });

            setItems(items2);
        }
        catch (e) { console.log(e)}
    }
    getExpenses();

    
    
    return (
        <>
            <div className="h-min-screen history flex flex-col items-center justify-center">
                <h1 className="mt-[6.5rem] mb-8 text-3xl font-bold">
                    Pending Applications
                </h1>
                
                <div className="h-7/6 card mb-10 w-4/5 rounded-lg bg-neutral shadow-xl">
                    <div className=" p-0">
                        <div className="dark-secondary mx-0 grid h-8 w-full grid-cols-4 items-center justify-center px-0 text-center text-sm text-slate-300">
                            <p className="">Date</p>
                            <p className="text-left">Expense</p>
                            <p className=" text-right">Type</p>
                            <p className="">Card Account No.</p>
                        </div>
                        <div id="div1">{renderedItems}</div>
                        {items.map((item, index) => {
                            let appealLabel = ""
                            if (appealLabel.length >= 20) {
                                appealLabel += "...";
                            }
                            return (
                                <div
                                    key={index}
                                    tabIndex={0}
                                    className="collapse-arrow collapse">
                                    <input
                                        type="checkbox"
                                        className="peer"></input>

                                    <div
                                        className={
                                            "collapse-title mx-0 grid h-20 w-full grid-cols-4 items-center justify-center px-0 text-center text-slate-300 " +
                                            (index % 2 === 0
                                                ? "lighter"
                                                : "darker")
                                        }>
                                        <p className="text-slate-400">
                                            {item.date}
                                        </p>
                                        <p className="text-left">
                                            {item.ccy}
                                            {item.amount.toFixed(2)}
                                        </p>
                                        <p className="text-right text-slate-400">
                                            {item.type}
                                        </p>
                                        <p className="ml-30">{item.card}</p>
                                    </div>

                                    <div
                                        className={
                                            "collapse-content mx-0 grid h-24 w-full grid-cols-5 items-center justify-center px-0 text-center text-slate-300 " +
                                            (index % 2 === 0
                                                ? "lighter"
                                                : "darker")
                                        }>
                                        <p className="pl-20 text-slate-400">
                                            {item.expense} Expense
                                        </p>
                                        <p className="ml-[-1rem]">
                                            Appeal: {item.appeal}
                                        </p>
                                        <a
                                            href={"#modal-" + index}
                                            className="text-left text-slate-400 hover:underline">
                                            Appeal Statement: {appealLabel}
                                        </a>
                                        <p className="">
                                            Line Manager: {item.lineManager}
                                        </p>
                                        <p className="ml-[-4rem] cursor-pointer text-sm underline hover:opacity-90">
                                            View Attachment
                                        </p>
                                    </div>

                                    <div
                                        className="modal"
                                        id={"modal-" + index}>
                                        <div className="modal-box">
                                            <h3 className="text-lg font-bold">
                                                Appeal Statement
                                            </h3>
                                            <p className="py-4">
                                                {item.statement}
                                            </p>
                                            <div className="modal-action">
                                                <a href="#" className="btn">
                                                    Close
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <div className="dark-primary mx-0 flex h-10 w-full justify-end px-0 text-center text-sm text-slate-300 opacity-90">
                            <div className="btn-group px-20">
                                <button className="btn">«</button>
                                <button className="btn">Page 1</button>
                                <button className="btn">»</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TrackComponent;
