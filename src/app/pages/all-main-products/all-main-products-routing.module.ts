import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllMainProductsPage } from './all-main-products.page';

const routes: Routes = [
  {
    path: '',
    component: AllMainProductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllMainProductsPageRoutingModule {}
