import {  NgModule } from '@angular/core';
import {RouterModule,Routes} from '@angular/router';
import {PostCreateComponent} from './posts/post-create/post-create.component';
import {PostListComponent} from './posts/post-list/post-list.component';
import {AuthGuard} from './auth/auth-guard';
import {ChatComponent} from './chat/chat.component';
import { PaymentComponent} from './payment/payment.component';



const routes :Routes=[

  {path:'create',component:PostCreateComponent,canActivate:[AuthGuard] },
  {path:'edit/:postId',component:PostCreateComponent,canActivate:[AuthGuard]},
  {path:'lists',component:PostListComponent,canActivate:[AuthGuard]},
  {path:'chat',component:ChatComponent,canActivate:[AuthGuard]},
  {path:'payment',component:PaymentComponent,canActivate:[AuthGuard]},
  {path :'auth',loadChildren:()=>import('./auth/auth.module').then(m=>m.AuthModule)},

]
@NgModule({
  imports :[RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[AuthGuard]
})
export class AppRoutingModule{

}
