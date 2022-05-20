import { MenuItem } from "../entity/menuItem.js";
import { MenuCategory } from "../entity/menuCategory.js";
import { Orders } from "../entity/orders.js";


// Report for average time spent controller
// Duration will be past in and the controller will calculated the data accordingly
export class ReportTimeCtrl {
    constructor () {
        this.orders = new Orders();
    }

    async doGenerateReport(form) {
        let reportDate, searchResult, avgVisitTime, year, month, week, startDate, endDate;
        switch (form.reportDuration_type.value.toLowerCase()) {
            case "daily":
                startDate = new Date(form.date.value);
                startDate.setUTCHours(0,0,0,0);
                endDate = new Date(startDate.getTime());
                endDate.setUTCHours(23,59,59,999);

                searchResult = await this.orders.searchOrderByDate(startDate, endDate);
                avgVisitTime = this.calculateAverageTime(searchResult);
                reportDate = form.date.value;
                break;
            case "weekly":
                [year, week] = form.date.value.split("-");
                week = week.slice(1);
                [startDate, endDate] = this.getDateOfISOWeek(week, year);

                searchResult = await this.orders.searchOrderByDate(startDate, endDate);
                avgVisitTime = this.calculateAverageTime(searchResult);
                startDate.setDate(startDate.getDate() + 1);
                reportDate = `${startDate.getDate()}-${(startDate.getMonth() + 1)}-${startDate.getFullYear()} to ${endDate.getDate()}-${(endDate.getMonth() + 1)}-${endDate.getFullYear()}`;
                break;
            case "monthly":
                console.log(form.date.value);
                [year, month] = form.date.value.split("-");
                [startDate, endDate] = this.getDateOfMonth(month, year);
                console.log(startDate);
                console.log(endDate);

                searchResult = await this.orders.searchOrderByDate(startDate, endDate);
                avgVisitTime = this.calculateAverageTime(searchResult);
                startDate.setDate(startDate.getDate() + 1);
                reportDate = `${startDate.getDate()}-${(startDate.getMonth() + 1)}-${startDate.getFullYear()} to ${endDate.getDate()}-${(endDate.getMonth() + 1)}-${endDate.getFullYear()}`;
                break;
        }

        let report = {
            "reportDurationType" : form.reportDuration_type.value.toLowerCase(),
            "reportDate" : reportDate,
            "totalOrders" : searchResult.length,
            "avgType" : "Average Time Spent per Visit",
            "avg" : avgVisitTime.toFixed(2),
            "uniqueCustomer" : this.getDistinctValue(searchResult).length
        };

        return report;
    }

    calculateAverageTime(searchResults) {
        let avg = 0;
        searchResults.forEach((item) => {
            avg += item.visitDurationInSec;
        });
        avg = avg / searchResults.length;
        
        return avg;
    }

    getDistinctValue(searchResults) {
        return [...new Set(searchResults.map(item => item.phoneNumber))];
    }

    getDateOfISOWeek(w, y) {
        let simple = new Date(y, 0, 1 + (w - 1) * 7);
        let dow = simple.getDay();
        let ISOweekStart = simple;
        if (dow <= 4)
            ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
        else
            ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
        ISOweekStart.setUTCHours(0,0,0,0);

        let ISOweekEnd = new Date(ISOweekStart);
        ISOweekEnd.setDate(ISOweekStart.getDate() + 6);
        ISOweekEnd.setUTCHours(23,59,59,999);
        
        return [ISOweekStart, ISOweekEnd];
    }

    getDateOfMonth(m, y) {
        // console.log(m);
        let startDate = new Date(y, m - 1, 1);
        let endDate = new Date(y, m, 0);

        startDate.setUTCHours(0,0,0,0);
        endDate.setUTCHours(23,59,59,999);
        return [startDate, endDate];
    }
}


// Report for average money spent controller
// Duration will be past in and the controller will calculated the data accordingly
export class ReportMoneyCtrl {
    constructor () {
        this.orders = new Orders();
    }

    async doGenerateReport(form) {
        let reportDate, searchResult, avgMoneySpent, year, month, week, startDate, endDate;
        switch (form.reportDuration_type.value.toLowerCase()) {
            case "daily":
                startDate = new Date(form.date.value);
                startDate.setUTCHours(0,0,0,0);
                endDate = new Date(startDate.getTime());
                endDate.setUTCHours(23,59,59,999);

                searchResult = await this.orders.searchOrderByDate(startDate, endDate);
                avgMoneySpent = this.calculateAverageMoneySpent(searchResult);
                reportDate = form.date.value;
                break;
            case "weekly":
                [year, week] = form.date.value.split("-");
                week = week.slice(1);
                [startDate, endDate] = this.getDateOfISOWeek(week, year);

                searchResult = await this.orders.searchOrderByDate(startDate, endDate);
                avgMoneySpent = this.calculateAverageMoneySpent(searchResult);
                startDate.setDate(startDate.getDate() + 1);
                reportDate = `${startDate.getDate()}-${(startDate.getMonth() + 1)}-${startDate.getFullYear()} to ${endDate.getDate()}-${(endDate.getMonth() + 1)}-${endDate.getFullYear()}`;
                break;
            case "monthly":
                console.log(form.date.value);
                [year, month] = form.date.value.split("-");
                [startDate, endDate] = this.getDateOfMonth(month, year);
                console.log(startDate);
                console.log(endDate);

                searchResult = await this.orders.searchOrderByDate(startDate, endDate);
                avgMoneySpent = this.calculateAverageMoneySpent(searchResult);
                startDate.setDate(startDate.getDate() + 1);
                reportDate = `${startDate.getDate()}-${(startDate.getMonth() + 1)}-${startDate.getFullYear()} to ${endDate.getDate()}-${(endDate.getMonth() + 1)}-${endDate.getFullYear()}`;
                break;
        }

        let report = {
            "reportDurationType" : form.reportDuration_type.value.toLowerCase(),
            "reportDate" : reportDate,
            "totalOrders" : searchResult.length,
            "avgType" : "Average Money Spent per Visit",
            "avg" : avgMoneySpent.toFixed(2),
            "uniqueCustomer" : this.getDistinctValue(searchResult).length
        };

        return report;
    }

    calculateAverageMoneySpent(searchResults) {
        let avg = 0;
        searchResults.forEach((item) => {
            avg += item.totalPrice;
        });
        avg = avg / searchResults.length;
        
        return avg;
    }

    getDistinctValue(searchResults) {
        return [...new Set(searchResults.map(item => item.phoneNumber))];
    }

    getDateOfISOWeek(w, y) {
        let simple = new Date(y, 0, 1 + (w - 1) * 7);
        let dow = simple.getDay();
        let ISOweekStart = simple;
        if (dow <= 4)
            ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
        else
            ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
        ISOweekStart.setUTCHours(0,0,0,0);

        let ISOweekEnd = new Date(ISOweekStart);
        ISOweekEnd.setDate(ISOweekStart.getDate() + 6);
        ISOweekEnd.setUTCHours(23,59,59,999);
        
        return [ISOweekStart, ISOweekEnd];
    }

    getDateOfMonth(m, y) {
        // console.log(m);
        let startDate = new Date(y, m - 1, 1);
        let endDate = new Date(y, m, 0);

        startDate.setUTCHours(0,0,0,0);
        endDate.setUTCHours(23,59,59,999);
        return [startDate, endDate];
    }
}


// Report for food controller
// Controller will calcalute the total food ordered for each category
export class ReportFoodCtrl {
    constructor () {
        this.orders = new Orders();
        this.menuItem = new MenuItem();
        this.menuCat = new MenuCategory();
    }

    async doGenerateReport(form) {
        let searchCategory = form.category.value;
        let categoryName = (searchCategory === "all") ? "All" : (await this.menuCat.getCatNameById(searchCategory)).catName;
        let searchResult = await this.orders.searchOrder();
        let allMenuItems = await this.menuItem.getAllMenuItems();

        let itemIDinCat = {};
        allMenuItems.forEach((items) => {
            if (items.itemCategory === searchCategory)
                itemIDinCat[items.id] = 0;
            else if (searchCategory === "all")
                itemIDinCat[items.id] = 0;
        });

        searchResult.forEach((result) => {
            for (const [key, value] of Object.entries(result.orderInfo)) {
                if (key in itemIDinCat)
                    itemIDinCat[key] += value;
            }
        });

        let ordersPerItem = {};
        for (const [key, value] of Object.entries(itemIDinCat)) {
            for (let item of allMenuItems) {
                if (key === item.id) {
                    ordersPerItem[item.itemName] = value;
                    break;
                }
            }
        }

        
        let report = {
            "searchCategory" : categoryName,
            "totalOrdersPerItem" : this.sortItems(ordersPerItem, "desc")
        };

        return report;
    }

    sortItems(itemList, sortOrder = "asc") {
        let sortable;
        if (sortOrder === "desc") {
            sortable = Object.fromEntries(
                Object.entries(itemList).sort(([,a],[,b]) => a-b).reverse()
            );
        }
        else {
            sortable = Object.fromEntries(
                Object.entries(itemList).sort(([,a],[,b]) => a-b)
            );
        }
    
        return sortable;
    }
}
