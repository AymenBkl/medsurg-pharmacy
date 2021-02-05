import { Injectable } from '@angular/core';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { observable, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {
  presentingLoadingController: HTMLIonLoadingElement;
  constructor(private toastController: ToastController,
    private loadingController: LoadingController,
    private alertController: AlertController) { }

  async createToast(msg, clr, pos) {
    const toast = await this.toastController.create({
      message: msg,
      color: clr,
      position: pos,
      duration: 1500,
      animated: true,
      cssClass: 'toast-customize',
    });
    return await toast.present();
  }

  async createLoading(msg?) {
    return new Promise((resolve, reject) => {
      console.log(this.presentingLoadingController);
      if (!this.presentingLoadingController) {
        this.loadingController.create({
          message: msg,
          cssClass: 'loading-customize',
          duration: 100000,
          spinner: 'circles'
        }).then((loading) => {
          this.presentingLoadingController = loading;
          this.presentingLoadingController.present()
          .then(() => {
            resolve(true);
          });
        });
      }
    });
  }

  async hide() {
    if (this.presentingLoadingController) {
      this.presentingLoadingController.dismiss();
      this.presentingLoadingController = null;
    }
    this.presentingLoadingController = null;
  }

  alertWithHandler(msg, hdr, cancelBtn, confirmBtn) {
    return new Promise((resolve, reject) => {
      this.alertController.create({
        header: hdr,
        message: msg,
        animated: true,
        buttons: [
          {
            text: cancelBtn,
            role: 'cancel',
            handler: () => {
              resolve(false);
            }
          },
          {
            text: confirmBtn,
            cssClass: 'danger',
            handler: () => {
              resolve(true);
            }
          }
        ]
      }).
        then((alert) => {
          alert.present();
        });
    });
  }
}
