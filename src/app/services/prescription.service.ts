import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comment } from '../interfaces/comment';
import { Prescription } from '../interfaces/prescription';
import { PrescriptionResponse } from '../interfaces/prescriptionResponse';
import { config } from './config';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  prescriptionURL= config.baseURL + "crm/";
  constructor(private httpClient: HttpClient) { }


  getAllPrescriptions() {
    return new Promise((resolve, reject) => {
      this.httpClient.get<PrescriptionResponse>(this.prescriptionURL + 'prescription/allprescription/getallprescriptionpharmacy')
        .subscribe(response => {
          console.log(response);
          if (response.status === 200) {
            resolve(response.prescription);
          }
          else {
            resolve(false);
          }
        }, err => {
          reject(err);
        });
      });
    }

  addComment(comment: Comment){
    return new Promise((resolve, reject) => {
      this.httpClient.post<PrescriptionResponse>(this.prescriptionURL + 'prescription/addcomment',comment)
        .subscribe(response => {
          console.log(response);
          if (response.status === 200) {
            resolve(response.prescription);
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
