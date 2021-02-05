import { Category } from './category';

export interface CategoryResponse {
    err: string;
    success: boolean;
    msg: string;
    status: number;
    category: Category | Category[] | any;
}
