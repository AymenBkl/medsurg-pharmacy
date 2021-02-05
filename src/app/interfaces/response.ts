import { User } from './user';
export interface AuthResponse {
    err: string;
    success: boolean;
    token: string;
    msg: string;
    status: number;
    user: User;
}
