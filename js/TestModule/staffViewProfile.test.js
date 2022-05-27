import { jest } from '@jest/globals';
import { StaffLoginController } from "../controller/loginController.js";

// Jest environment functions
jest.useFakeTimers();

const controller = new StaffLoginController("staff", "staff");

// Test profile details is correct after login
test("View user profile", async () => {
    await controller.validateLogin();

    expect(controller.getUserInfo.username).toBe("staff");
});