import { Message } from './message';

export interface MessageResponse {
    err: string;
    success: boolean;
    msg: string;
    status: number;
    message: Message | Message[] | any;
}
