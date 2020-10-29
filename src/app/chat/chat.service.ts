import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from 'rxjs';
import {Chat} from './chat.model';
import {environment} from '../../environments/environment';
const BACKEND_URL=environment.apiUrl;
@Injectable({providedIn:'root'})
export class ChatService {

  constructor(private http: HttpClient) { }
  chats:Chat[]=[];
  socket;
  room;
  private updatedChats=new Subject<Chat[]>();
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
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var createdAt = time;
    const Chat={id:null,message:message,room:localStorage.getItem("room"),createdAt};
    return this.http.post<{chat:any}>(BACKEND_URL+'chat/savechat',Chat)
  }
}
