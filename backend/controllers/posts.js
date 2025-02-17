const Post = require("../models/post");

exports.createPost =(req,res,next)=>{
  const url =req.protocol + "://" + req.get("host");
  const post = new Post({
    title:req.body.title,
    content:req.body.content,
    imagePath: url + "/images/" +req.file.filename,
    creator:req.userData.userId,
    dateOfBirth:req.body.dateOfBirth
  });
  post.save().then((result)=>{
    console.log(result);
    res.status(201).json({
      message:'Posts added successfully.',
      post:
      {
        ...result,
        id:result._id
      }
    });

  }).catch(error=>{
    res.status(500).json({
      message:'Creating a post failed!'
    })
  });


}
exports.updatePost=(req,res,next)=>{
  let imagePath =req.body.imagePath;
  if(req.file){
    const url =req.protocol + "://" + req.get("host");
    imagePath=url + "/images/" +req.file.filename;

  }
  const post = new Post({
    _id:req.body.id,
    title:req.body.title,
    content:req.body.content,
    imagePath:imagePath,
    creator:req.userData.userId

  })
 Post.updateOne({_id:req.params.id,creator:req.userData.userId},post).then(result=>{
   if(result.n>0){
    res.status(200).json({
      message:'Post Updated Successfully'
    });
   }else{
     res.status(401).json({mesassage:'Auth failed!'});
   }
 }).catch(error=>{
   res.status.json({
     message:'Could not update post!'
   })
 });


}
exports.getPost =(req,res,next)=>{
  Post.findById(req.params.id).then(post=>{
    if(post){
      res.status(200).json(post);
    }else{
      res.status(404).json({message:'Post not found'});
    }

  }).catch(error=>{
    res.status(500).json({
      message:'Fetching post failed!'
    })
  });

}
exports.getPosts=(req,res,next)=>{
  const pageSize =+req.query.pagesize;
  const currentPage =+req.query.page;
  postQuery =Post.find();
  let fetchedPosts;
  if(pageSize && currentPage){
    postQuery.skip(pageSize*(currentPage-1)).limit(pageSize);

  }
  postQuery.then(attachments=>{
    fetchedPosts=attachments;
    return Post.countDocuments();


  }).then(postCount=>{
    res.status(200).json({
      message:'Posts Fetched successfully',
      posts:fetchedPosts,
      totalPosts:postCount
    });

  }).catch(error=>{
    res.status(500).json({
      message:'Fetching posts failed!'
    })
  });

}
exports.deletePost=(req,res,next)=>{
  Post.deleteOne({
    _id:req.params.id,creator:req.userData.userId
  }).then(data=>{
    if(data.n>0){
      res.status(200).json({
        message:'Posts Deleted successfully',

      });
    }else{

      res.status(401).json({
        message:'auth failed'
      })
    }
  }).catch(error=>{
    res.status(500).json({
      message:'You are not authorized!'
    })
  });

}
