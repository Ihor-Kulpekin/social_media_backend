import { ObjectId } from "mongodb";

export interface User {
    _id: string,
    name: string,
    password: string,
    email: string,
    lastName: string
}
