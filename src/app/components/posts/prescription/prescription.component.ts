import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController, NavController, NavParams, ActionSheetController } from '@ionic/angular';
import { Prescription } from 'src/app/interfaces/prescriptions';
import { User } from 'src/app/interfaces/user';
import { InteractionService } from '../../../services/interaction.service';
import { Comment } from 'src/app/interfaces/comment';
import { ModalControllers } from 'src/app/classes/modalControllers';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { get } from '@ionic-native/core/decorators/common';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.scss'],
})
export class PrescriptionComponent implements OnInit {



  currentUser: User;
  prescription: Prescription;
  commentToAdd: Comment;
  modalControllers: ModalControllers;
  images: { url: any }[] = [];
  @ViewChild('slides') slides: IonSlides;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    onlyExternal: false
  };
  constructor(private navParam: NavParams,
    private interactionService: InteractionService,
    private modalCntrl: ModalController,
    private actionSheetController: ActionSheetController,
    private base64ToGallery: Base64ToGallery,
    private base64: Base64,
    private androidPermissions: AndroidPermissions,
    private file: File,
    private fileTransfer: FileTransfer) {
    this.modalControllers = new ModalControllers(modalCntrl);
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.currentUser = this.navParam.get('user');
    this.prescription = this.navParam.get('prescription');
    this.initImages();
    this.sortComments();
  }

  initImages() {
    this.prescription.imageUrl.map((imageURL, i) => {
      this.images.push({ url: imageURL });
    })
  }

  ngAfterViewInit() {
    setTimeout(
      () => {
        if (this.slides) {
          this.slides.update();
        }
      }, 300
    );
  }


  checkUserExistInComment(prescription: Prescription) {
    const presc = prescription.comments.filter(comment => this.currentUser._id === comment._id)[0];
    if (presc && presc != null) {
      return true;
    }
    else {
      return false;
    }
  }

  async initCommentToAdd(prescription: string) {
    await Promise.resolve(this.commentToAdd = {
      prescription: prescription,
      _id: null,
      pharmacy: this.currentUser,
      createdAt: new Date().toISOString(),
      status: 'created',
      products: []
    });
    delete this.commentToAdd._id; 
  }

  addComent(prescriptionId: string) {
    this.interactionService.createLoading('Adding Comment ...')
      .then(async () => {
        this.interactionService.hide();
        await this.initCommentToAdd(prescriptionId)
        this.modalControllers.callAddProductToComment(this.currentUser, this.commentToAdd);
      });
  }

  calculateCommentPrice(comment: Comment) {
    let commentPrice = 0;
    comment.products.map(product => {
      commentPrice += product.product.price * product.quantity;
    })
    return commentPrice;
  }

  async sortComments() {
    await this.prescription.comments.sort((a, b) => {
      return this.calculateCommentPrice(a) - this.calculateCommentPrice(b);
    })
  }

  async presentActionSheet(file: string) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      cssClass: 'my-custom-class',
      buttons: [{

        text: 'Save',
        icon: 'cloud-download-outline',
        handler: () => {
          this.downloadFile(file)
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }


  downloadFile(file: string) {

    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
      .then((result) => {
        if (result.hasPermission) {
          this.downloadViaURL(file);
        }
        else {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
            .then((result) => {
              console.log(result.hasPermission);
              if (result.hasPermission) {
                this.downloadViaURL(file);
              } else {
                this.interactionService.createToast('You didnt grant the permission!', 'warrning', 'bottom');
              }
            })
            .catch(err => {
              this.interactionService.createToast('You didnt grant the permission!', 'warrning', 'bottom');

            });
        }
      })
      .catch(err => {
        this.interactionService.createToast('You didnt grant the permission!', 'warrning', 'bottom');

      });;
  }

  downloadViaURL(url) {

    let path = this.file.externalDataDirectory + url.substring(url.lastIndexOf('/') + 1);
    console.log(this.file.externalDataDirectory, path);
    this.file.checkFile(this.file.externalDataDirectory, url.substring(url.lastIndexOf('/') + 1)).then(value => {
    }, reason => {

      console.log('reason : ', JSON.stringify(reason))
      let fileTransferObject = this.fileTransfer.create();

      fileTransferObject.download(url, path, true).then(value => {

        console.log('download : ', JSON.stringify(value));
        console.log(value.nativeURL);
        this.imageToBase64(value.nativeURL);
        this.file.copyFile(this.file.externalDataDirectory, value.name, this.file.externalRootDirectory + 'DCIM/MEDSURG PHARMACY', value.name)
        this.file.moveFile(this.file.externalDataDirectory, value.name, this.file.externalRootDirectory + 'Pictures/MEDSURG PHARMACY', value.name)



      }, rejected => {
        console.log('download rejected : ', JSON.stringify(rejected));
        this.file.removeFile(this.file.externalDataDirectory, url.substring(url.lastIndexOf('/') + 1)).then(value => {
          console.log('removeFile : ', JSON.stringify(value))
        }, reason => {
          console.log('removeFile reason : ', JSON.stringify(reason))

        }).catch(error => {
          console.log('removeFile error : ', JSON.stringify(error))
        })


      }).catch(err => {
        console.log('download error : ', JSON.stringify(err));
      })
    })
  }


  imageToBase64(filePath: string) {
    this.base64.encodeFile(filePath).then((base64File: string) => {
      console.log("base64",base64File);
      this.saveImageToGallery(base64File.split(',')[1])
    }, (err) => {
      console.log(err);
    });
  }

  saveImageToGallery(base64Data){
    this.base64ToGallery.base64ToGallery(base64Data,{prefix: 'pharmacy_',mediaScanner: false}).then(
      res => console.log('Saved image to gallery ', res),
      err => console.log('Error saving image to gallery ', err)
    );
  }








}
