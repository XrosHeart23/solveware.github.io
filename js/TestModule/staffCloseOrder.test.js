import { jest } from '@jest/globals';
import { SearchOrdersCtrl, UpdateOrdersCtrl, CloseOrdersCtrl } from "../controller/ordersController.js";

// Jest environment functions
jest.useFakeTimers();

const updateController = new UpdateOrdersCtrl();
const searchController = new SearchOrdersCtrl();
const closeController = new CloseOrdersCtrl();


// Test close of order ticket status is as expected
test("Close ticket order", async () => {
    await updateController.doUpdateOrderStatus("completed", "nebqwl2fAcPr5rTQajlG");
    await closeController.doCloseOrder("nebqwl2fAcPr5rTQajlG");

    let searchResult = await searchController.doSearchOrder("nebqwl2fAcPr5rTQajlG", "orderId");
    expect(searchResult[0].orderTicketStatus).toBeTruthy();
});