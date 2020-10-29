import { Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component ({
  templateUrl:'./login.component.html',
  styleUrls:['./login.component.css']
})

export class LoginComponent implements OnInit,OnDestroy{
  constructor(public authService:AuthService){

  }
  private subscription:Subscription;
  isLoading=false;
  ngOnInit(){
    this.subscription =this.authService.getAuthListener().subscribe(authStatus=>{
      this.isLoading=false;
    });
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
  onLogin(form:NgForm){
    if(form.invalid){
      return;
    }
    this.isLoading=true;

    this.authService.login(form.value.email,form.value.password);


  }

}
