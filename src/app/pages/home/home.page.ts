import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { AndroidPermissions,AndroidPermissionResponse } from '@ionic-native/android-permissions/ngx';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {


 
  currentUser:User;
  constructor(private authService: AuthService,
    private androidPermission: AndroidPermissions,) { }

  ngOnInit() {
    this.checkPermissions();
  }


  getCurrentUser() {
    this.currentUser = this.authService.user;
  }

  ionViewDidEnter(){

    this.getCurrentUser();
    
  }


  checkPermissions() {
    this.androidPermission.checkPermission(this.androidPermission.PERMISSION.WRITE_EXTERNAL_STORAGE)
      .then((result) => {
        if (result.hasPermission) {
          console.log('permision granted');
        }
        else {
          this.androidPermission.requestPermissions([this.androidPermission.PERMISSION.WRITE_EXTERNAL_STORAGE, this.androidPermission.PERMISSION.READ_EXTERNAL_STORAGE,this.androidPermission.PERMISSION.CALL_PHONE]);
        }
      },err => {
        console.log("permission not granted");
        this.androidPermission.requestPermissions([this.androidPermission.PERMISSION.READ_EXTERNAL_STORAGE,
          this.androidPermission.PERMISSION.WRITE_EXTERNAL_STORAGEE,
          this.androidPermission.PERMISSION.ACTION_INSTALL_PACKAGE,this.androidPermission.PERMISSION.CALL_PHONE]);
      });
    this.androidPermission.requestPermissions([this.androidPermission.PERMISSION.READ_EXTERNAL_STORAGE,
      this.androidPermission.PERMISSION.WRITE_EXTERNAL_STORAGEE,
      this.androidPermission.PERMISSION.ACTION_INSTALL_PACKAGE,this.androidPermission.PERMISSION.CALL_PHONE]);
  }
}
