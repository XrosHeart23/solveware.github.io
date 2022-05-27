import { jest } from '@jest/globals';
import { SearchOrdersCtrl } from "../controller/ordersController.js";

// Jest environment functions
jest.useFakeTimers();

const controller = new SearchOrdersCtrl();

// Test search function to find specific order in order table
test("Search for specific order", async () => {
    let searchResult = await controller.doSearchOrder(96130218, "phoneNumber", "incomplete");

    expect(searchResult.length).toBe(1);
});