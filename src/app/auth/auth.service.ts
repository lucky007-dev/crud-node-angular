import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthData} from './auth.model';
import { Subject,Observable } from 'rxjs';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import * as io from "socket.io-client";

const BACKEND_URL=environment.apiUrl;
const SOCKET_END_POINT=environment.SOCKET_ENDPOINT;
@Injectable({
  providedIn:'root'
})

export class AuthService {
  constructor(private http:HttpClient,private router:Router){

  }

  private authListener =new Subject<boolean>();
  private token:string;
  private userId:string;
  private tokenTimer:any;
  private room:string;
  private authValidate=false;



  getIsAuth(){
    return this.authValidate;
  }
  getUserId(){
    return this.userId;
  }
  getToken(){
    return this.token;
  }
  getAuthListener(){
    return this.authListener.asObservable();
  }
  autoAuthUser(){
    const authInformation =this.getAuthData();
    const now =new Date();
    if(!authInformation){
      return;
    }
    const expiresIn =authInformation.expirationDate.getTime()-now.getTime();
    if(expiresIn>0){
      this.token =authInformation.token;
      this.userId=authInformation.userId;
      this.setTimer(expiresIn/1000);
      this.authListener.next(true);
      this.authValidate=true;
    }


  }
  createUser(email:string,password:string){
    const authData:AuthData={email:email,password:password};
    this.http.post('http://localhost:3000/api/user/signup',authData).subscribe(response=>{
     this.router.navigate(['/auth'])
    },error=>{
      this.authListener.next(false);
    })
  }
  login(email:string,password:string){
    const authData:AuthData={email:email,password:password};
    this.http.post<{token:string,expiresIn:number,userId:string}>('http://localhost:3000/api/user/login',authData).subscribe(response=>{
      const token =response.token;
      this.token =token;
      if(token){
        const expireDuration =response.expiresIn;
        this.setTimer(expireDuration);
        this.authListener.next(true);
        this.userId =response.userId
        const now =new Date();
        const expirationDate= new Date(now.getTime()+expireDuration*1000);
        this.saveAuthData(token,expirationDate,this.userId);
        this.authValidate=true;



        this.router.navigate(['/lists']);
      }


    },error=>{
      this.authListener.next(false);
    })

  }
  logout(){
    this.authListener.next(false);
    this.token=null;
    this.userId=null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/auth'])
  }
  private saveAuthData(token:string,expirationDate:Date,userId:string){
    localStorage.setItem('token',token);
    localStorage.setItem('expiration',expirationDate.toISOString());
    localStorage.setItem('userId',userId),
    localStorage.setItem('room', Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))
  }
  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
    localStorage.removeItem("room")


  }
  private getAuthData(){
    const token =localStorage.getItem("token");
    const expirationDate=localStorage.getItem("expiration");
    const userId=localStorage.getItem("userId");
    if(!token || !expirationDate){
      return;
    }
    return {
      token:token,
      expirationDate:new Date(expirationDate),
      userId:userId
    }
  }
  private setTimer(duration:number){
    this.tokenTimer= setTimeout(()=>{
      this.logout();
    },duration*1000);
  }

}
