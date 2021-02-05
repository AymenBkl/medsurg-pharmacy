import { Order } from "./order";
import { User } from "./user";

export interface Refund {
    _id:string;
    patient: User;
    order: Order;
    pharmacy:User;
    payedByAdmin:string;
    refundPrice:number;
}