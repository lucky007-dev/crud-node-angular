import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../posts.model';
import { PostService} from '../post.service';
import {Subscription} from 'rxjs';
import {PageEvent} from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

import {animate, state, style, transition, trigger} from '@angular/animations';
@Component({
  selector:'app-post-list',
  templateUrl:'./post-list.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PostListComponent implements OnInit,OnDestroy {
    constructor(public postsService :PostService,public authService:AuthService){

    }
    isUserAuthenticated=false;
    userId:string;
    isLoading=false;
    totalPost=0;
    postsPerPage=2;
    currentPage=1;
    pageOptions=[1,2,5,10];

displayedColumns: string[] = ['someValue', 'someOtherValue'];


  headerText: string;
    posts : Post[]=[];
    private destroyData:Subscription;
    private authData:Subscription;
    messageArray:Array<{user:string,message:string}>=[];
    ngOnInit(){
      this.isLoading=true;
      this.postsService.getPosts(this.postsPerPage,this.currentPage);
      this.userId=this.authService.getUserId();

      this.destroyData=this.postsService.getUpdatedPostOnListener().subscribe((postData:{posts:Post[],totalPosts:number})=>{
        this.isLoading=false;
        this.posts=postData.posts;
        this.totalPost=postData.totalPosts;
      })
      this.isUserAuthenticated=this.authService.getIsAuth();
      this.authData=this.authService.getAuthListener().subscribe(isAuthenticated=>{
          this.isUserAuthenticated=isAuthenticated;
          this.userId=this.authService.getUserId();
      });
    }
    ngOnDestroy(){
      this.destroyData.unsubscribe();
      this.authData.unsubscribe();
    }
    deletePost(postId:string){
      this.postsService.postDelete(postId).subscribe(()=>{
        this.postsService.getPosts(this.postsPerPage,this.currentPage);
      },()=>{
        this.isLoading=false;
      });

    }
    onChangePage(pageData:PageEvent){
      console.log(pageData);
      this.currentPage=pageData.pageIndex+1;
      this.postsPerPage=pageData.pageSize;
      this.postsService.getPosts(this.postsPerPage,this.currentPage);
    }




}
