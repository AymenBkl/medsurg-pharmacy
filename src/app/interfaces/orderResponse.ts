import { Order } from './order';

export interface OrderResponse {
    err: string;
    success: boolean;
    msg: string;
    status: number;
    message: Order | Order[] | any;
}
