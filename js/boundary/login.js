export class Login {
    constructor (form) {
        this.username = form.username.value;
        this.password = form.password.value;
    }

    // Methods
    loginStatus() {
        // created a login controller and do login
        // get a return statement from controller
        // update login or error message
        // send to main or redirect
    }

    // Getter
    get loginUsername() {
        return this.username;
    }

    get loginPassword() {
        return this.password;
    }
}