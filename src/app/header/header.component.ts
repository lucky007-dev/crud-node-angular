import {Component, OnDestroy, OnInit,ViewChild} from '@angular/core';
import { AuthService } from '../auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector:'app-header',
  templateUrl:'./header.component.html',
  styleUrls:['./header.component.css']

})
export class HeaderComponent implements OnInit,OnDestroy{
  isUserAuthenticated=false;

  private subscription:Subscription

  constructor(public authService:AuthService){

  }
  ngOnInit(){
    this.isUserAuthenticated=this.authService.getIsAuth();
    this.subscription=this.authService.getAuthListener().subscribe(isAuthenticated=>{
      this.isUserAuthenticated=isAuthenticated;
    })

  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
  onLogout(){
    this.authService.logout();

  }


}
