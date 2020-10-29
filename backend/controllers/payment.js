const fs =require("fs");
const stripeSecretKey=process.env.STRIPE_SECRET_KEY;
const stripe =require("stripe")(stripeSecretKey)
exports.getData=
(req,res,next)=>{
  fs.readFile('items.json',(error,data)=>{
      if(error){
          res.status(500).end();
      }else{
        res.status(201).json({
           // stripePublicKey:stripePublicKey,
          items: JSON.parse(data)
        })
      }
  })


}
exports.postPayment=(req,res)=>{
  fs.readFile('items.json',(error,data)=>{
      if(error){
          res.status(500).end();
      }else{
          const itemsJson =JSON.parse(data)
          const itemsArray=itemsJson.music.concat(itemsJson.merch);
          let total =0;

          req.body.items.forEach((item)=>{
              const itemJson =itemsArray.find((i)=>{
                 return i.id==item.id
              })
              total = total + itemJson.price * item.quantity
          })
          stripe.charges.create({
              amount:total,
              source:req.body.stripeTokenId,
              currency:'inr',
              description: "Node Payment App Charge"
          }).then(()=>{
              console.log('success')
              res.status(200).json({
                  message:'Charged Successfully'
              })
          }).catch(()=>{
              res.status(500).json({
                message:'Charged Failed'
              })
          })
      }
  })


}
