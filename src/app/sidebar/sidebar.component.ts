import {Component, OnDestroy, OnInit} from '@angular/core';
import { AuthService } from '../auth/auth.service';
import {Subscription} from 'rxjs';
@Component({
  selector:'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})

export class SidebarComponent implements OnInit,OnDestroy {

  events: string[] = [];
  opened: boolean;


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
}
