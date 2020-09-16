export class User {
    uid: string;
    email: string;
    password: string;

    constructor(uid: string, email: string, password: string) {
        this.uid = uid;
        this.email = email;
        this.password = password;
    }
}
