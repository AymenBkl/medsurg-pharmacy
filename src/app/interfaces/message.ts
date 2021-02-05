import { User } from "./user";

export interface Message {
    message : string;
    to : string;
    from : User;
}