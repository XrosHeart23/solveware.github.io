import { collection, query, where, orderBy, startAt, endAt,
    doc, getDoc, getDocs, addDoc, updateDoc
} from "firebase/firestore/lite";
//"https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";
import { db } from "./database.js";
import { UserProfile } from "./userProfile.js";

export class UserAccount {
    #userTable = "userAccount";
    #profileTable = "userProfile";

    fname;
    lname;
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
        const qry = query(collection(db, this.#userTable),
                    where("username" , "==", this.username),
                    where("acctStatus", "==", true));
        
        const result = await getDocs(qry);

        let acct = []
        result.docs.forEach((doc) => {
            acct.push({...doc.data(), id: doc.id})
        });

        return acct;
    }

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
                                    userProfile: profile,
                                    acctStatus: status,
                                });
            return true;
        } else {
            return false;
        }
    }

    // TODO: update account - DONE
    async updateAcct(username, password, fname, lname, profile, userId) {              
        await updateDoc(doc(db, this.#userTable, userId), {
            username: username,
            password: password,
            fname: fname,
            lname: lname,
            userProfile: profile,
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
    async searchAcct(name, searchData) {
        const qry = query(collection(db, this.#userTable),
                        orderBy('fname'),
                        orderBy('lname'));
        const result = await getDocs(qry);

        let acct = [];
        result.docs.forEach((doc) => {
            acct.push({...doc.data(), id: doc.id})
        });
        
        let searchResult = []
        if (searchData === "username") {
            acct.forEach((user) => {
                if (user.username.toLowerCase() === name.toLowerCase())
                    searchResult.push(user);
            });
        } else {
            acct.forEach((user) => {
                let fullName = user.fname + " " + user.lname;
                if (fullName.toLowerCase().includes(name.toLowerCase()))
                    searchResult.push(user);
            });
        }

        return searchResult;
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
    async updateProfile(profileName, userId) {              
        await updateDoc(doc(db, this.#profileTable, userId), {
            profileName: profileName,
        });
    }

    // TODO: suspend profile - DONE
    async suspendProfile(profileName, status, userId) {
        await updateDoc(doc(db, this.#profileTable, userId), {
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
        }
        else {
            qry = query(collection(db, this.#profileTable),
                orderBy('profileName'));
        }

        const result = await getDocs(qry);

        let profile = [];
        result.docs.forEach((doc) => {
            if (type === "dropdown") {
                profile.push({...doc.data(), id: doc.id});
            }
            else if (type === "exact") {
                if (doc.data().profileName.toLowerCase() === profileName.toLowerCase())
                    profile.push({...doc.data(), id: doc.id});
            }
            else if (doc.data().profileName.toLowerCase().includes(profileName.toLowerCase())) {
                profile.push({...doc.data(), id: doc.id});
            }
        });
        
        return profile;
    }

    // Set user info
    setUserInfo(fname, lname, userProfile, acctStatus) {
        const userP = new UserProfile (userProfile);

        this.fname = fname;
        this.lname = lname;
        this.acctStatus = acctStatus;
        this.userProfile = userP.getProfileName;
    }
}