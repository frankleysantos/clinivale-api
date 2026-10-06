export interface Auth {
    user? : user;
    access_token: string;
}

type user = {
    id?: number;
    name: string;
    email: string;
    password: string;
}