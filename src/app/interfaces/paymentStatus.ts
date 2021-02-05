import { PaymentDetails } from "./paymentDetails";

export interface PaymentStatus {
    orderAmount:string;
    orderCurrency:string;
    orderExpiryTime:string;
    orderStatus:string;
    paymentMode:string;
    referenceId:string;
    status:string;
    txMsg:string;
    txStatus:string;
    txTime:string;
    paymentDetails:PaymentDetails;
}