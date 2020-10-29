import {Component, ElementRef,OnInit,AfterViewInit,
  OnDestroy,
  ViewChild,

  ChangeDetectorRef} from'@angular/core';
import {PaymentService} from './payment.service'
import { AngularStripeService } from '@fireflysemantics/angular-stripe-service'
import { NgForm } from '@angular/forms';
import {environment} from '../../environments/environment';
const stripePublicKey=environment.STRIPE_PUBLIC_KEY;
@Component({
  templateUrl:'./payment.component.html',
  styleUrls:['./payment.component.css']
})
 export class PaymentComponent implements OnInit,OnDestroy{

   @ViewChild('cardInfo', { static: false }) cardInfo: ElementRef;

   stripe;
   loading = false;
   confirmation;
   card: any;
   cardHandler = this.onChange.bind(this);
   error: string;
   musicArray=[];
   merchArray=[];
   constructor(public paymentService:PaymentService,public cd: ChangeDetectorRef,
    public stripeService:AngularStripeService){

   }
  ngOnInit(){
    this.paymentService.getPaymentData().subscribe((result)=>{
      this.musicArray=result['items'].music;
      this.merchArray=result['items'].merch;
    })
    this.stripeService.setPublishableKey(stripePublicKey).then(
      stripe=> {

    this.stripe = stripe;
    const elements = stripe.elements();
    this.card = elements.create('card');
    this.card.mount(this.cardInfo.nativeElement);
    this.card.addEventListener('change', this.cardHandler);
    });
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }
  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

  async onSubmit(form: NgForm) {
    const { token, error } = await this.stripe.createToken(this.card);
    if (error) {
      console.log('Error:', error);
    } else {
      var items=[];
      var cartItemContainer=document.getElementsByClassName('cart-items')[0];
      var cartRows =cartItemContainer.getElementsByClassName('cart-row');
      for(var i=0;i< cartRows.length;i++){
        var cartRow =cartRows[i];
        var quantity=  (<HTMLInputElement>cartRow.getElementsByClassName('cart-quantity-input')[0]).value
        var id =cartRow.getAttribute('data-item-id');
        items.push({
            id:id,
            quantity:quantity
        })
      }
      const stripeTokenId=token.id;
      this.paymentService.newMethod(stripeTokenId,items).subscribe((result)=>{
        console.log('Success!', result);
        alert(result.message)
        var cartItems = document.getElementsByClassName('cart-items')[0]
        while (cartItems.hasChildNodes()) {
            cartItems.removeChild(cartItems.firstChild)
        }
        this.updateCartTotal()
      },error=>{
        console.log(error)
      })

    }
  }

  addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    var id =shopItem.dataset.itemId
    this.addItemToCart(title, price, imageSrc,id)
    this.updateCartTotal()
  }
  addItemToCart(title, price, imageSrc,id) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    cartRow.dataset.itemId=id;
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerHTML == title) {
            alert('This item is already added to the cart')
            return
        }
    }
    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1"  >
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow);
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', this.removeCartItem.bind(this))
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change',this.quantityChanged.bind(this))
  }
  removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    this.updateCartTotal()
  }

  quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    this.updateCartTotal()
  }
  updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
      var cartRow = cartRows[i]
      var priceElement = cartRow.getElementsByClassName('cart-price')[0]
      var quantity=  (<any>cartRow.getElementsByClassName('cart-quantity-input')[0]).value
      var price = parseFloat(priceElement.innerHTML.replace('$', ''))
      total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerHTML = '$' + total
  }






}
