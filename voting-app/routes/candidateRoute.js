const express = require('express');
const router = express.Router();
const Candidate = require('../models/candidate');
const User = require('../models/user');
const {jwtAuthMiddleware,generateToken} = require ('../jwt')

const checkAdmin =  async (userId) => {
       try {
              const user = await User.findById(userId);
             
              if((user.role === 'admin')){
                      return true;
              }
       } catch (error) {
              return false;
       }
}

router.post ('/' ,jwtAuthMiddleware, async(req,res) =>{
       try {
              const data = req.body;
              if(!(checkAdmin(req.userId))){
                     return res.status(403).json({message : "user has not admin role"});
              }
              const newCandidate= new Candidate(data);
              const response = await newCandidate.save();
              res.status(200).json({response : response});
       } catch (error) {
              console.log(error);
              res.status(500).json({error : 'Internal server error'});
       }
})

router.put('/:candidateId' ,jwtAuthMiddleware,async(req,res) => {
       try {
              if(!(checkAdmin(req.userId))){
                     return res.status(403).json({message : "user has not admin role"});
              }
              const candidateId = req.params.candidateId;
              const updateCandidateData = req.body
              const response = await Candidate.findByIdAndUpdate(candidateId,updateCandidateData,{
                     new : true,
                     runValidators:true
              })
              if(!response){
                     return res.status(404).json({error : "candidate not found"});
              }
               console.log("candidate data update")
              res.status(200).json({response});
       } catch (error) {
              console.log(error);
              res.status(500).json({error : "internal server error"});
       }
})
router.delete('/:candidateId' ,jwtAuthMiddleware,async(req,res) => {
       try {
              if(!checkAdmin(req.userId)){
                     return res.status(403).json({message : "user has not admin role"});
              }
              const candidateId = req.params.candidateId;
              const response = await Candidate.findByIdAndDelete(candidateId)
              if(!response){
                     return res.status(404).json({error : "candidate not found"});
              }
               console.log("candidate deletes")
              res.status(200).json({response});
       } catch (error) {
              console.log(error);
              res.status(500).json({error : "internal server error"});
       }
})

router.post('/vote/:candidateId' , jwtAuthMiddleware , (req,res) => {
       const candidateId = req.params.candidateId;
       userId = req.userId;
       
})

module.exports = router;