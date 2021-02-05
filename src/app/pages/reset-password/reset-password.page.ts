import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { InteractionService } from 'src/app/services/interaction.service';
import { MustMatch } from '../register/must-matchValdiator';
import { onValueChanged } from './valueChanges';
import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  resetPasswordForm: FormGroup;
  formErrors: any;
  submitted = false;
  validationErrors: { errmsg, errcode };
  recaptchaVerifier;
  confirmationResult : any;
  verificationNumber : string = '';
  step:string = 'add phoneNumber';
  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private interactionService: InteractionService,
    private modalController: ModalController,
    private angularFireAuth: AngularFireAuth) {
    this.buildResetPasswordForm();
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
      this.recaptchaVerifier = new firebase.default.auth.RecaptchaVerifier('recaptcha-container',{'size' : 'invisible'}); 
  }

  buildResetPasswordForm() {
    this.resetPasswordForm = this.formBuilder.group({
      phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    },
      {
        validators: MustMatch('password', 'confirmPassword')
      });
    this.resetPasswordForm.valueChanges
      .subscribe(resetPassword => {
        this.formErrors = onValueChanged(resetPassword, this.resetPasswordForm);
        console.log(resetPassword);
      });
  }

  resetPassword() {
    this.interactionService.createLoading("Reseting your password !!")
      .then(() => {
        this.submitted = true;
        console.log(this.resetPasswordForm.value.phoneNumber, this.resetPasswordForm.value.password);
        this.authService.resetPassword(this.resetPasswordForm.value.password, this.resetPasswordForm.value.phoneNumber)
          .then((result: any) => {
            this.submitted = false;
            this.interactionService.hide();
            if (result && result !== false) {
              this.interactionService.createToast('PASSOWRD HAS BEEN RESET', 'success', 'bottom');
              this.modalController.dismiss(
                { success: true, 
                newPassword: this.resetPasswordForm.value.password, 
                phoneNumber: this.resetPasswordForm.value.phoneNumber 
              })
            }
            else {
              this.interactionService.createToast('Something Went Wrong ! Try Again', 'danger', 'bottom');
              this.submitted = false;
            }
          })
          .catch(err => {
            this.submitted = false;
            this.validationErrors = err;
            this.interactionService.hide();
            this.interactionService.createToast(this.validationErrors.errmsg, 'danger', 'bottom')
              .then(() => {
              });
          });
      })

  }


  sendToPhone() {
    this.submitted = true;
    this.interactionService.createLoading("Sending Code")
      .then(() => {
        console.log(this.resetPasswordForm.value.phoneNumber);
        this.authService.verifyPhoneNumber(this.resetPasswordForm.value.phoneNumber,this.recaptchaVerifier)
        .then(result => {
          this.interactionService.hide();
          this.submitted = false;
          console.log("otp",result);
          if (result){
            this.confirmationResult = result;
            this.step = 'confirm OTP';
            this.interactionService.createToast('CODE HAS BEEN SENT', 'success', 'bottom');
          }
          else {
            this.interactionService.createToast('Something Went Wrong ! Try Again', 'danger', 'bottom');
          }
        })
        .catch(err => {
          this.submitted = false;
          console.log(err);
          this.interactionService.hide();
          this.interactionService.createToast('Something Went Wrong ! Try Again', 'danger', 'bottom');
        })
      })
  }

  confirmOTP() {
    this.submitted = true;
    this.interactionService.createLoading("Confirming OTP")
      .then(() => {
        this.authService.verifyOTP(this.confirmationResult,this.verificationNumber)
        .then(result => {
          this.submitted = false;
          this.interactionService.hide();
          if (result && result == true){
            this.step = 'reset-password';
            this.interactionService.createToast('OTP VERIFIED', 'success', 'bottom');
          }
          else {
            this.interactionService.createToast('Enter A Valid Number ! Try Again', 'danger', 'bottom');
          }
        })
        .catch(err => {
          this.submitted = false;
          this.interactionService.hide();
          this.interactionService.createToast('Enter A Valid Number ! Try Again', 'danger', 'bottom');
        })
      })
    
  }

  back(step: string){
    this.step = step;
  }


  numberOnlyValidation(event: any) {
    const pattern = /[0-9.,]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }


}
