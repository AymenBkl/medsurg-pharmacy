import { Product } from "./product";
import { User } from "./user";

export interface Comment {
    prescription:string;
    _id:string;
    pharmacy: User;
    createdAt: string;
    status:string;
    products: {product: Product,quantity: number}[];
}
