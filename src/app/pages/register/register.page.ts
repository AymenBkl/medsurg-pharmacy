import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { User } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';
import { MustMatch } from './must-matchValdiator';
import { onValueChanged } from './valueChanges';
import { InteractionService } from '../../services/interaction.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;
  formErrors: any;
  submitted = false;
  validationErrors: {errmsg , errcode};
  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private interactionService: InteractionService,
              private router: Router,
              private modalController: ModalController) {
    this.buildReactiveForm();
  }

  ngOnInit() {
  }


  buildReactiveForm() {
    this.registerForm = this.formBuilder.group({
      firstname : ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      lastname : ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      phoneNumber : ['', [Validators.required, Validators.minLength(10),Validators.maxLength(10)]],
      password : ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword : ['', [Validators.required, Validators.minLength(6)]],
      role : 'pharmacy',
    },
    {
      validators : MustMatch('password', 'confirmPassword')
    });
    this.registerForm.valueChanges
      .subscribe(user => {
        this.formErrors = onValueChanged(user, this.registerForm);
        console.log(this.formErrors);
      });
  }
  register() {
    this.submitted = true;
    this.authService.signUp(this.registerForm.value)
      .then(result => {
        if (result && result !== false){
          this.submitted = false;
          this.interactionService.createToast('WELCOMU', 'success', 'bottom');
          this.goToHome();
        } else {
          this.interactionService.createToast('Something Went Wrong ! Try Again', 'danger', 'bottom');
          this.submitted = false;
        }
      })
      .catch(err => {
        console.log(err);
        this.submitted = false;
        this.validationErrors = err;
        this.interactionService.createToast(this.validationErrors.errmsg, 'danger', 'bottom');
      });
  }

  callEmailVerification(){
    this.interactionService.alertWithHandler('Do you want to confirm your email', 'EMAIL CONFIRMATION', 'NO', 'CONFIRM')
      .then(action => {
        if (action && action === true){
          // this.callVerificationPage();
        }
        else {
          this.goToHome();
        }
      });
  }

  goToHome(){
    this.interactionService.createLoading('Please wait ! ...');
    this.router.navigate(['/home']);
    setTimeout(() => {
        this.interactionService.hide();
    }, 3000);
  }

  ionViewDidEnter() {
    this.submitted = false;
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
