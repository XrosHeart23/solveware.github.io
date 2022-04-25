import { collection, query, where, orderBy, startAt, endAt,
    doc, getDoc, getDocs, addDoc, updateDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";
import { db } from "./database.js";

export class Admin {
    #userTable = "userAccount";
    #profileTable = "userProfile";

    // == Account functions ==
    // Add account
    async addAcct(username, password, fname, lname, profile, status) {
        const qry = query(collection(db, this.#userTable),
                    where("username", "==", username));
        const result = await getDocs(qry);
        
        if (result.size == 0) {
            await addDoc(collection(db, this.#userTable), {
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

    // TODO: update account - DONE
    async updateAcct(username, password, fname, lname, profile) {
        const qry = query(collection(db, this.#userTable),
                    where("username", "==", username));
        const result = await getDocs(qry);
        let docId = result.docs[0].id;
                
        await updateDoc(doc(db, this.#userTable, docId), {
            username: username,
            password: password,
            fname: fname,
            lname: lname,
            staffProfile: profile,
        });
    }

    // TODO: suspend account - DONE
    async suspendAcct(username, status) {
        const qry = query(collection(db, this.#userTable),
                    where("username", "==", username));
        const result = await getDocs(qry);
        let docId = result.docs[0].id;
                
        await updateDoc(doc(db, this.#userTable, docId), {
            acctStatus: status,
        });
    }

    // TODO: search accout - DONE
    async searchAcct(username) {
        const qry = query(collection(db, this.#userTable),
                    orderBy('username'),
                    startAt(username), endAt(username + '\uf8ff'));

        const result = await getDocs(qry);

        let acct = [];
        result.docs.forEach((doc) => {
            acct.push({...doc.data(), id: doc.id})
        });
        
        return acct;
    }


    // == Profile functions ==
    // TODO: create profile - DONE
    async addProfile(profileName, status) {
        const qry = query(collection(db, this.#profileTable),
                    where("profileName", "==", profileName));
        const result = await getDocs(qry);

        if (result.size == 0) {
            await addDoc(collection(db, this.#profileTable), {
                                    profileName: profileName,
                                    profileStatus: status,
            });
            return true;
        } else {
            return false;
        }
    }

    // TODO: update profile - DONE
    async updateProfile(profileName) {
        const qry = query(collection(db, this.#profileTable),
                    where("profileName", "==", profileName));
        const result = await getDocs(qry);
        let docId = result.docs[0].id;
                
        await updateDoc(doc(db, this.#profileTable, docId), {
            profileName: profileName,
        });
    }

    // TODO: suspend profile - DONE
    async suspendProfile(profileName, status) {
        const qry = query(collection(db, this.#profileTable),
                    where("profileName", "==", profileName));
        const result = await getDocs(qry);
        let docId = result.docs[0].id;
                
        await updateDoc(doc(db, this.#profileTable, docId), {
            profileStatus: status,
        });
    }

    // TODO: search profile - DONE
    async searchProfile(profileName, type) {
        let qry;
        if (type === "dropdown") {
            qry = query(collection(db, this.#profileTable),
                where("profileStatus", "==", true),
                orderBy('profileName'),
                startAt(profileName), endAt(profileName + '\uf8ff'));
        } else {
            qry = query(collection(db, this.#profileTable),
                orderBy('profileName'),
                startAt(profileName), endAt(profileName + '\uf8ff'));
        }

        const result = await getDocs(qry);

        let profile = [];
        result.docs.forEach((doc) => {
            profile.push({...doc.data(), id: doc.id})
        });
        
        return profile;
    }
}