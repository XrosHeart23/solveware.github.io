import { jest } from '@jest/globals';
import { SearchOrdersCtrl, UpdateOrdersCtrl } from "../controller/ordersController.js";

// Jest environment functions
jest.useFakeTimers();

const updateController = new UpdateOrdersCtrl();
const searchController = new SearchOrdersCtrl();


// Test updating of order status is as expected
test("Update order status", async () => {
    await updateController.doUpdateOrderStatus("kitchen", "qKajd2qlIC7MH3lnCNHz");

    let searchResult = await searchController.doSearchOrder("qKajd2qlIC7MH3lnCNHz", "orderId");
    expect(searchResult[0].orderStatus).toMatch(/kitchen/);
});