'use strict';

//import all packages that we need
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');

//save all methodes inside express 
const server = express();
//open backend server to recieve all requests
server.use(cors());

//parse any requested data by axios.post
server.use(express.json());

//define the port of this backend server
const PORT = process.env.PORT;

//start listining on this port, be ready to recieve any request
server.listen(PORT, () => {
    console.log(`I\'m listening on PORT ${PORT}`);
});


//get this request if the route was '/'
server.get('/', proofOfLif);
function proofOfLif(req, res) {
    console.log('home server route');
    let x = 'home server route';
    res.send(x);
}

//connect mongo with express server locally
mongoose.connect('mongodb://localhost:27017/news',
    { useNewUrlParser: true, useUnifiedTopology: true });


// create categ schema

const CategorySchema = new mongoose.Schema({
    sports: Boolean,
    business: Boolean,
    technology: Boolean,
    general: Boolean,
    health: Boolean,
    science: Boolean,

});

const ArticleSchema = new mongoose.Schema({
    index : Number,
    categName : String,
    name: String,
    urlToImage: String,
    title: String,
    description: String,
    url: String,
    publishedAt: String,

})

// create user  schema
const UserSchema = new mongoose.Schema({
    
    email : {type: String,
        // index: true,
        unique: true, // Unique index. If you specify `unique: true`
        // specifying `index: true` is optional if you do `unique: tr
    } ,
    favCategory : [CategorySchema],
    favArticle: [ArticleSchema]

});

// create user model 
const UserModel = mongoose.model('usercollection',UserSchema);
//define global var to store the data for the logged in user
let loggedinEmail;
let loggedinFavCategory=[];
//create model for the loggedin user
async function saveNewUserData() {
    console.log('loggedinFavCategory',loggedinFavCategory);
    console.log('loggedinEmail',loggedinEmail);
      let user1 = new UserModel({
        email: loggedinEmail,
        favCategory: loggedinFavCategory,
    });
    
    
  await  user1.save();
   
}




//get this request for favCat 

// myFavCat:{
//     sports: event.target.sports.checked,
//     business:event.target.business.checked,
//     technology:event.target.technology.checked,
//     general:event.target.general.checked,
//     health:event.target.health.checked,
//     science:event.target.science.checked,
    
//   }

//create routes to recieve requests from front-end
server.get('/favCat', favCat);
server.post('/addArticle', addArticleHandler);
server.delete('/deleteArticle/:index', deleteArticleHandler);


  function favCat(req, res) {
    const  {sports,business,technology,general,health,science,email}=req.query;
     let myFavCat=[{
    sports: sports,
    business:business,
    technology:technology,
    general:general,
    health:health,
    science:science,
    
  }]
 
   loggedinFavCategory=myFavCat;
   loggedinEmail=email;
   let flag= true;


   UserModel.findOne({ email: email }, async function (err, userData) {
    
if (userData==null){
    await saveNewUserData();
    console.log('userData.email before',userData);
    UserModel.findOne({ email: email }, function (err, userData) {
          console.log('userData.email after',userData);

           res.send(userData.favCategory);

    })






   }else{
    if (!err){
        
        userData.favCategory=myFavCat;
 
        userData.save();
       
        console.log('userData',userData.favCategory);
        
        
        res.send(userData.favCategory);
    }else{
        res.send(`${err} something wrong!`);
    
   }
}
})

}

// chosenArticleData={
//     email : this.props.auth0.user.email,
//    index : idx,
//    categName : categName,
//    name: value.source.name,
//    urlToImage:value.urlToImage,
//    title:value.title,
//    description:value.description,
//    url: value.url,
//    publishedAt:value.publishedAt,
//  }

// create addArticleHandler
function addArticleHandler(req,res){
    const  {index,categName,name,urlToImage,title,description,url,publishedAt,email}=req.body;
    // console.log(index,categName,name,urlToImage,title,description,url,publishedAt,email);
    UserModel.findOne({email:email}, (error,userData)=>{
        if (error){
            res.send('did not work !!')
        }else{
            // console.log('email',email);
            // console.log('userData',userData);
            // userData.favArticle.findOne({title:title},(error,articlesData))
            userData.favArticle.push({
                index : index,
                categName : categName,
                name: name,
                urlToImage: urlToImage,
                title: title,
                description: description,
                url: url,
                publishedAt: publishedAt,
            })
            userData.save();
            res.send(userData.favArticle);
        }
    })

}

//create deleteArticleHandler
function deleteArticleHandler (req,res){
    const  {index,categName,name,urlToImage,title,description,url,publishedAt,email}=req.query;
    console.log(index,categName,name,urlToImage,title,description,url,publishedAt,email);
    UserModel.findOne({email:email},(error,userData)=>{

        if (error){
            res.send('something wrong!!!!');
        }else{

            //   console.log('userData',userData);
            userData.favArticle.forEach((item,idx)=>{
                  console.log('item',item);

                if (item.categName==categName && index==item.index){
                   console.log('helloo from if');
                    userData.favArticle.splice(idx,1);
                }

                  
                   
              });
              console.log('userData.favArticle',userData.favArticle);
            //   userData.favArticle=newData;
              userData.save();
              res.send(userData.favArticle);
        }
    });
// console.log('req.query',req.params);

}