import { Injectable } from '@angular/core';
import { ProductResponse } from 'src/app/interfaces/ProductResponse';
import { config } from '../config';
import { HttpClient } from '@angular/common/http';
import { ProccessHttpErrosService } from '../proccess-http-erros.service';
import { AuthService } from '../auth.service';
import { Subject } from 'rxjs';
import { Product } from 'src/app/interfaces/product';
import { CategoryService } from '../../services/crm/category.service';
@Injectable({
  providedIn: 'root'
})
export class ProductService {


  productUrl = config.baseURL + 'crm/';
  products: Subject<Product[]> = new Subject<Product[]>();
  allProducts: Product[];
  categoryIds: {category: string}[];
  constructor(private httpClient: HttpClient,
              private proccessHttpErrorService: ProccessHttpErrosService,
              private authService: AuthService,
              private categoryService: CategoryService) {
              }

  getallProducts(mainProductId,pharmacyId) {
    return new Promise((resolve, reject) => {
      this.httpClient.get<ProductResponse>(this.productUrl + 'products/allproduct/' + mainProductId + "/pharmacy/" + pharmacyId)
        .subscribe(response => {
          console.log(response);
          if (response.status === 200) {
            // this.onGetallProducts(response.product);
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

  updateProduct(product, productId) {
    return new Promise((resolve, reject) => {
      this.httpClient.put<ProductResponse>(this.productUrl + 'products/updateproduct/' + productId , product)
        .subscribe(response => {
          if (response.status === 200) {
            // this.productsAdded(response.product);
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

  addProduct(product: Product, mainproductId){
    return new Promise((resolve, reject) => {
      this.httpClient.post<ProductResponse>(this.productUrl + 'products/addproduct/' + mainproductId, product)
        .subscribe(response => {
          if (response.status === 200) {
            // this.productsAdded(response.product);
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
  postImage(formData: FormData, productId) {

    return new Promise((resolve, reject) => {
    this.httpClient.post<ProductResponse>(this.productUrl + 'productsfiles/addimage/' + productId, formData)
      .subscribe(response => {
        if (response.status === 200) {
          resolve(response.product.imageUrl);
        }
        else {
          resolve(false);
        }
      }, err => {
        reject(err);
      });
    });
  }

  deleteProduct(productId) {
    return new Promise(( resolve, reject) => {
      this.httpClient.delete<ProductResponse>(this.productUrl + 'products/deleteproduct/' + productId)
      .subscribe(response => {
        console.log(response.status);
        if (response.status === 200){
          // this.productDeleted(productId);
          resolve(true);
        }
        else {
          resolve(false);
        }
      }, err => {
        reject(this.proccessHttpErrorService.handleError(err));
      });
    });
  }

  

  getAllProducts(pharmacyId){
    return new Promise(( resolve, reject) => {
        this.httpClient.post<ProductResponse>(this.productUrl + 'productsmanagement/allproducts', {pharmacyId : pharmacyId})
      .subscribe(response => {
        if (response.status === 200){
          resolve(response.product);
        }
        else {
          resolve(false);
        }
      }, err => {
        reject(this.proccessHttpErrorService.handleError(err));
      });
      });
  }

  onGetallProducts(categories: Product[]){
    this.allProducts = categories;
    this.notifyCategories();
  }

  productsAdded(product: Product) {
    this.allProducts.push(product);
    this.notifyCategories();
  }

  productDeleted(ProductId) {
    const deleteProduct = this.allProducts
    .find(currentProduct => {
      return currentProduct._id === ProductId;
    });
    this.allProducts.splice(this.allProducts.indexOf(deleteProduct), 1);
    this.notifyCategories();
  }

  productsUpdated(product: Product) {
    const updatedProduct = this.allProducts
    .find(currentProduct => {
      return currentProduct._id === product._id;
    });
    this.allProducts[this.allProducts.indexOf(updatedProduct)] = product;
    this.notifyCategories();
  }

  notifyCategories() {
    this.products.next(this.allProducts);
    return this.products;
  }
}
