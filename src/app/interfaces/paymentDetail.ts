import { User } from "./user";

export interface PaymentDetail {
    _id:string;
    bankAccountNumber: string;
    IFSCCODE: string;
    ACCOUNTHOLDERNAME: string;
    user: User;
}