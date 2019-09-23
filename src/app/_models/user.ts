export class User {
    id: string;
    email: string;
    firstname: string;
    lastname: string;

    constructor(id: string, email: string, name: string) {
        this.id = id;
        this.email = email;
        [this.firstname, this.lastname] = name.split(' ');
    }
}
