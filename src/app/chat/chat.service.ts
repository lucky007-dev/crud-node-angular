import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map } from 'rxjs/operators';
import {Observable,Subject} from 'rxjs';
import {Chat} from './chat.model';
import {environment} from '../../environments/environment';
import * as io from "socket.io-client";

const BACKEND_URL=environment.apiUrl;
const SOCKET_END_POINT=environment.SOCKET_ENDPOINT;

@Injectable({providedIn:'root'})
export class ChatService {

  constructor(private http: HttpClient) { }
  chats:Chat[]=[];
  socket;
  room;
  private updatedChats=new Subject<Chat[]>();
  // setupSocketConnection() {
  //   this.socket = io(environment.SOCKET_ENDPOINT);
  // }
  getChatByRoom(room:string){

   return this.http.get<{message:string,chats:any}>(BACKEND_URL+'chat/'+room)

  }
  getChats(){
     this.http.get<{chats:any}>(BACKEND_URL+'chat/chats').subscribe((result)=>{

      this.chats=result.chats;
      this.updatedChats.next([...this.chats])
    });
  }
  getUpdatedChatOnListener(){
    return this.updatedChats.asObservable();
  }
  saveChat(message:string) {

    var today = new Date();
//var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var createdAt = time;
    const Chat={id:null,message:message,room:localStorage.getItem("room"),createdAt};
    return this.http.post<{chat:any}>('http://localhost:3000/api/chat/savechat',Chat)
  }
  // join(data:any){
  //   this.socket.emit('join',data)
  // }
  // newUserJoin(){
  //   let observable=new Observable<{creator:string,message:string,room:string}>(observer=>{
  //     this.socket.on('new user joined',(data)=>{
  //       console.log(data)
  //       observer.next(data);
  //     })
  //     return ()=>{
  //       this.socket.disconnect();
  //     }
  //   })
  //   return observable;
//}


}
