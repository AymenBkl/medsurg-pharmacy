import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService as AuthGuard} from './services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    redirectTo:'tabs/tab1',
    canActivate : [AuthGuard]
  },
  {
    path: 'profile',
    redirectTo:'tabs/tab4',
    canActivate : [AuthGuard]
  },
  {
    path: 'categories',
    redirectTo:'tabs/tab4/categories',
    canActivate : [AuthGuard]
  },
  {
    path: 'addproduct',
    redirectTo:'tabs/tab2/addproduct',
    canActivate : [AuthGuard]
  },
  {
    path: 'prescriptions',
    redirectTo:'tabs/tab4/prescriptions',
    canActivate : [AuthGuard]
  },
  {
    path: 'all-main-products',
    redirectTo:'tabs/tab2',
    canActivate : [AuthGuard]
  },
  {
    path: 'messages',
    redirectTo:'tabs/tab4/messages',
    canActivate : [AuthGuard]
  },
  {
    path: 'orders',
    redirectTo:'tabs/tab3',
    canActivate : [AuthGuard]
  },
  {
    path: 'refund',
    redirectTo: 'tabs/tab4/refund'   , 
    canActivate: [AuthGuard]
  },
  {
    path: 'payment-detail',
    redirectTo: 'tabs/tab4/payment-detail'   , 
    canActivate: [AuthGuard]
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

