import { collection, query, where, 
    doc, getDoc, getDocs, addDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";
import { db } from "./database.js";

export class Admin {
    userTable = "userAccount";
    profileTable = "userProfile";

    // Account functions
    async addAcct(username, password, fname, lname, profile, status) {
        const qry = query(collection(db, this.userTable),
                    where("username", "==", username));
        const result = await getDocs(qry);
        
        if (result.size == 0) {
            await addDoc(collection(db, this.userTable), {
                                    username: username,
                                    password: password,
                                    fname: fname,
                                    lname: lname,
                                    staffProfile: profile,
                                    acctStatus: status,
                                });
            return true;
        } else {
            return false;
        }
    }

    // TODO: update account

    // TODO: suspend account
    async suspendAcct(username, status) {
        const qry = query(collection(db, this.userTable),
                    where("username", "==", username));
        const result = await getDocs(qry);
        let docId = result.docs[0].id;
                
        await updateDoc(doc(db, this.userTable, docId), {
            acctStatus: status,
        });
    }

    // TODO: search accout


    // TODO: Profile functions
    // TODO: create profile
    async addProfile(profileName, status) {
        const qry = query(collection(db, this.profileTable),
                    where("profileName", "==", profileName));
        const result = await getDocs(qry);

        if (result.size == 0) {
            await addDoc(collection(db, this.profileTable), {
                                    profileName: profileName,
                                    profileStatus: status,
            });
            return true;
        } else {
            return false;
        }
    }


    // TODO: update profile

    // TODO: suspend profile
    async suspendProfile(profileName, status) {
        const qry = query(collection(db, this.profileTable),
                    where("username", "==", profileName));
        const result = await getDocs(qry);
        let docId = result.docs[0].id;
                
        await updateDoc(doc(db, this.profileTable, docId), {
            profileStatus: status,
        });
    }

    // TODO: search profile
}