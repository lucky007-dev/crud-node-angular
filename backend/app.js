const express =require("express");
const path =require("path");
const bodyParser =require("body-parser");
const mongoose =require("mongoose");
const postRoutes=require("./routes/posts");
const userRoutes=require('./routes/user');
const chatRoutes=require('./routes/chat');
const paymentRoutes=require('./routes/payment');
const app=express();
mongoose.connect("mongodb+srv://lokendra123:" + process.env.MONGO_ATLAS_PW + "@cluster0.yi8sl.mongodb.net/node-postangular?retryWrites=true&w=majority").then(()=>{
  console.log("Connected to mongo database");
}).catch(()=>{
  console.log("Error in Connection");
});
app.use(bodyParser.json());
app.use("/images",express.static(path.join("backend/images")));
app.use((req,res,next) =>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers",
  "Origin,X-Requested-With,Content-Type,Accept,Authorization");
  res.setHeader("Access-Control-Allow-Methods","GET,POST,PATCH,PUT,DELETE,OPTION");
  next();

});
app.use("/api/posts",postRoutes);
app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/payment',paymentRoutes);
module.exports =app;
