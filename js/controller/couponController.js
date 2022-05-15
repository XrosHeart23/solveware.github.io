import { CouponCode } from "../entity/couponCode.js";

export class CouponCodeCtrl {

}

// Create new coupon code
export class CreateCouponCtrl {
    #couponStatus = true; // Coupon status default is activated;

    constructor() {
        this.coupon = new CouponCode();
    }

    async doCreateCoupon(couponCode, discount, category) {
        discount = discount/100; // Convert discount% int value to decmial value
        return await this.coupon.addCouponCode(couponCode, discount, category, this.#couponStatus);
    }
}


// Search for coupon code
export class SearchCouponCtrl {
    constructor() {
        this.coupon = new CouponCode();
    }

    async doSearchCoupon(couponCode, type) {
        return await this.coupon.searchCouponCode(couponCode, type);
    }
}


// Update coupon code details
export class UpdateCouponCtrl {
    constructor() {
        this.coupon = new CouponCode();
    }

    async doUpdateCoupon(couponCode, discount, category, couponId) {
        discount = discount/100;
        await this.coupon.updateCouponCode(couponCode, discount, category, couponId);
    }
}


// Suspend or Activate coupon code
export class SuspendCouponCtrl {
    constructor() {
        this.coupon = new CouponCode();
    }

    async doSuspendCoupon(couponCode, status) {
        status = !status;
        await this.coupon.suspendCouponCode(couponCode, status);
        
        return status;
    }
}