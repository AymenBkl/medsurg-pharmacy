import { Component, Input, OnInit } from '@angular/core';
import { NavParams, ModalController, ActionSheetController } from '@ionic/angular';
import { Category } from 'src/app/interfaces/category';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { onValueChanged } from './valueChanges';
import { ProductService } from '../../../services/crm/product.service';
import { InteractionService } from '../../../services/interaction.service';
import { Router } from '@angular/router';
import { Product } from 'src/app/interfaces/product';
import { User } from 'src/app/interfaces/user';
import { CameraUploadService } from 'src/app/services/plugin/camera-upload.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent implements OnInit {
  @Input('type') type: string;

  currentProduct: Product;
  productForm: FormGroup;
  formErrors: any;
  image: any;
  toggle = false;
  submitted = false;

  @Input('mainProduct') mainProduct: Product;

  @Input('currentProduct') currentProduct1: Product;

  @Input('user') user: User;

  constructor(private navParams: NavParams,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private interactionService: InteractionService,
    private modalCntrl: ModalController,
    private cameraService: CameraUploadService,
    private actionSheetController: ActionSheetController,
    private router: Router) { }

  ngOnInit() {
    this.getProduct();
  }

  buildReactiveForm() {
    this.productForm = this.formBuilder.group({
      description: [''],
      price: [this.currentProduct.price, [Validators.required]],
    });

    this.productForm.valueChanges
      .subscribe(user => {
        this.formErrors = onValueChanged(user, this.productForm);
        console.log(this.formErrors);
      });
  }


  getProduct() {
    if (this.currentProduct1 != null) {
      this.currentProduct = this.currentProduct1;
    }
    else {
      this.currentProduct = this.navParams.get('product');
      this.mainProduct = this.navParams.get('product').mainProduct;
    }
    this.buildReactiveForm();
  }

  update() {
    this.submitted = true;
    this.interactionService.createLoading('Updating your information')
      .then(() => {
        this.productService.updateProduct(this.productForm.value, this.currentProduct._id)
          .then((result: any) => {
            this.interactionService.hide();
            this.submitted = false;
            if (result && result !== false) {
              this.currentProduct = result;
              this.interactionService.createToast('Your Information Has Been Updated', 'success', 'bottom');
            }
            else {
              this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
            }
          })
          .catch(err => {
            this.submitted = false;
            this.interactionService.hide();
            this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
          });
      });
  }

  selectedImage(file) {
    if (this.isFileImage(file)){
    this.interactionService.createLoading('Updating Your image !!')
      .then(() => {
        const formData = new FormData();
        formData.append('file', file);
        this.productService.postImage(formData, this.currentProduct._id)
          .then((result: any) => {
            this.interactionService.hide();
            if (result && result !== false) {
              this.interactionService.createToast('Your image updated', 'success', 'bottom');
              this.currentProduct.imageUrl = result;
            }
            else {
              this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
            }
          });
      }).catch(err => {
        this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
      });
    }
    else {
      this.interactionService.createToast('You must select an image !', 'danger', 'bottom');
    }
  }

  isFileImage(file) {
    const acceptedImageTypes = ['image/jpeg', 'image/png'];
  
    return file && acceptedImageTypes.includes(file['type'])
  }

  deleteProduct() {
    this.interactionService.alertWithHandler('Do you want to delete this Product !', 'Alert', 'CANCEL', 'DELETE')
      .then((result) => {
        if (result == true) {
          this.interactionService.createLoading('Deleting Product Please Wait !')
            .then(() => {
              this.productService.deleteProduct(this.currentProduct._id)
                .then(result => {
                  this.interactionService.hide();
                  if (result && result === true) {
                    this.interactionService.createToast('Product Deleted !', 'success', 'bottom');
                    this.modalCntrl.dismiss();
                  }
                  else {
                    this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
                  }
                  
                })
                .catch(err => {
                  this.interactionService.hide();
                  this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
                  console.log(err);
                });
            })

        }

      });
  }


  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      cssClass: 'my-custom-class',
      buttons: [{

        text: 'Open Camera',
        icon: 'camera-outline',
        handler: () => {
          this.getPhoto( 'camera')
        }
      },
      {

        text: 'Open Gallery',
        icon: 'image-outline',
        handler: () => {
          this.getPhoto('gallery')
        }
      },
      {
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

  getPhoto(type: string) {
    this.cameraService.uploadPhotoGallery(type)
      .then((result: any) => {
        console.log(JSON.stringify(result.url));
        console.log("file", result.file);
        if (result && result != null) {
          console.log("check", result.url != '' && result.file != '');
          if (result === 'not image') {
            this.interactionService.createToast('TOAST_IMAGE_ERROR', 'danger', 'bottom');
          }
          else if (result.url != '' && result.file != '') {
            this.selectedImage(result.file);
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

}


