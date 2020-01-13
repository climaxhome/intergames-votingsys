import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../providers/authguard.service';


const routes: Routes = [
  { path: '', redirectTo: 'input-id', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: 'freshcodes',
    loadChildren: () => import('./freshcodes/freshcodes.module').then( m => m.FreshcodesPageModule),
    canActivate: [AuthGuard]
  },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminPageModule)},
  {
    path: 'input-id',
    loadChildren: () => import('./input-id/input-id.module').then( m => m.InputIdPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
