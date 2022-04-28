export class UserProfile {
    constructor (profileName) {
        this.profileName = profileName;
    }

    // Set profile name
    setProfileName (profileName) {
        this.profileName = profileName;
    }

    // Get profile name
    get getProfileName () {
        return this.profileName;
    }
}