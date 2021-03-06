const express = require('express');
const router  = express.Router();
const {check,validationResult}= require('express-validator') 
const Profile = require('../models/Profile');
const Article = require('../models/Article');
const auth    = require('../middleware/auth')
const multer  = require('multer');
const User    = require('../models/User')


const Storage= multer.diskStorage({

   distination: function(req,file,callback){
   
   callback(null,'imgUpload/profile')
   
   },
   filename : function (req,file,callback){
   
   const ext= file.mimetype.split('/')[1];
   
   callback(null,`${file.fieldname}-${Date.now()}-${file.originalname.trim()}-${ext}`)
   }

})

const imgFilter= (req,file,callback) => {

 const ext = file.mimetype.split('/')[1];
       if(ext=== 'jpeg' || ext === 'png' || ext==='jpg'){
       
       callback(null,true)
       
       }
       else{
       callback(new error(`${ext} file not allowed`),false)
       }

}

const upload= multer({
    storage: Storage,
    fileFilter: imgFilter


})


  // *********** Method : GET
  // *********** Route :  api/profile
  // *********** Disc  :  get user profile
  // *********** access : public


router.get('/', async (req,res)=>{

      const userId= req.params.id
      try {
      const profile= await Profile.find({user: userId}).populate('user','photo name');
      
      const articles = await Article.find({author: userId}).populate('author','photo name');
      
      res.json({profile,articles});
      
      
      }
      catch(err){
      
      console.error(err.message);
      res.status(500).send('server error');
      
      }

})

  // ***********  Method :  GET
  // ***********  Route :   api/myprofile
  // ***********  Disc  :   logged in user access personal profile
  // ***********  access :  private


    router.get('/myprofile',auth, async (req,res)=>{
    
    const userId= req.user.id
    
          try{
          
            const profile= await Profile.findOne({user:userId}).populate('user','photo name');
            const articles= await Article.find({auther: userId}).populate('author','photo name');
            
            res.json({profile,articles});
        
          }
          catch(err){
          
          console.error(err.messge)
          
          res.status(500).send('server error')
          }
    
    
    });
    
    
    
    
   // ***********  Method :  post
  // ***********  Route :   api/myprofile
  // ***********  Disc  :   user create or upadate profile
  // ***********  access :  private

    
   router.post('/myprofile',  [auth,upload.single('profile'),
   [
      check('bio','Please enter bio atleast 6 letters or more').not().isLength({min: 20}),
    
   
   
   ]
   
   ],async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty){
       return  res.status(400).json({erros: errors.array()})
    }
    const {bio,facebook,twitter,github,instagram,skills}= req.body;
    
    const file = req.file
    const profileFields= {};
    
    if(bio)      profileFields.bio= bio
    if(facebook) profileFields.social.facebook = facebook;
    if(twitter)  profileFields.social.twitter  = twitter;
    if(github)   profileFields.social.github  = github;
    if(github)   profileFields.social.instagram  = instagram;
    if(skills)   profileFields.skills= skills.split(' ');
    
   
   try {
   
   // let user = await User.findOne({user:req.user.id});
    //if(!user){
    
    //return res.status(404).json({msg: 'User not found'});
   // }
    
    if(file){
   
      User.photo = file.filename
    
    
    } 
         
     //let profile = await Profile.findOne({user: req.user.id});
     
     let profile = await Profile.findOneAndUpdate({user: req.user.id},{
       $set : profileFields
     
     },{new:true,upsert:true}).populate('user', 'name  photo')

     res.json(profile)
   
   }
   catch(err){
   console.error(err.message);
   res.status(500).send('server error')
   
   }
   
   
   
   })
  
module.exports= router;
