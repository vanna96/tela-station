

export default class AuthLogin {

    database: string
    username: string
    password: string

    constructor(database: string, username: string, password: string) {
        this.database = database;
        this.username = username;
        this.password = password;
    }

    toJson() {
        return {
            CompanyDB: this.database,
            UserName: this.username,
            Password: this.password,
        }
    }
}