import { Comment } from './comment';
import { User } from './user';

export interface Prescription {
    _id: string;
    patient: User | string,
    description: string;
    imageUrl: string;
    comments: Comment[];
    status:string;
    createdAt:string;
}
