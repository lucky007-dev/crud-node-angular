import { Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import { Subscription } from 'rxjs';
import {AuthService} from '../auth.service';

@Component ({
  templateUrl:'./signup.component.html',
  styleUrls:['./signup.component.css']
})

export class SignupComponent implements OnInit,OnDestroy{
  constructor(public authService:AuthService){

  }
  isLoading=false;
  private subscription:Subscription;


  onSignup(form:NgForm){
    if(form.invalid){
      return;
    }
    this.isLoading=true;
    this.authService.createUser(form.value.email,form.value.password);
   // form.resetForm();

  }
  ngOnInit(){
    this.subscription=this.authService.getAuthListener().subscribe(result=>{
      this.isLoading=false;
    });
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
