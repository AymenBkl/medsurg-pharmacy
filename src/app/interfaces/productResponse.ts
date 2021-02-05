import { Product} from './product';

export interface ProductResponse {
    err: string;
    success: boolean;
    msg: string;
    status: number;
    product: Product | Product[] | any;
}
