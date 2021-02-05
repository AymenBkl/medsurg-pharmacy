import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentDetail } from 'src/app/interfaces/paymentDetail';
import { InteractionService } from 'src/app/services/interaction.service';
import { UserService } from 'src/app/services/user/user.service';
import { onValueChanged } from './valueChanges';

@Component({
  selector: 'app-payment-detail-component',
  templateUrl: './payment-detail.component.html',
  styleUrls: ['./payment-detail.component.scss'],
})
export class PaymentDetailComponent implements OnInit {

  paymentForm: FormGroup;
  formErrors: any;
  submitted = false;
  @Output() paymentDetailAdded: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('paymentDetail') paymentDetail: PaymentDetail;
  update:boolean = false;
  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private interactionService:InteractionService) { }

  ngOnInit() {
    this.buildReactiveForm();
  }



  buildReactiveForm() {
    if (this.paymentDetail == null){
      this.update = false;
      this.paymentForm = this.formBuilder.group({
        bankAccountNumber : ['', [Validators.required, Validators.minLength(4)]],
        IFSCCODE : ['', [Validators.required, Validators.minLength(4)]],
        ACCOUNTHOLDERNAME : ['',[Validators.required,Validators.minLength(4)]],
      });
    }
    else {
      this.update = true;
      this.paymentForm = this.formBuilder.group({
        bankAccountNumber : [this.paymentDetail.bankAccountNumber, [Validators.required, Validators.minLength(4)]],
        IFSCCODE : [this.paymentDetail.IFSCCODE, [Validators.required, Validators.minLength(4)]],
        ACCOUNTHOLDERNAME : [this.paymentDetail.ACCOUNTHOLDERNAME,[Validators.required,Validators.minLength(4)]],
      });
    }
    
    this.paymentForm.valueChanges
      .subscribe(address => {
        this.formErrors = onValueChanged(address, this.paymentForm);
        console.log(this.formErrors);
      });
  }


  addPaymentDetail() {
    if (!this.update){
      this.submitted = true;
      this.userService.addPaymentDetail(this.paymentForm.value)
        .then((result: any) => {
          this.submitted = false;
          if (result && result != false){
            this.interactionService.createToast("PaymentDetail Has Been Added Succesfully", 'success', "bottom");
            this.back();
          }
          else {
            this.interactionService.createToast("Something Went Wrong !", 'danger', "bottom");
          }
        })
        .catch(err => {
          this.submitted = false;
          this.interactionService.createToast("Something Went Wrong !", 'danger', "bottom");
        })
    }
  }

  updatePaymentDetail(){
    if (this.update){
      this.submitted = true;
      this.userService.updatePaymentDetail(this.paymentForm.value,this.paymentDetail._id)
        .then((result: any) => {
          this.submitted = false;
          if (result && result != false){
            this.interactionService.createToast("PaymentDetail Has Been Updated Succesfully", 'success', "bottom");
            this.back();
          }
          else {
            this.interactionService.createToast("Something Went Wrong !", 'danger', "bottom");
          }
        })
        .catch(err => {
          this.submitted = false;
          this.interactionService.createToast("Something Went Wrong !", 'danger', "bottom");
        })
    }
  }

  back(){
    this.paymentDetailAdded.emit(false);
  }

}
