import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalControllers } from 'src/app/classes/modalControllers';
import { Category } from 'src/app/interfaces/category';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from '../../../services/crm/product.service';
import { CategoryService } from '../../../services/crm/category.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {

  @Input('category') category: Category;

  @Input('type') type: string;

  @Input('mainProduct') mainProduct: Product;

  @Input('currentProduct') currentProduct: Product;

  @Input('user') user : User;

  @Input('selectedProducts') selectedProducts: {product: Product,quantity: number}[];


  products: Product[];
  modalController: ModalControllers;
  sliderConfig = {
    slidesPerView: 2.2,
    spaceBetween: 0
  };
  loading : boolean = false;

  constructor(private productService: ProductService,
              private modalCntrl: ModalController,
              private categoryService: CategoryService) {
                this.modalController = new ModalControllers(modalCntrl);
               }

  ngOnInit() {
    if (this.type === 'home'){
      this.getAllProducts();
    }
    else if (this.type == 'category') {
      this.getProducts();
    }
    else if (this.type == 'add-product'){
      console.log(this.selectedProducts);
    }
  }

  getProducts() {
    this.loading = true;
        this.productService.getallProducts(this.mainProduct._id,this.user._id)
        .then((result: any) => {
          this.loading = false;
          if (result && result !== false){
            console.log("")
            this.products = result;
          }
        })
        .catch(err => {
          this.loading = false;
        });
  }

  getAllProducts(){
    this.loading = true;
    this.productService.getAllProducts(this.user._id)
      .then((result: any) => {
        this.loading = false;
        if (result && result !== false){
          this.products = result;
        }
      })
      .catch(err => {
        this.loading = false;
      });
  }
  openEditProduct(selectedProduct: Product){
    if (this.type != 'add-product'){
      this.modalController.callEditProduct(selectedProduct);
    }

  }

  removeQuantity(i){
    if (this.selectedProducts[i].quantity > 1){
      this.selectedProducts[i].quantity -= 1;
    }
  }

  addQuantity(i){
      this.selectedProducts[i].quantity += 1;
  }

}
