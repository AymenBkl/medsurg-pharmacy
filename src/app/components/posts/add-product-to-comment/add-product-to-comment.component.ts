import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController, NavParams, Platform } from '@ionic/angular';
import { Category } from 'src/app/interfaces/category';
import { Comment } from 'src/app/interfaces/comment';
import { MainProduct } from 'src/app/interfaces/mainProduct';
import { Product } from 'src/app/interfaces/product';
import { User } from 'src/app/interfaces/user';
import { AllproductsService } from 'src/app/services/crm/allproducts.service';
import { CategoryService } from 'src/app/services/crm/category.service';
import { ProductService } from 'src/app/services/crm/product.service';
import { InteractionService } from 'src/app/services/interaction.service';
import { PrescriptionService } from 'src/app/services/prescription.service';

@Component({
  selector: 'app-add-product-to-comment',
  templateUrl: './add-product-to-comment.component.html',
  styleUrls: ['./add-product-to-comment.component.scss'],
})
export class AddProductToCommentComponent implements OnInit {

  currentUser: User;
  mainProducts: Product[];
  searchProduct: Product[];
  arrToDisplay: any;
  selectedProducts: {product: Product,quantity: number}[] = [];
  comment: Comment;
  sliderConfig = {
    slidesPerView: 2.2,
    spaceBetween: 0
  };
  constructor(private intercationService: InteractionService,
    private productService: ProductService,
    public platform: Platform,
    private prescriptionService: PrescriptionService,
    private navParams: NavParams,
    private interactionService: InteractionService,
    private modalCntrl: ModalController) { }

  ngOnInit() {
    this.currentUser = this.navParams.get('user');
    this.comment = this.navParams.get('comment');
    this.getPharmacyProducts();
  }


  getPharmacyProducts() {
    this.intercationService.createLoading('Loading Please Wait !')
      .then(() => {
        this.productService.getAllProducts(this.currentUser._id)
          .then(async (result: any) => {
            this.mainProducts = result;
            await this.removeNullMainProduct();
            this.searchProduct = this.mainProducts;
            this.watchResolution(false);
            this.intercationService.hide();
          });
      });
  }

  async removeNullMainProduct(){
    this.mainProducts = await this.mainProducts.filter(product => product.mainProduct != null);
  }

  onInput(value) {
    const medecin = value;
    this.searchProducts(medecin);
  }

  

  searchProducts(medecin: string) {
    this.searchProduct = this.mainProducts.filter(product =>
      product.mainProduct.name && product.mainProduct.name.toLowerCase().includes(medecin.toLowerCase())
    )
    this.watchResolution(true);
  }

  watchResolution(search: boolean) {
    this.platform.ready()
      .then(() => {
        if (!search) {
          this.platform.resize
            .subscribe(resize => {
              this.initProducts(this.platform.width());
            })
        }
        this.initProducts(this.platform.width());
      })
  }

  calculateNumberOfColumns(width: number) {
    let numberColumns = 0;
    if (width < 767) {
      numberColumns = 2;
    }
    else if (width >= 767 && width < 991) {
      numberColumns = 3;
    }
    else {
      numberColumns = 4;
    }

    return numberColumns;
  }

  initProducts(width: number) {
    let numberOfColumns = this.calculateNumberOfColumns(width);
    this.arrToDisplay = [];
    for (var i = 0; i < this.searchProduct.length; i = i + numberOfColumns)
      this.arrToDisplay.push(this.searchProduct.slice(i, i + numberOfColumns));

  }

  checkProdExist(selectedProduct: Product) {
    let selectedProd = this.selectedProducts.filter(product => product.product == selectedProduct);
    return selectedProd;
  }

  async selectedProduct(selectedProduct: Product) {
    let selectedProd = this.checkProdExist(selectedProduct);
    if (selectedProd.length > 0){
      const isIn = this.selectedProducts.indexOf(selectedProd[0]);
      if (isIn === -1) {
        this.selectedProducts.push(selectedProd[0]);
      }
      else {
        this.selectedProducts.splice(isIn, 1);
      }
    }
    else {
      this.selectedProducts.push({product: selectedProduct,quantity: 1});
    }
    
  }

  addComment(){
    this.comment.products = this.selectedProducts;
    this.interactionService.createLoading('Adding Comment ...')
      .then(() => {
        this.interactionService.hide();
        this.prescriptionService.addComment(this.comment)
        .then((result: any) => {
          if (result && result != false){
            this.interactionService.createToast("Your comment Added succesfully","success","bottom");
            this.modalCntrl.dismiss();
          }
          else {
            this.interactionService.createToast("Something Went Wrong !","danger","bottom");
          }
        })
        .catch(err => {
          this.interactionService.hide();
          this.interactionService.createToast("Something Went Wrong !","danger","bottom");
        })
      })
    
  }

  close(){
    this.modalCntrl.dismiss(null);
  } 

  

}
