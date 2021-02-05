import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from '../../services/auth.service';
import { InteractionService } from '../../services/interaction.service';
import { AllproductsService } from '../../services/crm/allproducts.service';
import { NavController, ModalController, Platform } from '@ionic/angular';
import { Subject } from 'rxjs';
import { ModalControllers } from '../../classes/modalControllers';
import { Router } from '@angular/router';
import { Product } from 'src/app/interfaces/product';
@Component({
  selector: 'app-all-main-products',
  templateUrl: './all-main-products.page.html',
  styleUrls: ['./all-main-products.page.scss'],
})
export class AllMainProductsPage implements OnInit {

  currentUser: User;
  mainProducts: Product[];
  subscription: Subject<User>;
  modalController: ModalControllers;
  searchProduct: Product[];
  arrToDisplay: any;
  constructor(private authService: AuthService,
              private intercationService: InteractionService,
              private allProductService: AllproductsService,
              private navCntrl: NavController,
              private modalCntrl: ModalController,
              private router: Router,
              private platform: Platform,
              ) {
                this.modalController = new ModalControllers(modalCntrl);
              }

  ngOnInit() {
    this.checkmainProducts();
    this.currentUser = this.authService.user;
}
getMainProducts() {
  this.intercationService.createLoading('Loading Please Wait !')
    .then(() => {
      this.allProductService.getMainProducts()
      .then((result: any) => {
        this.intercationService.hide();
        if (result && result !== false){
          this.mainProducts = result;
          this.searchProduct = result;
          this.watchResolution(false);
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

goToaddProduct(selectedProduct) {
  this.router.navigate(['/addproduct', {mainproduct: JSON.stringify(selectedProduct)}]);
}

ionViewDidEnter(){
  
}

checkmainProducts(){
  this.getMainProducts();
}

ionViewDidLeave(){
}


onInput(value){
  const medecin = value;
  this.searchProducts(medecin);
}

searchProducts(medecin: string) {
  this.searchProduct = this.mainProducts.filter(product => 
    product.name && product.name.toLowerCase().includes(medecin.toLowerCase())
  )
  this.watchResolution(true);
}

watchResolution(search:boolean){
  this.platform.ready()
    .then(() => {
      if (!search){
        this.platform.resize
        .subscribe(resize => {
          this.initProducts(this.platform.width());
        })
      }
       this.initProducts(this.platform.width());
    })
}

calculateNumberOfColumns(width: number){
  let numberColumns = 0;
  if (width < 767){
    numberColumns = 2;
  }
  else if (width >= 767 && width < 991){
    numberColumns = 3;
  }
  else {
    numberColumns = 4;
  }

  return numberColumns;
}

initProducts(width: number){
  let numberOfColumns = this.calculateNumberOfColumns(width);
  this.arrToDisplay = []; 
  for(var i=0;i < this.searchProduct.length;i = i+numberOfColumns)
  this.arrToDisplay.push(this.searchProduct.slice(i,i+numberOfColumns));

}
}

