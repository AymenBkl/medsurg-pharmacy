import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalControllers } from 'src/app/classes/modalControllers';
import { Category } from 'src/app/interfaces/category';
import { CategoryService } from '../../../services/crm/category.service';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {

  categories: Category[];
  modalController: ModalControllers;
  sliderConfig = {
    slidesPerView: 2.2,
    spaceBetween: 0
  };
  constructor(private categoryService: CategoryService,
              private modalCntrl: ModalController) {
                this.modalController = new ModalControllers(modalCntrl);
               }

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
      this.categoryService.getAllCategories()
      .then((result: any) => {
        if (result && result !== false) {
          this.categories = result;
        }
        else {
          this.categories = [];
        }
      })
      .catch(err => {
        this.categories = [];
      });
  }

  openEditCategory(selectedCategory: Category){
    this.modalController.callEditCategory(selectedCategory);
  }


}
