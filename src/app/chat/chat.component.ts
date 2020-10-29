import {Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import {ChatService} from './chat.service';
import {Chat} from './chat.model';
import * as io from "socket.io-client";
import {environment} from '../../environments/environment';
import { combineAll } from 'rxjs/operators';

const SOCKET_END_POINT=environment.SOCKET_ENDPOINT;
@Component({
  templateUrl:'./chat.component.html',
  styleUrls:['./chat.component.css']
})

export class ChatComponent implements OnInit,OnDestroy {
  room:string;
  messageText:string;
  userId:string
  socket;
  chatForm:NgForm;
  chats:Chat[]=[]
  private subscription:Subscription

  constructor(public chatService:ChatService){

  }
  ngOnInit() {
    this.userId=localStorage.getItem("userId")
    this.socket = io(SOCKET_END_POINT);
    this.chatService.getChats()
    this.subscription=this.chatService.getUpdatedChatOnListener().subscribe((result)=>{
      this.chats=result
      this.socket.on('new message',(data)=>{
        this.chats.push(data);
      })
      return ()=>{
        this.socket.disconnect();
      }
    });
  }
  ngOnDestroy(){
    this.subscription.unsubscribe()
  }
  sendMessage() {
    this.chatService.saveChat(this.messageText).subscribe((result) => {
       this.socket.emit('message', result.chat._doc);
       this.chats.push(result.chat._doc);
    }, (err) => {
      console.log(err);
    });
  }



}
