import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.page.html',
  styleUrls: ['./payment-detail.page.scss'],
})
export class PaymentDetailPage implements OnInit {

  currentUser: User;
  update:boolean= false;
  constructor(private authService: AuthService) { }



  ngOnInit() {
    this.getUser();
  }

  getUser(){
    this.currentUser = this.authService.user;
  }

  paymentDetailAdded($event){
    this.getUser();
    this.update = false;
    console.log(this.update,this.currentUser);
  }

  updatePaymentDetail(){
    this.update = true;
  }

}
