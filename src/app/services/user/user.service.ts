import { Injectable } from '@angular/core';
import { config } from '../config';
import { HttpClient } from '@angular/common/http';
import { AuthResponse } from '../../interfaces/response';
import { ProccessHttpErrosService } from '../proccess-http-erros.service';
import { AuthService } from '../auth.service';
import { PaymentDetail } from 'src/app/interfaces/paymentDetail';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  userUrl = config.baseURL + 'account/user/';
  constructor(private httpClient: HttpClient,
              private proccessHttpErrorService: ProccessHttpErrosService,
              private authService: AuthService) {
              }


  public getUser(userId: any) {
    return new Promise((resolve, reject) => {
      this.httpClient.get<AuthResponse>(this.userUrl + userId)
        .subscribe(response => {
          if (response.status === 200) {
            this.authService.userUpdated(response.user);
            resolve(response.user);
          }
          else {
            resolve(false);
          }
        }, err => {
          reject(this.proccessHttpErrorService.handleError(err));
        });
    });
  }

  getImage(imageUrl){
    return new Promise((resolve, reject) => {
      this.httpClient.get<AuthResponse>(config.baseURL + 'account/files/getfile/' + imageUrl)
        .subscribe(response => {
          if (response.status === 200) {
            resolve(response.msg);
          }
          else {
            resolve(false);
          }
        }, err => {
          reject(this.proccessHttpErrorService.handleError(err));
        });
    });
  }

  postImage(formData: FormData) {
    return new Promise((resolve, reject) => {
    this.httpClient.post<AuthResponse>(this.userUrl + 'image', formData)
      .subscribe(response => {
        if (response.status === 200) {
          console.log(response.user);
          this.authService.userUpdated(response.user);
          resolve(response.user.imageUrl);
        }
        else {
          resolve(false);
        }
      }, err => {
        reject(err);
      });
    });
  }

  updateUser(newInfo) {
    return new Promise((resolve, reject) => {
      this.httpClient.put<AuthResponse>(this.userUrl + 'updateuser', newInfo)
        .subscribe(response => {
          if (response.status === 200){
            this.authService.userUpdated(response.user);
            resolve(response.user);
          }
          else {
            resolve(false);
          }
        }, err => {
          reject(err);
        });
    });
  }

  sendVerificationEmail(emails, types , newEmail){
    return new Promise((resolve, reject) => {
      this.httpClient.post<AuthResponse>(this.userUrl + 'sendemail', {email: emails , type : types , emailNew : newEmail})
        .subscribe(response => {
          if (response.status === 200){
            resolve(true);
          }
          else {
            resolve(false);
          }
        }, err => {
          reject(err);
        });
    });
  }

  verifyEmail(code, emails ){
    return new Promise((resolve, reject) => {
      this.httpClient.post<AuthResponse>(this.userUrl + 'verify', {currenctCode : code, email: emails})
        .subscribe(response => {
          if (response.status === 200){
            resolve(true);
          }
          else if (response.status === 422){
            resolve(false);
          }
          else {
            resolve(false);
          }
        }, err => {
          if (err.status === 422) {
            resolve(false);
          }
          else {
            reject(err);
          }
        });
    });
  }

  addPaymentDetail(paymentDetail: PaymentDetail) {
    return new Promise((resolve, reject) => {
      this.httpClient.post<AuthResponse>(this.userUrl + 'addpaymentdetail',{paymentDetail: paymentDetail})
        .subscribe(response => {
          if (response.status === 200){
            this.authService.userUpdated(response.user);
            resolve(response.user);
          }
          else {
            resolve(false);
          }
        }, err => {
          reject(err);
        });
    });
  }

  updatePaymentDetail(paymentDetail: PaymentDetail,paymentId:string){
    return new Promise((resolve, reject) => {
      this.httpClient.put<AuthResponse>(this.userUrl + 'updatepaymentdetail/' + paymentId, {paymentDetail: paymentDetail})
        .subscribe((response:any) => {
          if (response.status === 200){
            console.log(response)
            this.authService.paymentUpdated(response.user);
            resolve(response.user);
          }
          else {
            resolve(false);
          }
        }, err => {
          reject(err);
        });
    });
  }
}
