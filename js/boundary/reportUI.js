import { GetMenuCatCtrl } from "../controller/menuController.js";
import { ReportFoodCtrl, ReportMoneyCtrl, ReportTimeCtrl } from "../controller/reportController.js";


export class ReportUI {
    tbody = document.getElementById("displayTableByOptions");

    // Generate report base on owner input
    async generatReport(form) {
        let reportController, report;
        switch (form.reportType.value.toLowerCase()) {
            case "time":
                reportController = new ReportTimeCtrl();
                report = await reportController.doGenerateReport(form);
                break;
            case "money":
                reportController = new ReportMoneyCtrl();
                report = await reportController.doGenerateReport(form);
                break;
            case "preference":
                reportController = new ReportFoodCtrl();
                report = await reportController.doGenerateReport(form);
                break;
        }
        this.displayReport(report, form.reportType.value.toLowerCase());
    }

    async displayReport(report, reportType) {
        // Hide generate report table;
        document.getElementById("generateReportTable").style.display = "none";
        document.getElementById("report_result").style.display = "table";
        
        const tbl = document.getElementById("report_result");
        tbl.innerHTML = "";

        if (reportType === "time" || reportType === "money") {
            let thead = tbl.insertRow();
            let th = document.createElement("th");
            th.setAttribute("id", "report_head");
            th.setAttribute("class", "report_head");
            th.setAttribute("colspan", 2);
            th.innerHTML = `${report.reportDurationType.charAt(0).toUpperCase() + report.reportDurationType.slice(1)} Report`
            thead.appendChild(th);

            let tr = tbl.insertRow();
            let td = tr.insertCell();
            td.appendChild(document.createTextNode("Date"));

            td = tr.insertCell();
            let inputField = document.createElement("input");
            inputField.setAttribute("id", "report_date");
            inputField.setAttribute("value", report.reportDate);
            inputField.readOnly = true;
            td.appendChild(inputField);


            tr = tbl.insertRow();
            td = tr.insertCell();
            td.appendChild(document.createTextNode("Total orders"));

            td = tr.insertCell();
            inputField = document.createElement("input");
            inputField.setAttribute("id", "report_totalOrders");
            inputField.setAttribute("value", report.totalOrders);
            inputField.readOnly = true;
            td.appendChild(inputField);


            tr = tbl.insertRow();
            td = tr.insertCell();
            td.appendChild(document.createTextNode("Unique customers"));

            td = tr.insertCell();
            inputField = document.createElement("input");
            inputField.setAttribute("id", "report_uniqueCustomer");
            inputField.setAttribute("value", report.uniqueCustomer);
            inputField.readOnly = true;
            td.appendChild(inputField);


            tr = tbl.insertRow();
            td = tr.insertCell();
            td.appendChild(document.createTextNode(report.avgType));

            td = tr.insertCell();
            inputField = document.createElement("input");
            inputField.setAttribute("id", "report_avg");
            let avg = (!isNaN(report.avg)) ? report.avg : 0;
            inputField.setAttribute("value", avg);
            inputField.readOnly = true;
            td.appendChild(inputField);
        }
        else {
            let thead = tbl.insertRow();
            let th = document.createElement("th");
            th.setAttribute("id", "report_head");
            th.setAttribute("class", "report_head");
            th.setAttribute("colspan", 2);
            th.innerHTML = "Food Preference"; 
            thead.appendChild(th);


            let tr = tbl.insertRow();
            let td = tr.insertCell();
            td.appendChild(document.createTextNode("Food Category"));

            td = tr.insertCell();
            let inputField = document.createElement("input");
            inputField.setAttribute("id", "food_category");
            inputField.setAttribute("value", report.searchCategory);
            inputField.readOnly = true;
            td.appendChild(inputField);


            tr = tbl.insertRow();
            td = tr.insertCell();
            td.setAttribute("colspan", 2);
            
            let innerTable = document.createElement("table");
            innerTable.setAttribute("id", "itemOrderedTable");
            innerTable.setAttribute("class", "itemOrderedTable");
            let innerThead = innerTable.insertRow();
            let innerTh = document.createElement("th");
            innerTh.innerHTML = "Item name"; 
            innerThead.appendChild(innerTh);
            innerTh = document.createElement("th");
            innerTh.innerHTML = "Total ordered"; 
            innerThead.appendChild(innerTh);

            for (const [key, value] of Object.entries(report.totalOrdersPerItem)) {
                let innerTr = innerTable.insertRow();
                let innerTd = innerTr.insertCell();
                innerTd.innerHTML = key;
                innerTd = innerTr.insertCell();
                innerTd.innerHTML = value;
            }
            td.appendChild(innerTable);
        }
    }

    async displayReportFormTable(reportType) {
        if (reportType.toLowerCase() === "preference") {
            await this.displayPreferenceOptions();
        }
        else {
            this.displayDurationOptions();
        }
    }

    displayDurationOptions() {
        // Clear tbody before display options
        this.tbody.innerHTML = "";
        document.getElementById("reportSubmitBtn").style.display = "none";
        let durationOptions = ["Daily", "Weekly", "Monthly"];

        let tr = this.tbody.insertRow();
        let td = tr.insertCell();
        td.appendChild(document.createTextNode("Duration type"));
        
        td = tr.insertCell();
        let durationDropdown = document.createElement("select");
        durationDropdown.setAttribute("name", "durationType");
        durationDropdown.setAttribute("id", "reportDuration_type");

        let option = document.createElement("option");
        option.setAttribute("value", "");
        option.setAttribute("style", "display:none");
        option.setAttribute("selected", "selected");
        option.disabled = true;
        option.hidden = true;
        durationDropdown.appendChild(option);

        durationOptions.forEach((item) => {
            option = document.createElement("option");
            option.setAttribute("value", item.toLowerCase());
            option.innerHTML = item;

            durationDropdown.appendChild(option);
        });
        td.appendChild(durationDropdown);

        durationDropdown.addEventListener("change", () => {
            document.getElementById("reportSubmitBtn").style.display = "none";
            this.displayDateOptions(durationDropdown.value);
        });
    }

    displayDateOptions(selectedDurationType) {
        let tr;
        if (document.getElementById("dateOptionRow")) {
            tr = document.getElementById("dateOptionRow");
            tr.innerHTML = "";
        }
        else {
            tr = this.tbody.insertRow();
            tr.setAttribute("id", "dateOptionRow");
        }
        
        let td = tr.insertCell();
        let inputField;
        if (selectedDurationType === "daily") {
            td.appendChild(document.createTextNode("Select date"));

            td = tr.insertCell();
            inputField = document.createElement("input");
            inputField.setAttribute("type", "date");
            inputField.setAttribute("name", "date");
            inputField.setAttribute("id", "reportDate");
        }
        else if (selectedDurationType === "weekly") {
            td.appendChild(document.createTextNode("Select week"));

            td = tr.insertCell();
            inputField = document.createElement("input");
            inputField.setAttribute("type", "week");
            inputField.setAttribute("name", "date");
            inputField.setAttribute("id", "reportDate");
        }
        else if (selectedDurationType === "monthly") {
            td.appendChild(document.createTextNode("Select month"));

            td = tr.insertCell();
            inputField = document.createElement("input");
            inputField.setAttribute("type", "month")
            inputField.setAttribute("name", "date");
            inputField.setAttribute("id", "reportMonth");
        }
        td.appendChild(inputField);

        if (inputField) {
            inputField.addEventListener("change", () => {
                document.getElementById("reportSubmitBtn").style.display = "block";
            });
        }   
    }

    async displayPreferenceOptions() {
        // Clear tbody before display options
        this.tbody.innerHTML = "";
        document.getElementById("reportSubmitBtn").style.display = "none";

        let tr = this.tbody.insertRow();
        let td = tr.insertCell();
        td.appendChild(document.createTextNode("Food category"));

        const menuController = new GetMenuCatCtrl();
        let category = await menuController.doGetAllCat();

        td = tr.insertCell();
        let inputField = document.createElement("select");
        inputField.setAttribute("name", "category");
        inputField.setAttribute("id", "report_category");
        
        let option = document.createElement("option");
        option.setAttribute("value", "");
        option.setAttribute("style", "display:none");
        option.setAttribute("selected", "selected");
        option.disabled = true;
        option.hidden = true;
        inputField.appendChild(option);

        category.forEach((cat) => {
            option = document.createElement("option");
            option.setAttribute("value", cat.catID);
            option.innerHTML = cat.catName.charAt(0).toUpperCase() + cat.catName.slice(1);

            inputField.appendChild(option);
        });

        option = document.createElement("option");
        option.setAttribute("value", "all");
        option.innerHTML = "All";

        inputField.appendChild(option);

        td.appendChild(inputField);

        if (inputField) {
            inputField.addEventListener("change", () => {
                document.getElementById("reportSubmitBtn").style.display = "block";
            });
        }   
    }
}