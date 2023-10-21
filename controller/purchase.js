require('dotenv').config();

const sequelize = require('../model/sequelize');
const {Orders} = require('../model/database');

const SequelizeService = require('../services/sequelizeService');
const razorpayService = require('../services/razorpayService');



exports.getPurchase = async(req,res,next)=>{
    const t = await sequelize.transaction();

    try {
        const amount = 99999;

        const order = await razorpayService.createOrder(amount);

        res.status(201).send(order);

        //creating the order table

        const data = await Orders.create({
            paymentid: "No id now",
            orderid: order.id,
            status: "pending",
            userId: req.userID,
            
        },{transaction: t}
        )

        await t.commit();

    } catch (err) {
        await t.rollback();
        console.trace(err);
    }


};







exports.postSuccess = async(req,res,next)=>{
    let order_id = req.body.res.razorpay_order_id;
    let payment_id = req.body.res.razorpay_payment_id;
    const t = await sequelize.transaction();

    try{

        let data = await SequelizeService.UpdateService(Orders,{
            orderid: order_id,
            paymentid: payment_id,
            status: 'SUCCESS',
            userId: req.userID,
            
        },{
            where:{
                orderId: order_id
            },
            transaction: t
        })

        if(data){
            res.send('task complete');
            await t.commit();
        }
        

    }catch(err){
        console.trace(err);
        await t.rollback();
    }
    
};





exports.postFailed = async(req,res,next)=>{
    let order_id = req.body.res.error.metadata.order_id;
    let payment_id = req.body.res.error.metadata.payment_id;

    const t = await sequelize.transaction();

    try{
        let data = await SequelizeService.UpdateService(Orders,{
            orderid: order_id,
            paymentid: payment_id,
            status: 'FAILED',
            userId: req.userID,
          
            },
            {
            where:{
                orderid: order_id
            },
            transaction: t
        }) 

        
        if(data){
            console.log('post failed line 121', data);
            res.send('task complete');
            await t.commit();
        }else{
            console.log('error in post failed line 124');
        }

    }catch(err){
        console.trace(err);
        await t.rollback();
    }

    

};



