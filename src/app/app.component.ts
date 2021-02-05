import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { User } from './interfaces/user';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public isAuth: any;
  public user: User;
  public appPages = [
    {
      title: 'Home',
      url: 'home',
      icon: 'home',
      auth : true
    },
    {
      title: 'Profile',
      url: 'profile',
      icon: 'people-circle',
      auth : true
    },
    {
      title: 'All Medecins',
      url: 'all-main-products',
      icon: 'bandage',
      auth : true
    },
    {
      title: 'Prescriptions',
      url: 'prescriptions',
      icon: 'document',
      auth : true
    },
    {
      title: 'Login',
      url: 'login',
      icon: 'log-in',
      auth : false
    },
    {
      title: 'Orders',
      url: 'orders',
      icon: 'cart',
      auth : true
    },
    {
      title: 'Register',
      url: 'register',
      icon: 'document-text',
      auth : false
    },
    {
      title: 'Logout',
      url: 'log-out',
      icon: 'log-out',
      auth : true,
    }
  ];
  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  public appSupport = [
    {
      title: 'Contact Admin',
      url: 'messages',
      icon: 'chatbubble',
      auth : true
    },

  ];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    this.authService.checkJWT();
    this.menuItems();
    this.getCurrentUser();
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }

  menuItems(){
    this.isAuth = this.authService.user ? true : false;
    this.authService.authenticated
      .subscribe(authenticated => {
        console.log(authenticated);
        this.isAuth = authenticated;
      });
  }
  getCurrentUser() {
    this.authService.getCurrentUser()
      .subscribe(user => {
        this.user = user;
      });
  }

  logOut(){
    this.authService.logOut()
      .then(() => {
        this.router.navigate(['/login']);
      }).catch(() => {
        this.router.navigate(['/login']);
      });
  }
}
