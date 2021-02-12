import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController, NavParams, Platform } from '@ionic/angular';
import { ModalControllers } from 'src/app/classes/modalControllers';
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
  selector: 'app-all-products',
  templateUrl: './all-products.page.html',
  styleUrls: ['./all-products.page.scss'],
})
export class AllProductsPage implements OnInit {
  currentUser: User;
  mainProducts: Product[];
  searchProduct: Product[];
  arrToDisplay: any;
  selectedProducts: {product: Product,quantity: number}[] = [];
  comment: Comment;
  modalController: ModalControllers;
  constructor(private intercationService: InteractionService,
    private productService: ProductService,
    public platform: Platform,
    private prescriptionService: PrescriptionService,
    private navParams: NavParams,
    private interactionService: InteractionService,
    private modalCntrl: ModalController) { 
      this.modalController = new ModalControllers(modalCntrl);
    }



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

  openEditProduct(selectedProduct: Product){
    this.modalController.callEditProduct(selectedProduct);
    

  }

}
