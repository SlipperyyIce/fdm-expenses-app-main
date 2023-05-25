import { UserContext } from "../lib/context";
import { useContext, useState , useEffect } from "react";
import {db} from "../lib/firebase";
import { collection, query, where, getDocs, orderBy, limit, startAt} from "firebase/firestore"; 
import { getStorage, ref, getDownloadURL } from "firebase/storage";
const HistoryComponent = () => {
    const storage = getStorage();
    const {user} = useContext(UserContext);
    const items2: Item[] = [];
    const [items, setItems] = useState<Item[]>([]);
    const [page, setPage] = useState(0);
    var maxPage = 0;
    const pageSize= 2;
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
        Status: String,
        rejectionStatement: String,

    }

    async function createItem(date, amount, ccy, type, card, expense, appeal, statement, lineManager, docId, hasFile, status, rejectionStatement)  {
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
            img: docId,
            hasFile: hasFile,
            Status: status,
            rejectionStatement: rejectionStatement,    
        };      
        
        items2.push(newItem);
        
    }
const q = query(collection(db, "exp"), where("UserId", "==", user.uid),where("State", "==", "Pending"), orderBy("Date", "desc"));    
    async function getExpenses() {
        
        try{
            const querySnapshot = await getDocs(q);
            maxPage = Math.ceil(querySnapshot.size / pageSize) -1;
            
            const docs = querySnapshot.docs.slice(page*pageSize, (page*pageSize)+pageSize);
            querySnapshot.forEach((doc) => {
            
            const data = doc.data()
              
            createItem(data.Date, data.Amount, data.Currency, data.Category,data.Card.SortCode, data.Expense, data.Appeal, data.Statement, data.LineManager, doc.id, data.hasFile,data.State, data.rejectionStatement);
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
  
    const items3 = [
        {
            date: "Jul 5, 2021",
            amount: 245.0,
            ccy: "£",
            status: "Approved",
            rejectionStatement: "None",
            lineManager: "John Hudson",
            type: "Hospitality",
            card: "Visa****",
            expense: "Small",
            appeal: "None",
            statement: "None",
        },
        {
            date: "Apr 29, 2021",
            amount: 34.0,
            ccy: "£",
            status: "Approved",
            rejectionStatement: "None",
            lineManager: "John Hudson",
            type: "Hospitality",
            card: "Visa****",
            expense: "Small",
            appeal: "May 6, 2021",
            statement:
                "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eos libero tempore sapiente perspiciatis iusto vero accusantium vel.",
        },
        {
            date: "Apr 21, 2021",
            amount: 575.0,
            ccy: "£",
            status: "Approved",
            rejectionStatement: "None",
            lineManager: "John Hudson",
            type: "Hospitality",
            card: "Visa****",
            expense: "Small",
            appeal: "None",
            statement: "None",
        },
        {
            date: "Mar 26, 2021",
            amount: 54.57,
            ccy: "£",
            status: "Approved",
            rejectionStatement: "None",
            lineManager: "John Hudson",
            type: "Hospitality",
            card: "Visa****",
            expense: "Small",
            appeal: "None",
            statement: "None",
        },
        {
            date: "Mar 26, 2021",
            amount: 54.57,
            ccy: "£",
            status: "Approved",
            rejectionStatement: "None",
            lineManager: "John Hudson",
            type: "Hospitality",
            card: "Visa****",
            expense: "Small",
            appeal: "None",
            statement: "None",
        },
        {
            date: "Mar 26, 2021",
            amount: 54.57,
            ccy: "£",
            status: "Rejected",
            rejectionStatement:
                "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloremque maiores quisquam voluptas velit accusamus saepe nostrum vitae optio similique aut!",
            lineManager: "John Hudson",
            type: "Hospitality",
            card: "Visa****",
            expense: "Small",
            appeal: "Apr 2, 2021",
            statement:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit dolor voluptatum quibusdam! Quia, magni optio?",
        },
        {
            date: "Mar 26, 2021",
            amount: 54.57,
            ccy: "£",
            status: "Rejected",
            rejectionStatement:
                "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloremque maiores quisquam voluptas velit accusamus saepe nostrum vitae optio similique aut!",
            lineManager: "John Hudson",
            type: "Hospitality",
            card: "Mastercard****",
            expense: "Small",
            appeal: "None",
            statement: "None",
        },
    ];

    return (
        <>
            <div className="h-min-screen history flex flex-col items-center justify-center">
                <h1 className="mt-[6.5rem] mb-8 text-3xl font-bold">
                    Expense History
                </h1>

                <div className="h-7/6 card mb-10 w-4/5 rounded-lg bg-neutral shadow-xl">
                    <div className=" p-0">
                        <div className="dark-secondary mx-0 grid h-8 w-full grid-cols-7 items-center justify-center px-8 text-center text-sm text-slate-300">
                            <p className="">Date</p>
                            <p className="">Expense</p>
                            <p>Appeals</p>
                            <p>Rejection Statements</p>
                            <p className="">Status</p>
                            <p className="">Line Manager</p>
                            <p className="">Card</p>
                        </div>

                        {items3.map((item, index) => {
                            let appealLabel = item.statement.substring(
                                0,
                                Math.min(100, item.statement.length)
                            );
                            if (appealLabel.length >= 100) {
                                appealLabel += "...";
                            }

                            return (
                                <div
                                    key={index}
                                    tabIndex={0}
                                    className="collapse collapse-arrow">
                                    <input type="checkbox"></input>

                                    <div
                                        className={
                                            "collapse-title mx-0 grid h-20 w-full grid-cols-7 items-center justify-center px-8 text-center text-slate-300 " +
                                            (index % 2 === 0
                                                ? "lighter"
                                                : "darker")
                                        }>
                                        <p className="text-slate-400">
                                            {item.date}
                                        </p>
                                        <p className="">
                                            {item.ccy}
                                            {item.amount.toFixed(2)}
                                        </p>

                                        {item.status === "Rejected" &&
                                        item.appeal === "None" ? (
                                            <a
                                                href={
                                                    "#modal-add-appeal-" + index
                                                }
                                                className="btn-neutral btn btn-outline btn-error btn-sm z-10 w-32 text-sm normal-case">
                                                Add Appeal
                                            </a>
                                        ) : (
                                            <p></p>
                                        )}

                                        {item.status === "Rejected" ? (
                                            <a
                                                href={
                                                    "#modal-rejection-stmt-" +
                                                    index
                                                }
                                                className="btn-neutral btn btn-outline btn-error btn-sm z-10 text-sm normal-case">
                                                Rejection Statement
                                            </a>
                                        ) : (
                                            <p></p>
                                        )}

                                        <p className="text-slate-400">
                                            {item.status}
                                        </p>
                                        <p className="">{item.lineManager}</p>
                                        <p className="">{item.card}</p>
                                    </div>

                                    <div
                                        className={
                                            "collapse-content mx-0 grid h-24 grid-cols-7 items-center justify-center px-8 text-center text-slate-300 " +
                                            (index % 2 === 0
                                                ? "lighter"
                                                : "darker")
                                        }>
                                        <p className="text-slate-400">
                                            {item.expense} Expense
                                        </p>
                                        <a
                                            href={"#modal-appeal-stmt-" + index}
                                            className="col-span-3 pl-14 pr-8 text-left text-slate-400 hover:cursor-pointer  hover:underline">
                                            Appeal Statement: {appealLabel}
                                        </a>
                                        <p className="">
                                            Appeal: {item.appeal}
                                        </p>
                                        <p className="">Type: {item.type}</p>
                                        <p className="cursor-pointer text-sm underline hover:opacity-90">
                                            View Attachment
                                        </p>
                                    </div>

                                    <div
                                        className="modal"
                                        id={"modal-appeal-stmt-" + index}>
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

                                    <div
                                        className="modal"
                                        id={"modal-rejection-stmt-" + index}>
                                        <div className="modal-box">
                                            <h3 className="text-lg font-bold">
                                                Rejection Statement
                                            </h3>
                                            <p className="py-4">
                                                {item.rejectionStatement}
                                            </p>
                                            <div className="modal-action">
                                                <a href="#" className="btn">
                                                    Close
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="modal "
                                        id={"modal-add-appeal-" + index}>
                                        <div className="modal-box p-10">
                                            <h3 className="mb-6 p-1 text-center text-2xl font-bold">
                                                Create Appeal
                                            </h3>
                                            <p className="ml-2 mb-3">
                                                For Expense Claim:
                                            </p>
                                            <div className="rounded-xl bg-base-300 p-5">
                                                <p className="my-1">
                                                    {item.expense} Expense
                                                </p>
                                                <p className="my-1">
                                                    {item.ccy}
                                                    {item.amount}
                                                </p>
                                                <p className="my-1">
                                                    {item.type}
                                                </p>
                                                <p className="my-1">
                                                    {item.date}
                                                </p>
                                                <p className="my-1">
                                                    {item.card}
                                                </p>
                                            </div>
                                            <p className="my-3 ml-2">
                                                Add Appeal Statement:
                                            </p>
                                            <textarea
                                                className="textarea textarea-bordered my-3 h-44 w-full border-2 border-slate-400"
                                                placeholder="Text here..."></textarea>
                                            <div className="flex-rows justofy-center modal-action flex items-center">
                                                <a href="#" className="btn">
                                                    Close
                                                </a>
                                                <a
                                                    href="#"
                                                    type="submit"
                                                    className="btn btn-primary">
                                                    Submit
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div className="dark-primary mx-0 flex h-10 w-full justify-end px-0 text-center text-sm text-slate-300 opacity-90">
                            <div className="btn-group px-4">
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

export default HistoryComponent;
