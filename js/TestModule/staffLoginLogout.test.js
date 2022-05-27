import { jest } from '@jest/globals';
import { StaffLoginController } from "../controller/loginController.js";
import { loginLogout } from "../include.js"

// Jest environment functions
jest.useFakeTimers();

const controller = new StaffLoginController("staff", "staff");

// Test staff login
test("Login staff account", async () => {
    // Controller login
    await controller.validateLogin();

    // Test to check login status == True
    expect(controller.getLoginStatus).toBeTruthy();
});

// Test logout staff
test("Logout staff account", () => {
    expect(loginLogout);
});