import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {


 
  currentUser:User;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    
  }


  getCurrentUser() {
    this.currentUser = this.authService.user;
  }

  ionViewDidEnter(){

    this.getCurrentUser();
    
  }
}
