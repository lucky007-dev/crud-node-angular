import {Injectable} from '@angular/core';
import { Post } from  './posts.model';
import {Subject } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map } from 'rxjs/operators';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
const BACKEND_URL=environment.apiUrl;
@Injectable({
  providedIn:'root'
})

export class PostService{

 constructor(private http:HttpClient,private router : Router){

 }

  posts:Post[]=[];
  private updatedPosts=new Subject<{posts:Post[],totalPosts:number}>();
  getPosts(postPerPage:number,currentPage:number){
    const queryParams =`?pagesize=${postPerPage}&page=${currentPage}`;
    this.http.get<{message:string,posts:any,totalPosts:number}>(BACKEND_URL+'posts'+ queryParams).pipe(map((postData)=>{
      return{posts: postData.posts.map(post=>{
        return {
          id:post._id,
          title:post.title,
          content:post.content,
          imagePath:post.imagePath,
          creator:post.creator
        }
      }),totalPosts:postData.totalPosts}
    })).subscribe((transposts)=>{
      this.posts=transposts.posts;
      this.updatedPosts.next({posts:[...this.posts],totalPosts:transposts.totalPosts});

    });

  }
  getUpdatedPostOnListener(){
    return this.updatedPosts.asObservable();
  }
  getPost(id:string){
   // return {...this.posts.find(p=>p.id===id)};
   return this.http.get<{_id:string,title:string,content:string,imagePath:string,creator:string}>(BACKEND_URL+'posts/'+id);
  }
  addPost(title:string,content:string,image:File){
    const formData=new FormData();
    formData.append("title",title);
    formData.append("content",content);
    formData.append("image",image,title);

    this.http.post<{message:string,post:Post}>(BACKEND_URL+'posts',formData).subscribe((postData)=>{
      this.router.navigate(["/lists"]);
    });

  }
  updatePost(id:string,title:string,content:string,image:File | string,){
    let formData : Post | FormData;
    if(typeof(image)==='object'){
      formData =new FormData();
      formData.append("id",id);
      formData.append("title",title);
      formData.append("content",content);
      formData.append("image",image,title);
    }else{
     formData ={
        id:id,
        title:title,
        content:content,
        imagePath : image,


      };
    }
    this.http.put(BACKEND_URL+ 'posts/' +id,formData).subscribe(result=>{
      this.router.navigate(["/lists"]);
    }


    );
  }
  postDelete(postId:string){
   return this.http.delete<{message:string}>(BACKEND_URL+'posts/' +postId);
  }

}
