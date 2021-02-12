import { Component, Input, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { Category } from 'src/app/interfaces/category';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { onValueChanged } from './valueChanges';
import { ProductService } from '../../../services/crm/product.service';
import { InteractionService } from '../../../services/interaction.service';
import { Router } from '@angular/router';
import { Product } from 'src/app/interfaces/product';
import { User } from 'src/app/interfaces/user';

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

  selectedImage(event) {
    this.interactionService.createLoading('Updating Your image !!')
      .then(() => {
        const formData = new FormData();
        console.log(event.target.files[0]);
        formData.append('file', event.target.files[0]);
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

}


