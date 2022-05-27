import { jest } from '@jest/globals';
import { SearchOrdersCtrl } from "../controller/ordersController.js";

// Jest environment functions
jest.useFakeTimers();

const controller = new SearchOrdersCtrl();

// Test view details of the search result is as expected
test("Search for specific order", async () => {
    let searchResult = await controller.doSearchOrder(96130218, "phoneNumber", "incomplete");

    expect(searchResult[0].phoneNumber).toBe(96130218);
});