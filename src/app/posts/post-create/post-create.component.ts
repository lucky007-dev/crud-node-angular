import { Component,OnInit }  from '@angular/core';
import {Post} from '../posts.model';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import { PostService} from '../post.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {mimeType} from './mime-type.validator';
interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector :'app-post-create',
  templateUrl :'./post-create.component.html',
  styleUrls :['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {

  constructor(public postsService:PostService,public route:ActivatedRoute){
  }


  post :Post;
  isLoading=false;
  form:FormGroup;
  imagePreview:string;
  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];
  selected = 'option2';
  private mode="create";
  private postId :string;

  ngOnInit(){
    this.form =new FormGroup({
      title:new FormControl(null,{validators:[Validators.required,Validators.minLength(3)]
      }),
      content:new FormControl(null,{validators:[Validators.required]}),
      image:new FormControl(null,{validators:[Validators.required],asyncValidators:[mimeType]}),
      dateOfBirth: new FormControl(null,{validators:[Validators.required]}),
      selectFormControl : new FormControl('', Validators.required)

    });

    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
      if(paramMap.has('postId')){
        this.mode="edit";
        this.postId=paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData=>{
          this.isLoading=false;
          this.post ={
            id:postData._id,
            title:postData.title,
            content:postData.content,
            imagePath:postData.imagePath,



          }
          this.form.setValue({

            title:this.post.title,
            content:this.post.content,
            image:this.post.imagePath,


          });
        });
      }else{
        this.mode="create";
        this.postId=null;
      }
    });




  }
  addPosts( ){
    if(this.form.invalid){
      console.log('here');
      return;
    }
    console.log(this.form.value)
    this.isLoading = true;
    if(this.mode==="create"){
      this.postsService.addPost(this.form.value.title,this.form.value.content,this.form.value.image);
    }else{
      this.postsService.updatePost(this.postId,this.form.value.title,this.form.value.content,this.form.value.image);

    }

    this.form.reset();
  }
  onImagePicked(event:Event){
    const file =(event.target as HTMLInputElement).files[0];
    this.form.patchValue({image:file});
    this.form.get('image').updateValueAndValidity();

    const reader =new FileReader();
    reader.onload =()=>{

      this.imagePreview=reader.result as string;
    }
    reader.readAsDataURL(file);
  }
  date(e) {
    var convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.form.get('dateOfBirth').setValue(convertDate);
  }
  onSelect(event:Event){
    console.log(event);
  }


}
