import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ModalControllersOrders } from 'src/app/classes/modalController.orders';
import { Commission } from 'src/app/interfaces/commission';
import { Order } from 'src/app/interfaces/order';
import { User } from 'src/app/interfaces/user';
import { OrderService } from 'src/app/services/crm/order.service';
import { InteractionService } from 'src/app/services/interaction.service';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {

  order: Order;
  currentUser: User;
  orderStatus: string = '';
  modalControllerOder: ModalControllersOrders;
  commission: Commission;
  constructor(private navParams: NavParams,
    private modalCntrl: ModalController,
    private orderService: OrderService,
    private interactionService: InteractionService,
    private callNumber: CallNumber,
    private androidPermission: AndroidPermissions) {
    this.modalControllerOder = new ModalControllersOrders(modalCntrl);
  }

  ngOnInit() {
  }

  getData() {
    this.order = this.navParams.get('order');
    this.currentUser = this.navParams.get('user');
    console.log(this.order);
    if (this.order.refund && this.order.refund.refund) {
      this.order.totalPrice -= this.order.refund.refund.refundPrice;
    }
  }

  goAddPrescription() {
  }

  getProductNames() {
    var productNames: string[] = [];
    this.order.products.map(product => {
      productNames.push(product.product.mainProduct.name + '\n');
    })
    return productNames;
  }

  statusChanged(event) {
    this.orderStatus = event.detail.value;
  }


  updateOrder() {
    this.interactionService.createLoading('Updating your order status ! Please Wait')
      .then(() => {
        this.orderService.editOrder(this.order._id, this.orderStatus)
          .then((result: any) => {
            this.interactionService.hide();
            if (result && result != false) {
              this.interactionService.createToast('Your Order Has been Updated !', 'success', 'bottom');
              setTimeout(() => {
                this.modalCntrl.dismiss(null);
              }, 1500);
            }
            else {
              this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
            }
          })
          .catch(err => {
            this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
          })
      })
  }

  checkStatus() {
    if (this.order.status == 'accepted') {
      this.orderStatus = "delivered";
      this.updateOrder();
    }
    else if (this.order.status == 'created') {
      this.updateOrder();
    }
    else if (this.order.status == 'rejected' || this.order.status == 'rejected' || this.order.status == 'rejected') {

    }
  }

  callRefundDetail() {
    this.modalControllerOder.callRefundDetail(this.currentUser, this.order);
  }

  ionViewDidEnter() {
    this.getPayPharmacyCommission();
    this.getData();
  }

  getPayPharmacyCommission() {
    this.orderService.getCommision()
      .then((result: Commission[]) => {
        this.commission = result.filter(commission => { return commission.name == 'Pay Pharmacy' })[0];
      })
  }

  pickUp() {
    this.orderService.payPickUp(this.order._id, this.order.refund.refund._id)
      .then((result) => {
        if (result && result != false) {
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



