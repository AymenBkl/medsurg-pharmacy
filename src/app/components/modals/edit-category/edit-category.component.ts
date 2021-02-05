import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, Platform } from '@ionic/angular';
import { CategoryService } from '../../../services/crm/category.service';
import { InteractionService } from '../../../services/interaction.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MainProduct } from 'src/app/interfaces/mainProduct';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { Category } from 'src/app/interfaces/category';
@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss'],
})
export class EditCategoryComponent implements OnInit {

  categorie: Category;
  currentUser: User;
  mainProducts: MainProduct[];
  searchProduct: MainProduct[];
  arrToDisplay: any;
  constructor(private authService: AuthService,
              private categoryService: CategoryService,
              private interactionService: InteractionService,
              private router: Router,
              private navParams: NavParams,
              private platform: Platform,
              private modalCntrl: ModalController ) { }

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.currentUser = this.authService.user;
    this.categorie = this.navParams.get('category');
    this.getCategoryApi();
  }


  getCategoryApi() {
    this.categoryService.getCategory(this.categorie._id)
      .then((result: any) => {
        if (result && result != false){
          this.mainProducts = result.products;
          this.searchProduct = result.products;
          this.watchResolution(false);
        }
      })
      .catch(err => {
        console.log(err);
      })
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

    goToaddProduct(selectedProduct: MainProduct) {
      this.modalCntrl.dismiss();
      this.router.navigate(['/addproduct', {mainproduct: JSON.stringify(selectedProduct)}]);
    }

    close(){
      this.modalCntrl.dismiss();
    }
}
