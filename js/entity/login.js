import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";
import { db } from "./database.js";

export class Login {
    table = "userAccount";
    name = "";
    userProfile;
    acctStatus;

    constructor(username, password) {
        this.username = username;
        this.password = password;
    };

    // Query for username and password in database
    // Count the number of data returns
    // Return count | 0 = no account | 1 = account is valid | >1 = invalid
    async getLogin() {
        const qry = query(collection(db, this.table),
                    where("username" , "==", this.username),
                    where("password" , "==", this.password),
                    where("acctStatus", "==", true));
        
        const result = await getDocs(qry);

        let acct = []
        result.docs.forEach((doc) => {
            acct.push({...doc.data(), id: doc.id})
        });

        return acct;
    }
}