import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuardService as AuthGuard} from '../services/auth-guard.service';

const routess: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../pages/home/home.module').then( m => m.HomePageModule),
        canActivate : [AuthGuard]
      },
      {
        path: 'tab2',
        loadChildren: () => import('../pages/all-main-products/all-main-products.module').then( m => m.AllMainProductsPageModule),
        canActivate : [AuthGuard]
      },
      {
        path: 'tab3',
        loadChildren: () => import('../pages/orders/orders.module').then( m => m.OrdersPageModule),
        canActivate : [AuthGuard] 
      },
      {
        path: 'tab4',
        loadChildren: () => import('../pages/profile/profile.module').then( m => m.ProfilePageModule),
        canActivate : [AuthGuard]
      },
      {
        path: 'tab4/categories',
        loadChildren: () => import('../pages/category/category.module').then( m => m.CategoryPageModule),
        canActivate : [AuthGuard]
      },
      {
        path: 'tab2/addproduct',
        loadChildren: () => import('../pages/addproduct/addproduct.module').then( m => m.AddproductPageModule),
        canActivate : [AuthGuard]
      },
      {
        path: 'tab4/prescriptions',
        loadChildren: () => import('../pages/prescriptions/prescriptions.module').then( m => m.PrescriptionsPageModule),
        canActivate : [AuthGuard]
      },
      {
        path: 'tab4/refund',
        loadChildren: () => import('../pages/refund/refund.module').then( m => m.RefundPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'tab4/payment-detail',
        loadChildren: () => import('../pages/payment-detail/payment-detail.module').then( m => m.PaymentDetailPageModule),
        canActivate: [AuthGuard]
      },
      
      {
        path: 'tab4/messages',
        loadChildren: () => import('../pages/messages/messages.module').then( m => m.MessagesPageModule),
        canActivate : [AuthGuard]
      },
      
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routess)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
