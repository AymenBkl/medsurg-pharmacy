import { Injectable } from '@angular/core';
import { CategoryResponse } from 'src/app/interfaces/categoryResponse';
import { config } from '../config';
import { HttpClient } from '@angular/common/http';
import { ProccessHttpErrosService } from '../proccess-http-erros.service';
import { AuthService } from '../auth.service';
import { Category } from 'src/app/interfaces/category';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {


  categoryUrl = config.baseURL + 'crm/';
  categories: Subject<Category[]> = new Subject<Category[]>();
  allCategories: Category[] = [];
  constructor(private httpClient: HttpClient,
    private proccessHttpErrorService: ProccessHttpErrosService,
    private authService: AuthService) { }


  getAllCategories() {
    return new Promise((resolve, reject) => {
      this.httpClient.get<CategoryResponse>(this.categoryUrl + 'category/allcategory')
        .subscribe(response => {
          console.log(response);
          if (response.status === 200) {
            resolve(response.category);
          }
          else {
            resolve(false);
          }
        }, err => {
          reject(err);
        });
    });
  }
  getCategory(categoryId: string) {
    return new Promise((resolve, reject) => {
      this.httpClient.get<CategoryResponse>(this.categoryUrl + 'category/getcategory/' + categoryId)
        .subscribe(response => {
          console.log(response);
          if (response.status === 200) {
            resolve(response.category);
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
