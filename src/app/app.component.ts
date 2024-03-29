import { Component, OnInit } from '@angular/core';

import { NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { User } from './interfaces/user';
import { Router } from '@angular/router';
import { File } from '@ionic-native/file/ngx';

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
    private file: File,
    private navCntrl: NavController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.platform.backButton.subscribeWithPriority(10, () => {
        console.log("event fired");
        if (this.router.url != '/tabs/tab1' && this.router.url != '/login' && this.router.url != '/register' ){
          this.navCntrl.back();
        }
        console.log("router",this.router.url)
      });
      //this.createDirImages();
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


 /**  createDirImages(){
    console.log('aymenxyzbkltest')
    console.log('aymenxyzbkltest',this.file.applicationStorageDirectory);
    if(this.platform.is('android')) {
      this.file.checkDir(this.file.externalRootDirectory + 'DCIM/', 'MEDSURG PHARMACY').then(response => {
        console.log('Directory exists'+response);
      }).catch(err => {
        console.log('Directory doesn\'t exist'+JSON.stringify(err));
        this.file.createDir(this.file.externalRootDirectory + 'DCIM/', 'MEDSURG PHARMACY', false).then(response => {
          console.log('Directory create'+response);
        }).catch(err => {
          console.log('Directory no create'+JSON.stringify(err));
        }); 
      });
      this.file.checkDir(this.file.externalRootDirectory + 'Pictures/', 'MEDSURG PHARMACY').then(response => {
        console.log('Directory exists'+response);
      }).catch(err => {
        console.log('Directory doesn\'t exist'+JSON.stringify(err));
        this.file.createDir(this.file.externalRootDirectory + 'Pictures/', 'MEDSURG PHARMACY', false).then(response => {
          console.log('Directory create'+response);
        }).catch(err => {
          console.log('Directory no create'+JSON.stringify(err));
        }); 
      });
      this.file.checkDir(this.file.externalRootDirectory + '/', 'MEDSURG PHARMACY').then(response => {
        console.log('Directory exists'+response);
      }).catch(err => {
        console.log('Directory doesn\'t exist'+JSON.stringify(err));
        this.file.createDir(this.file.externalRootDirectory + '/', 'MEDSURG PHARMACY', false).then(response => {
          console.log('Directory create'+response);
        }).catch(err => {
          console.log('Directory no create'+JSON.stringify(err));
        }); 
      });
    
  }
}*/
  


 
}
