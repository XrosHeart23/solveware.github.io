import { jest } from '@jest/globals';
import { AdminSuspendAcctCtrl } from "../controller/adminController.js";

jest.useFakeTimers();
jest.setTimeout(600000);

const controller = new AdminSuspendAcctCtrl();

// Test suspend account to be suspended
test("Suspend user account", async () => {
    expect(await controller.doSuspendAcct("user100", true)).toBeFalsy();
});

// Test activate account to be activated
test("Activate user account", async () => {
    expect(await controller.doSuspendAcct("user99", false)).toBeTruthy();
});