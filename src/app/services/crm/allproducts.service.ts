import { Injectable } from '@angular/core';
import { config } from '../config';
import { HttpClient } from '@angular/common/http';
import { ProductResponse } from 'src/app/interfaces/ProductResponse';
import { MainProduct } from 'src/app/interfaces/mainProduct';

@Injectable({
  providedIn: 'root'
})
export class AllproductsService {

  mainProductUrl = config.baseURL + 'crm/productsmanagement/addmainproduct';
  private mainProduct: MainProduct[];

  constructor(private httpClient: HttpClient) { }


  getAllMainProducts() {
    return new Promise((resolve, reject) => {
      this.httpClient.get<ProductResponse>(this.mainProductUrl )
        .subscribe(response => {
          console.log(response);
          if (response.status === 200) {
            // this.onGetallProducts(response.product);
            this.mainProduct = response.product;
            resolve(response.product);
          }
          else {
            resolve(false);
          }
        }, err => {
          reject(err);
        });
      });
  }

  getMainProducts(){
    return new Promise((resolve,reject) => {
      if (!this.mainProduct){
        resolve(this.getAllMainProducts())
      }
      else {
        resolve(this.mainProduct);
      }
    })
    
  }
}
