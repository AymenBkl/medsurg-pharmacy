import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
import { AuthService } from '../../services/auth.service';
import { InteractionService } from '../../services/interaction.service';
import { ProductService } from '../../services/crm/product.service';
import { Product } from 'src/app/interfaces/product';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { onValueChanged } from './valueChanges';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AllproductsService } from 'src/app/services/crm/allproducts.service';
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
              private activeRouter: ActivatedRoute) { }

  ngOnInit() {
    this.user = this.authService.user;
    this.getCurrentRouter();
    this.buildReactiveForm();
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

getCurrentRouter() {
  const mainProduct = JSON.parse(this.activeRouter.snapshot.paramMap.get('mainproduct'));
  if (mainProduct && mainProduct != null){
    this.selectedProduct = mainProduct;
    this.getProducts();
  }
  else {
    this.getAllProducts();
  }
}

buildReactiveForm() {
  this.productForm = this.formBuilder.group({
    description : [''],
    price : ['', [Validators.required]],
    pharmacy:[this.authService.user._id,[Validators.required]]
  });

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
  if (this.currentProduct.imageUrl === ''){
    this.intercationService.alertWithHandler('You didnt select an image !', 'Alert' , 'STAY' , 'SELECT LATAR')
      .then(() => {
        this.navigateBack();
      });
  }
  else {
    this.navigateBack();
  }
}

getAllProducts(){
  this.intercationService.createLoading('Loading Please Wait !')
    .then(() => {
      this.mainProductService.getAllMainProducts()
      .then((result: any) => {
        this.intercationService.hide();
        if (result && result !== false){
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
mainProductChange($event){
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
            if (result && result !== false){
              this.intercationService.createToast('Your mainProduct added succesfly', 'success', 'bottom');
              this.currentProduct = result;
              console.log(result);
            }
            else {
              this.intercationService.createToast('Something Went Wrong !', 'danger', 'bottom');
            }
      }   );
      }).catch(err => {
        this.submitted = false;
        this.intercationService.hide();
        this.intercationService.createToast('Something Went Wrong !', 'danger', 'bottom');
      });
  }

  selectedImage(event) {
    this.intercationService.createLoading('Updating Your image !!')
      .then(() => {
        const formData = new FormData();
        console.log(event.target.files[0]);
        formData.append('file', event.target.files[0]);
        this.productService.postImage(formData, this.currentProduct._id)
          .then((result: any) => {
            this.intercationService.hide();
            if (result && result !== false){
              this.intercationService.createToast('Your image updated', 'success', 'bottom');
              this.currentProduct.imageUrl = result;
            }
            else {
              this.intercationService.createToast('Something Went Wrong !', 'danger', 'bottom');
            }
      }   );
      }).catch(err => {
        this.intercationService.hide();
        this.intercationService.createToast('Something Went Wrong !', 'danger', 'bottom');
      });
  }

  navigateBack() {
    this.navCntrl.back();
  }


 
  ionViewDidLeave(){
  }


  getProducts() {
    this.productService.getallProducts(this.selectedProduct._id,this.user._id)
    .then((result: any) => {
      console.log(result);
      if (result && result !== false){
        if (result.length != 0){
          this.currentProduct = result[0];
        }
      }
    })
    .catch(err => {
    });
}

}





