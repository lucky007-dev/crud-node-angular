import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
const BACKEND_URL=environment.apiUrl;

@Injectable({providedIn:'root'})

export class PaymentService{
  constructor(private http :HttpClient){

  }
  getPaymentData(){
   return this.http.get(BACKEND_URL+'payment/store')
  }
  newMethod(stripeTokenId,items:any){
    const data ={
      stripeTokenId:stripeTokenId,
      items:items
    }
   return this.http.post<{message:string}>(BACKEND_URL+'payment/purchase',data);
  }
    // getToken(){
    //   var stripeHandler =StripeSource.confirmSofortSetup()({
    //     key:stripePublicKey,
    //     locale:'en',
    //     token:(token)=>{


    //     }
    //     })
    // }


}




