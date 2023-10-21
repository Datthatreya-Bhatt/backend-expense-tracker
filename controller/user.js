const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const sequelize = require('../model/sequelize');
const {User,Orders} = require('../model/database');


const SequelizeService = require('../services/sequelizeService');




//For showing signup page
exports.signup = (req,res,next)=>{
    res.status(200).sendFile(path.join(__dirname,'../','public','signup.html'));
};





exports.postData = async(req,res,next)=>{
    const t = await sequelize.transaction();

    const {name,email,password} = req.body;

    //to check if all the inputs are filled
    if(name.length>0 && email.length>0 && password.length>0){
        //To check if email exists
        try {
            const user = await SequelizeService.FindOneService(User, {
                where: {
                  email: email,
                },
                attributes: ['email'],
              });

            if (user) {
                res.send('fail');
                
            }
            else {

                console.log('No user found with the input email');

                //creating new user
                bcrypt.hash(password,Number(process.env.SALT_ROUND),async(err,hash)=>{
                    if(err){
                        console.trace('enryption error',err);
                    }
                    else{
                        try {
                            
                            const user = await SequelizeService.CreateService(User,{
                              name: name,
                              email: email,
                              password: hash,
                              total_expense: 0.00,
                            },{transaction: t
                            });
                        
                            if(user){
                                res.send('success');
                                await t.commit();
                            }

                        } catch (error) {
                            await t.rollback();
                            console.trace('Error creating user:', error);
                        }
                    }  
              
                });
                //
            }
            
        } catch (error) {
        console.trace(error);
        }
    }else{
        res.send('length');
    }        
};





//to show login page for old users
exports.getlogin = (req,res,next)=>{
    res.status(201).sendFile(path.join(__dirname,'../','public','login.html'));
};





isPremium = async(req,res,next)=>{
    let id = req.userID;
    try{

        let data = await SequelizeService.FindOneService(Orders,{
            where:{
                userId: id,
                status: 'SUCCESS'
            }
        })

        if(data){
            return true;
            
        }else{
            console.log('NOT A PREMIUM USER');
            return false
        }


    }catch(err){
        console.error(err);
    }
};





//to validate login page
exports.postlogin = async(req,res,next)=>{
    const {email,password} = req.body;
    
    //to check password and email

    try{
        const user = await SequelizeService.FindOneService(User,{
            where:{
                email: email 
            }
        })

        if(user){
            let hash = user.dataValues.password;
            bcrypt.compare(password,hash,async(err,result)=>{
               if(result){
  
                    let id = user.dataValues.id;
                    let token = jwt.sign({id:id},process.env.JWT_S_KEY);

                    req.userID = id;
                    
                    let ispremium = await isPremium(req,res);
                   
                    res.status(201).send({token: token, ispremium: ispremium});
                    
               }
               else if(err){
                console.log(err);
               }
               else{
                
                    res.send('incorrect');
               }
            });
        }
        else if(user === null){
             res.send('incorrect');
        }
        else{
            res.send('error');
            console.trace(err);
        }


    }catch(err){
        console.trace('first try block error',err);
    }



            
};