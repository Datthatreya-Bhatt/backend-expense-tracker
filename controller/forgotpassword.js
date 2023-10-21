const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {v4: uuid } = require('uuid');
require('dotenv').config();

const sequelize = require('../model/sequelize');
const {User,FPR} = require('../model/database');

const SequelizeService = require('../services/sequelizeService');
const SendinBlueService = require('../services/SendinBlueService');






//For showing forgotpassword page
exports.getforgotpasswordPage = (req,res,next)=>{
    res.status(200).sendFile(path.join(__dirname,'../','public','forgotpassword.html'));

};





//For sending email
exports.getEmail = async (req,res,next)=>{
    const t = await sequelize.transaction();
    let uid = uuid();
    let email = req.body.email;
    

    try{
        let user = await SequelizeService.FindOneService(User,{
            attributes: ['id','email'],
            where: {
                email: email
            }

        })

        if(user){
            console.trace(user.id,user);
            let data = await SequelizeService.CreateService(FPR,{
                id: uid,
                userId: Number(user.id),
                isActive: true 

            },{transaction: t})

            let mail = await SendinBlueService.SibService(email,uid);
        
            res.send('success');
       
         }

    await t.commit();
    }catch(err){
        await t.rollback();
        console.trace('line 88',err);
    }

};





exports.getResetPage = async(req,res,next)=>{
    let uid = req.params.id;

    try{
        let data = await SequelizeService.FindOneService(FPR,{
           attributes: ['id','isActive'],
            where: {
                id: uid,
                isActive: 1
               
            }
        })
        console.trace(uid,data);
        if(data != null && data.isActive){
            res.status(200).sendFile(path.join(__dirname,'../','public','resetpassword.html'));
        }else{
            res.send('cannot find emailll');
        }
    }catch(err){
        console.trace(err);
    }


};





exports.postResetPas = async(req,res,next)=>{
    let uid = req.params.id;
    let password = req.body.password;
    let t = await sequelize.transaction();

    try{
        let data = await SequelizeService.FindOneService(FPR,{
            attributes: ['id','userId','isActive'],
            where: {
                id: uid,
                isActive: true
            }
        })
        
        if(data.isActive){
            try{
                let fpr = await SequelizeService.UpdateService(FPR,{
                    isActive: false
                },{
                    where: {
                        id: uid
                    },
                    transaction: t
                })




                //creating new user
                
                let hash = await bcrypt.hash(password,Number(process.env.SALT_ROUND));
                
                console.trace(hash);
                
                try {
                    let user = await SequelizeService.UpdateService(User,{
                        password: hash
                    },{
                        where: {
                            id: data.userId
                        },
                        transaction: t
                    })
                    console.trace(user,user[0]);
                    if(user){
                        let id = user[0];
                        let token = jwt.sign({id:id},process.env.JWT_S_KEY);
                        res.status(201).send(token);
                        console.trace(user);
                    }
                 } catch (err) {
                    console.trace(err);
                    
                 }





            }catch(err){
                console.trace(err);
            }
        }
    await t.commit();
    }catch(err){
        await t.rollback();
        console.trace(err);
    }
};