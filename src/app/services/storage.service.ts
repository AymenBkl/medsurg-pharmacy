import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  async storeUser(user: User) {
    console.log(user);
    await localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): User  {
    const  user  = JSON.parse(localStorage.getItem('user'));
    if (user && user != null){
      return user;
    }
    else {
      return null;
    }
  }

  getToken(): string {
    const  user: User  = JSON.parse(localStorage.getItem('user'));
    if (user && user != null){
      return user.token;
    }
    else {
      return '';
    }
  }

  removeUser() {
    localStorage.removeItem('user');
  }
}
