const express = require("express");

const client = require("../configs/redis")
const router = express.Router();
const Product = require("../models/product.model.js")

router.post("",async(req,res)=>{
    try{
        const product = await Product.create(req.body);
        const products = Product.find().lean().exec();
        client.set("products",JSON.stringify(products))  //we cannot store object and arrays in the redis that why we are converting this 
        return res.status(201).send(product);             //in string

    }catch(err){
        return res.status(500).send({message:err.message});
    }
});
router.get ("",async (req,res)=>{
    try{
client.get("products", async function (err,fetchedProducts){    // this err will run when you are doimng some mistake in fetching client data
    if(fetchedProducts){
        const products = JSON.parse(fetchedProducts)  //converting whatever string  we get into array. 

        return res.status(200).send({products , redis:true}); //this is to check whether i am getting data from redis or from mongodb;if from redis it is true else i will retun redis:false;
        //if i delete the DEL products from redis  and then i do GET products it will show nil and now if i send get request in the postman it will show redis :false as redis is empty s now exress will pull data from database itself;
    }else {
        try{
            const products = await Product.find().lean().exec(); 
         client.set("products" , JSON.stringify(products));
         return res.status(200).send({products, redis:false});

        }catch(err){
            return res.status(500).send({message:err.message});
        }
         
    }
})

    }
    catch(err){
        return res.status(500).send({message:err.message})
    }
});

router.get("/:id", async(req,res)=>{
    try{
        client.get(`products.${req.params.id}` , async function(err,fetchedProducts){
            if(fetchedProducts){
                const products = JSON.parse(fetchedProducts);
                return res.status(200).send({products , redis:true});
            } else {
                try{
                    const products =  await Product.findById(req.params.id).lean().exec();
                    client.set(`products.${req.params.id}`,JSON.stringify(products));
                    return res.status(200).send({products, redis:false});
                }catch(err){
                    return res.status(500).send({message:err.message})
                }
              
            }
        })
const product = await Product.findById(req.params.id);
return res.status(201).send(product);
    }catch(err){
        return res.status(500).send({message:err.message});
    }
});


router.patch("/:id", async(req,res)=>{
    try{
const product = await Product.findByIdAndUpdate(req.params.id, req.body, {new:true,
})

const products = await Product.find().lean().exec();
client.set(`products.${req.params.id}`, JSON.stringify(product));
client.set("products", JSON.stringify(products));
return res.status(201).send(product);
    }catch(err){
        return res.status(500).send({message:err.message});
    }
});

router.delete("/:id", async(req,res)=>{
    try{
const product = await Product.findByIdAndDelete(req.params.id)

const products = await Product.find().lean().exec();
client.del(`products.${req.params.id}`);
client.set("products",JSON.stringify(products));
return res.status(201).send(product);
    }catch(err){
        return res.status(500).send({message:err.message});
    }
});





module.exports = router;