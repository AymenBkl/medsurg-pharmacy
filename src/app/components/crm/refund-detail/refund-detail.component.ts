import { Component, OnInit } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { ModalController, NavParams } from '@ionic/angular';
import { ModalControllersOrders } from 'src/app/classes/modalController.orders';
import { Order } from 'src/app/interfaces/order';
import { User } from 'src/app/interfaces/user';
import { CashfreeService } from 'src/app/services/cashfree.service';
import { OrderService } from 'src/app/services/crm/order.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-refund-detail',
  templateUrl: './refund-detail.component.html',
  styleUrls: ['./refund-detail.component.scss'],
})
export class RefundDetailComponent implements OnInit {

  order: Order;
  currentUser: User;
  constructor(private navParams: NavParams,
              private orderService: OrderService,
              private interactionService: InteractionService,
              private androidPermission: AndroidPermissions,
              private callNumber: CallNumber) {
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.order = this.navParams.get('order');
    this.currentUser = this.navParams.get('user');
    }

  getProductNames() {
    var productNames: string[] = [];
    this.order.products.map(product => {
      productNames.push(product.product.mainProduct.name + '\n');
    })
    return productNames;
  }

  ionViewDidEnter() {
    this.getData();
  }

  pickUp(){
    this.orderService.payPickUp(this.order._id,this.order.refund.refund._id)
      .then((result) => {
        if (result && result != false){
          this.interactionService.createToast('Your Order Has been Updated !', 'success', 'bottom');
        }
        else {
          this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
        }
      })
      .catch(err => {
        this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
      })
  }

  callPatient(phoneNumber: String) {
    this.androidPermission.checkPermission(this.androidPermission.PERMISSION.CALL_PHONE)
      .then((result) => {
        if (result.hasPermission) {
          this.callNumber.callNumber("+91" + phoneNumber, true)
            .then(res => console.log('Launched dialer!', res))
            .catch(err => console.log('Error launching dialer', err));
        }
        else {
          console.log("request permission")
          this.androidPermission.requestPermission(this.androidPermission.PERMISSION.CALL_PHONE)
            .then((result) => {
              if (result.hasPermission) {
                this.callNumber.callNumber("+91" + phoneNumber, true)
                  .then(res => console.log('Launched dialer!', res))
                  .catch(err => console.log('Error launching dialer', err));
              } else {
              }
            })
            .catch(err => {
              console.log("errPermission", JSON.stringify(err));
            });
        }
      })
      .catch(err => {
        console.log("errPermission", JSON.stringify(err));
      });
  }



}
