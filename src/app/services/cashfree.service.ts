import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from './config';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root',
})
export class CashfreeService {

  constructor(private http: HTTP) { 
  }



  paymentStatus(orderId: string) {
    return new Promise((resolve,reject) => {
      let option = {
        appId:config.cashfree.appId,
        secretKey:config.cashfree.appKey,
        orderId:orderId,
      }
        this.http.post('https://test.cashfree.com/api/v1/order/info/status',option,{'Content-Type': 'application/x-www-form-urlencoded'})
          .then(data => {
            resolve(JSON.parse(data.data))
          },err => {
            reject(err);
          })
      })
  }

  
  
}
