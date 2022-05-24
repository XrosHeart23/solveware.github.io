import { collection, query, where, orderBy, startAt, endAt,
    doc, getDoc, getDocs, addDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";
import { db } from "./database.js";

export class CouponCode {
    #couponCodeTable = "couponCode";

    async addCouponCode(couponCode, discount, category, couponStatus) {
        const qry = query(collection(db, this.#couponCodeTable),
                    where("couponCode", "==", couponCode));
            
        const result = await getDocs(qry);

        if (result.size == 0) {
            await addDoc(collection(db, this.#couponCodeTable), {
                couponCode: couponCode,
                discount: discount,
                catID: category,
                couponStatus: couponStatus,
            });

            return true;
        }
        else {
            return false;
        }
    }

    async searchCouponCode(couponCode, type) {
        let qry, result;
        let codes = [];

        if (type === "search") {
            qry = query(collection(db, this.#couponCodeTable),
                    orderBy("couponCode"));
            result = await getDocs(qry);

            result.docs.forEach((doc) => {
                if (doc.data().couponCode.includes(couponCode.toUpperCase()))
                    codes.push({...doc.data(), id: doc.id});
                else if (couponCode === "")
                    codes.push({...doc.data(), id: doc.id});
            });
        }
        else if (type === "exact") {
            qry = query(collection(db, this.#couponCodeTable),
                    where("couponCode", "==", couponCode.toUpperCase()));
            result = await getDocs(qry);
            result.docs.forEach((doc) => {
                codes.push({...doc.data(), id: doc.id});
            });
        }

        return codes;
    }

    async updateCouponCode(couponCode, discount, category, couponId) {
        await updateDoc(doc(db, this.#couponCodeTable, couponId), {
            couponCode: couponCode,
            discount: discount,
            catID: category,
        });
    }

    async suspendCouponCode(couponCode, status) {
        const qry = query(collection(db, this.#couponCodeTable),
                    where("couponCode", "==", couponCode));
        const result = await getDocs(qry);
        let docId = result.docs[0].id;
                
        await updateDoc(doc(db, this.#couponCodeTable, docId), {
            couponStatus: status,
        });
    }
}