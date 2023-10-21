const path = require('path');
require('dotenv').config();

const sequelize = require('../model/sequelize');
const {User,Expense} = require('../model/database');


const SequelizeService = require('../services/sequelizeService');




//For showing expense page
exports.getData= (req,res,next)=>{
    res.status(200).sendFile(path.join(__dirname,'../','public','expense.html'));

};







exports.getExpenseData = async (req,res,next)=>{
   
    let id = req.userID;
    let page = Number( req.params.page);
    let limit = Number(req.query.limit);
    
    try{

        const user = await SequelizeService.FindAllService(Expense,{
            offset: (page-1)*limit,
            limit: limit,
            where:{
                userId:id
            }
        });
        let count = await SequelizeService.CountService(Expense,{
            where: {
                userId: id
            }
        });
        count = Math.ceil(count/limit);
        let obj = {
            count: count,
            page: page
        }
  
        if(user){
            res.send({user: user,obj:obj});
        }
        else{
            res.send('fail');
        }
    
    }catch(err){
        console.error(err);
    }


};






exports.postData = async (req,res,next)=>{
    let {amount,description,category} = req.body;
    const t = await sequelize.transaction();

    if(amount.length>0 && description.length>0 && category.length>0){
        let id = req.userID;
        try{

            //updating expense table
            const expense = await SequelizeService.CreateService(Expense,
                {
                    amount:amount,
                    description:description,
                    category: category,
                    userId : id,
                   
                },
                { transaction: t}
            )
            if(expense){
                res.send('success from postData');
                console.log('success from postData');
                
            }
            else{
                res.send('expense/postData error');
                console.log('expense/postData error');
            }


            //updating user table
            let user = await SequelizeService.FindOneService(User,{
                attributes: ['id','total_expense'],
                where:{
                    id: id
                }
                
            })


            let ex = Number(user.total_expense)  + Number(amount);

            let update = await SequelizeService.UpdateService(User,{
                total_expense: ex
            },{
                where: {
                    id: id
                },
               transaction: t
                
            })

            if(update){
               await t.commit();
            }

        }catch(err){
            console.error(err);
            await t.rollback();
        }

    }
};







exports.deleteData = async (req,res,next)=>{
    let id = req.userID;
    let entry = req.params.id;
    const t = await sequelize.transaction();
    try{

        //for getting amount from Expense table
        let data  = await SequelizeService.FindOneService(Expense,{
            attributes:['amount'],
            where:{
                userId:id,
                id:entry
            }
            });

            
        //for getting total-expense from user table
        let data2 = await SequelizeService.FindOneService(User,{
            attributes: ['total_expense'],
            where: {
                id: id
            }
        })

        let amount = Number(data2.total_expense) - Number(data.amount);

        //for updating total-expense in user table
        const user = await SequelizeService.UpdateService(User,{
            total_expense: amount
        },{
            where:{
                id: id
            },
            transaction:t
        })
        
        //for deleting data from expense table
        const user2 = await SequelizeService.DeleteService(Expense,{
            where:{
                userId:id,
                id:entry
            },
            transaction:t
        });

        if(user){
            res.send('success');
            
        }else{
            res.send('fail');
        }

        await t.commit();

    }
    catch(err){
        console.error(err);
        await t.rollback();
    
    };


};







