import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProccessHttpErrosService {

  constructor() { }

  public handleError(error: HttpErrorResponse | any) {
    console.log(error);
    let errMsg: string;
    let errCode = 0;
    if (error.error && error.error instanceof ErrorEvent) {

    } else if (error.error && error.error.err && error.error.err.message === 'User validation failed: email: Email already exists' ){
      errMsg = `Email already exists`;
      errCode = 0;
    }
    else if (error.error && error.error.err && error.error.err.message === 'User validation failed: phoneNumber: Phone already exists' ){
      errMsg = `Phone Number already exists`;
      errCode = 12;
    }

    else if (error.error && error.error.err && error.error.err.message === 'User validation failed: phoneNumber: Phone already exists, email: Email already exists' ){
      errMsg = `Exists`;
      errCode = 13;
    }
    else if (error.error && error.error.err && error.error.err.message === 'A user with the given username is already registered'){
      errMsg = `Username is already registered`;
      errCode = 1;
    }
    else if (error.error && error.error.err && error.error.err.message === 'Password or username is incorrect'){
      errMsg = `Password or username is incorrect`;
      errCode = 2;
    }
    else if (error.error && error.error.err === 'USER NOT FOUND'){
      errCode = 3;
      errMsg = 'USER NOT FOUND';
    }
    else if (error.error && error.error.err && error.error.err.code === 11000) {
      errCode = 20;
      errMsg = 'Account Already exist';
    }
    else if (error.error && error.error.err && error.error.err.codeName === 'DuplicateKey'){
      errCode = 4;
      errMsg = 'Facebook Already exist';
    }
    else if (error.error && error.err === 'RECORD NOT FOUND'){
      errCode = 5;
      errMsg = 'Facebook Already Deleted Or not found';
    }
    else {
      errCode = 10;
      errMsg = 'Something Went Wrong !';
    }
    return {errmsg : errMsg, errcode : errCode};
  }
}
