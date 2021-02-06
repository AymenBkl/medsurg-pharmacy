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
import { HTTP } from '@ionic-native/http/ngx';

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
    private androidPermissions: AndroidPermissions,
    private file: File,
    private fileTransfer: FileTransfer,
    private nativeHTTP:HTTP) {
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
          this.downloadFile(file);
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
          this.downloadFileAndStore(file);
        }
        else {
          this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE, this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,this.androidPermissions.PERMISSION.ACTION_INSTALL_PACKAGE])
            .then((result) => {
              if (result.hasPermission) {
                this.downloadFileAndStore(file);
              } else {
              }});
        }
      });

  }


    private downloadFileAndStore(url: string) {
    
      const filePath = this.file.dataDirectory + url.split('/')[3]; 
                       // for iOS use this.file.documentsDirectory
      
      this.nativeHTTP.downloadFile(url, {}, {}, filePath).then(response => {
         // prints 200
         console.log('success block...', response);
      }).catch(err => {
          // prints 403
          console.log('error block ... ', err.status);
          // prints Permission denied
          console.log('error block ... ', err.error);
      })
   }

   



}
