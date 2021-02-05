import {AuthService} from '../services/auth.service';
import { User } from '../interfaces/user';
export class UserLogique {
    
    private authService: AuthService;
    constructor(){}

    public getCurrentUser(currentUser: User) {
        this.authService.getCurrentUser()
            .subscribe(user => {
                currentUser = user;
            });
        return currentUser;
    }
}
