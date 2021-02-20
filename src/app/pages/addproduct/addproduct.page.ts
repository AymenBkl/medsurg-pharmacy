import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, IonSlides } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
import { AuthService } from '../../services/auth.service';
import { InteractionService } from '../../services/interaction.service';
import { ProductService } from '../../services/crm/product.service';
import { Product } from 'src/app/interfaces/product';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { onValueChanged } from './valueChanges';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AllproductsService } from 'src/app/services/crm/allproducts.service';
import { CameraUploadService } from 'src/app/services/plugin/camera-upload.service';
@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.page.html',
  styleUrls: ['./addproduct.page.scss'],
})
export class AddproductPage implements OnInit {

  @ViewChild('slides') slides: IonSlides;

  user: User;
  currentSlide = 0;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    onlyExternal: false
  };
  currentProduct: Product = null;
  productForm: FormGroup;
  formErrors: any;
  submitted = false;
  subscription: Subject<User>;
  allMainProduct: Product[];
  selectedProduct: Product;
  constructor(private authService: AuthService,
    private intercationService: InteractionService,
    private mainProductService: AllproductsService,
    private formBuilder: FormBuilder,
    private navCntrl: NavController,
    private productService: ProductService,
    private cameraService: CameraUploadService,
    private actionSheetController: ActionSheetController,
    private activeRouter: ActivatedRoute) { }

  ngOnInit() {
    this.user = this.authService.user;
    this.getCurrentRouter();
  }

  ngAfterViewInit() {
    setTimeout(
      () => {
        if (this.slides) {
          this.slides.update();
        }
      }, 1000
    );
  }

  ionViewDidEnter() {
    setTimeout(
      () => {
        if (this.slides) {
          this.slides.update();
        }
      }, 1000
    );
  }



  getCurrentRouter() {
    const mainProduct = JSON.parse(this.activeRouter.snapshot.paramMap.get('mainproduct'));
    if (mainProduct && mainProduct != null) {
      this.selectedProduct = mainProduct;
      this.getProducts();
    }
    else {
      this.getAllProducts();
    }
  }

  buildReactiveForm() {
    if (this.currentProduct) {
      console.log("what");
      this.productForm = this.formBuilder.group({
        description: [this.currentProduct.description],
        price: [this.currentProduct.price, [Validators.required]],
        pharmacy: [this.authService.user._id, [Validators.required]]
      });
    }
    else {
      console.log("heeere");
      this.productForm = this.formBuilder.group({
        description: [''],
        price: ['', [Validators.required]],
        pharmacy: [this.authService.user._id, [Validators.required]]
      });
    }

    this.productForm.valueChanges
      .subscribe(user => {
        this.formErrors = onValueChanged(user, this.productForm);
        console.log(this.formErrors);
      });
  }

  next() {
    this.slides.getActiveIndex()
      .then(index => {
        this.currentSlide = index + 1;
        this.slides.slideNext();
      });
  }

  start() {
    this.slides.getActiveIndex()
      .then(index => {
        this.currentSlide = index + 1;
        this.slides.slideNext();
      });
  }

  prev() {
    this.slides.getActiveIndex()
      .then(index => {
        this.currentSlide = index - 1;
        this.slides.slidePrev();
      });
  }


  finish() {
    if (this.currentProduct.imageUrl === '') {
      this.intercationService.alertWithHandler('You didnt select an image !', 'Alert', 'STAY', 'SELECT LATAR')
        .then(() => {
          this.navigateBack();
        });
    }
    else {
      this.navigateBack();
    }
  }

  getAllProducts() {
    this.intercationService.createLoading('Loading Please Wait !')
      .then(() => {
        this.mainProductService.getAllMainProducts()
          .then((result: any) => {
            this.intercationService.hide();
            if (result && result !== false) {
              this.allMainProduct = result;
            }
            else {
              this.intercationService.createToast('Error', 'danger', 'bottom');
            }
          })
          .catch(err => {
            this.intercationService.hide();
            this.intercationService.createToast('Error', 'danger', 'bottom');
          });
      });
  }
  mainProductChange($event) {
    this.selectedProduct = $event.target.value;
  }
  addProduct() {
    this.submitted = true;
    this.intercationService.createLoading('Adding mainProduct !!')
      .then(() => {
        this.productService.addProduct(this.productForm.value, this.selectedProduct._id)
          .then((result: any) => {
            this.submitted = false;
            this.intercationService.hide();
            if (result && result !== false) {
              this.intercationService.createToast('Your mainProduct added succesfly', 'success', 'bottom');
              this.currentProduct = result;
              console.log(result);
            }
            else {
              this.intercationService.createToast('Something Went Wrong !', 'danger', 'bottom');
            }
          });
      }).catch(err => {
        this.submitted = false;
        this.intercationService.hide();
        this.intercationService.createToast('Something Went Wrong !', 'danger', 'bottom');
      });
  }

  selectedImage(event) {
    if (this.isFileImage(event.target.files[0])) {
      this.intercationService.createLoading('Updating Your image !!')
        .then(() => {
          const formData = new FormData();
          formData.append('file', event.target.files[0]);
          this.productService.postImage(formData, this.currentProduct._id)
            .then((result: any) => {
              this.intercationService.hide();
              if (result && result !== false) {
                this.intercationService.createToast('Your image updated', 'success', 'bottom');
                this.currentProduct.imageUrl = result;
              }
              else {
                this.intercationService.createToast('Something Went Wrong !', 'danger', 'bottom');
              }
            });
        }).catch(err => {
          this.intercationService.hide();
          this.intercationService.createToast('Something Went Wrong !', 'danger', 'bottom');
        });
    }
    else {
      this.intercationService.createToast('You must select an image !', 'danger', 'bottom');
    }
  }

  isFileImage(file) {
    const acceptedImageTypes = ['image/jpeg', 'image/png'];

    return file && acceptedImageTypes.includes(file['type'])
  }

  navigateBack() {
    this.navCntrl.back();
  }



  ionViewDidLeave() {
  }


  getProducts() {
    this.productService.getallProducts(this.selectedProduct._id, this.user._id)
      .then((result: any) => {
        console.log(result);
        if (result && result !== false) {
          if (result.length != 0) {
            this.currentProduct = result[0];
            this.buildReactiveForm();
          }
          else {
            this.buildReactiveForm();
          }
        }
      })
      .catch(err => {
        this.buildReactiveForm();
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
            this.intercationService.createToast('TOAST_IMAGE_ERROR', 'danger', 'bottom');
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





