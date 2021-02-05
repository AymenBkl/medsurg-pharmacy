import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { onValueChanged } from './valueChanges';
import { AuthService } from '../../services/auth.service';
import { InteractionService } from '../../services/interaction.service';
import { Router} from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  formErrors: any;
  submitted = false;
  validationErrors: {errmsg , errcode};
  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private interactionService: InteractionService,
              private router: Router,
              private modalController: ModalController) {
    this.buildLoginForm();
  }

  ngOnInit() {
  }

  buildLoginForm() {
    this.loginForm = this.formBuilder.group({
      phoneNumber : ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      password : ['', [Validators.required, Validators.minLength(6)]],
      remember : false
    });
    this.loginForm.valueChanges
      .subscribe(user => {
        this.formErrors = onValueChanged(user, this.loginForm);
        console.log(user);
      });
  }

  logIn() {
    this.submitted = true;
    this.authService.logIn(this.loginForm.value)
      .then((result: any) => {
        console.log(result);
        if (result && result !== false){
          this.interactionService.createToast('WELCOM', 'success', 'bottom');
          console.log(result);
          if (result.emailVerified === false || result.emailVerified == null){
            this.goToHome();
          }
          else {
            this.goToHome();
          }
        }
        else {
          this.interactionService.createToast('Something Went Wrong ! Try Again', 'danger', 'bottom');
          this.submitted = false;
        }
      })
      .catch(err => {
        console.log(err);
        this.submitted = false;
        this.validationErrors = err;
        this.interactionService.createToast(this.validationErrors.errmsg, 'danger', 'bottom')
          .then(() => {
          });
      });
  }


  callEmailVerification(user){
    this.interactionService.alertWithHandler('Do you want to confirm your email', 'EMAIL CONFIRMATION', 'NO', 'CONFIRM')
      .then(action => {
        if (action && action === true){
          // this.callVerificationPage(user);
        }
        else {
          this.goToHome();
        }
      });
  }


  goToHome(){
    this.interactionService.createLoading('please wait ! ...');
    this.router.navigate(['/home']);
    setTimeout(() => {
        this.interactionService.hide();
    }, 3000);
  }

  ionViewDidEnter() {
    this.submitted = false;
  }


}
