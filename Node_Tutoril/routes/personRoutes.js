const express = require('express')
const router = express.Router()
const Person = require("../models/Person");
const {jwtAutMiddleware,generateToken} = require("../jwt")

router.post('/signup', async(req, res) => {
       try{
         const data = req.body
     
         const newPerson = new Person(data)
         
         const response = await newPerson.save();
         // res.send(newPerson)
         console.log('data saved');
         const token = generateToken(response.username);
         console.log("token is: " , token);
         res.status(200).json({response : response, token : token});
       }
       catch(err){
         console.log(err);
         res.status(500).json({error : 'Internal  server error'});
       }
       
})
router.get('/', async(req, res) => {
       try{
         const data = await Person.find();
         res.status(200).json(data);
       }
       catch(err){
         console.log(err);
         res.status(500).json({error : 'Internal  server error'});
       }
       
})
router.get('/:worktype', async(req, res) => {
       try{
         const worktype = req.params.worktype;
         if(worktype == 'chef' || worktype == 'waiter' || worktype == 'manager'){
           const response = await Person.find({work:worktype});
           res.status(200).json(response);
         }
         else{
           res.status(400).json({error : "invalid"});
         }
         
       }
       catch(err){
         console.log(err);
         res.status(500).json({error : 'Internal  server error'});
       }
       
})
router.put('/:id',async(req,res) => {
       try {
              const personId = req.params.id;
              const updatePersonData = req.body;

              const response = await Person.findByIdAndUpdate(personId,updatePersonData,{
                     new:true,
                     runValidators:true,
                     
              })
              if(!response){
                     return res.status(404).json({error : "not a valid server"}) 
              }
              res.status(200).json(response);

       } catch (error) {
              res.send(500).json({error : "not a valid server"})
       }
})
router.delete('/:id',async(req,res) => {
       try {
              const personId = req.params.id;
             
              const response = await Person.findByIdAndRemove(personId)
              if(!response){
                     return res.status(404).json({error : "not a valid server"}) 
              }
              res.status(200).json({message : "person mar gaya"});

       } catch (error) {
              res.send(500).json({error : "not a valid server"})
       }
})
module.exports = router