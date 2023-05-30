import { UserContext } from "../lib/context";
import { useContext, useState , useEffect } from "react";
import {db} from "../lib/firebase";
import { collection, query, where, getDocs, orderBy} from "firebase/firestore"; 
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const TrackComponent = () => {   
    const storage = getStorage();
    const {user} = useContext(UserContext);
    const items2: Item[] = [];
    const [items, setItems] = useState<Item[]>([]);
    const [page, setPage] = useState(0);
    var maxPage = 0;
    const pageSize= 15;
    var [renderedItems, setRender] = useState();
        const imageExtensions = ["","png", "jpg", "jpeg", "pdf"];
    
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
        img: String,
        hasFile:Boolean,
        
    }

    async function createItem(date, amount, ccy, type, card, expense, appeal, statement, lineManager, docId, hasFile)  {
        let dateString = new Date(date).toLocaleDateString(undefined,{ 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        let dateString2 = new Date(appeal).toLocaleDateString(undefined,{ 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        if (isNaN(new Date(appeal)) )
        { dateString2 = 'None'; }
        
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
            appeal: dateString2,
            statement: statement,
            lineManager: lineManager,
            img: docId,
            hasFile: hasFile,
        };      
        
        items2.push(newItem);
        
    }
const q = query(collection(db, "exp"), where("UserId", "==", user.uid),where("State", "==", "Pending"), orderBy("lastModified", "desc"));    
    async function getExpenses() {
        
        try{
            const querySnapshot = await getDocs(q);
            maxPage = Math.ceil(querySnapshot.size / pageSize) -1;
            
            const docs = querySnapshot.docs.slice(page*pageSize, (page*pageSize)+pageSize);
            querySnapshot.forEach((doc) => {
            
            const data = doc.data()
              
            createItem(data.Date, data.Amount, data.Currency, data.Category,data.Card.SortCode, data.Expense, data.Appeal, data.Statement, data.LineManager, doc.id, data.hasFile);
            });
            
            
        }
        catch (e) { console.log(e)}
    }

    function getUrl(docid, extensionIndex){
        if (extensionIndex >= imageExtensions.length) {
            console.log("No valid file found.");
            return;
        }
        const fileRef = ref(storage, 'reciepts/' + docid);
        //const fileRef = ref(storage, 'reciepts/' + docid + "." + imageExtensions[extensionIndex]);
        
        getDownloadURL(fileRef)
            .then((url) => {
                
                
                window.open(url);
            })
            .catch((error) => {
                switch (error.code) {
                    case 'storage/object-not-found':
                        //getUrl(docid,extensionIndex + 1);
                        break;
                }
                
        });
        
    }
    
    getExpenses(); 
    useEffect(() => {
        setTimeout(() => {
            setItems(items2.slice(page*pageSize, (page*pageSize)+pageSize));
            console.log(items2);
          }, 500);
         
    }, []);
    
    
    
    
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
                            let appealLabel = item.statement.substring(
                                0,
                                Math.min(100, item.statement.length)
                            );
                            if (appealLabel.length >= 100) {
                                appealLabel += "...";
                            }
                            let attachment = "";
                            if (item.hasFile){attachment="View Attachment"}
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
                                        <a 
                                            onClick={() => { getUrl(item.img,0)}}
                                            className="ml-[-4rem] cursor-pointer text-sm underline hover:opacity-90">
                                            {attachment}
                                        </a>
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
                                <button className="btn" onClick={() =>{
                                    if(page > 0){ setPage(page - 1)
                                    setItems(items2.slice((page-1)*pageSize, ((page-1)*pageSize)+pageSize));
                                    }}}>«</button>
                                <button className="btn">Page {page+1}</button>
                                <button className="btn" onClick={() =>{
                                    if(page < maxPage){ setPage(page + 1)
                                    
                                    setItems(items2.slice((page+1)*pageSize, ((page+1)*pageSize)+pageSize));
                                    }}}>»</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
    
    
};

export default TrackComponent;
