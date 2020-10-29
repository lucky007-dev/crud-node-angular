import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import {AngularMaterialModule} from './angular-material.module';
import {PostsModule} from './posts/posts.module';
import { AppComponent } from './app.component';
import {HeaderComponent} from './header/header.component';
import { ErrorComponent } from './error/error.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from './auth/auth.interceptor';
import {ErrorInterceptor } from './error-interceptor';
import {SidebarComponent } from './sidebar/sidebar.component';
import {ChatComponent} from './chat/chat.component';
import { PaymentComponent} from './payment/payment.component'
import {FormsModule} from '@angular/forms';
import {MatChipsModule} from '@angular/material/chips';






@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    ChatComponent,
    PaymentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    PostsModule,
    FormsModule,
    MatChipsModule



  ],
  providers: [{provide:HTTP_INTERCEPTORS,useClass:AuthInterceptor,multi:true},
    {provide:HTTP_INTERCEPTORS,useClass:ErrorInterceptor,multi:true}],
  bootstrap: [AppComponent],
  entryComponents:[ErrorComponent]
})
export class AppModule { }
