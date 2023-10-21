const path = require('path');
require('dotenv').config();

const sequelize = require('../model/sequelize');
const {User, DownloadedFile,Expense} = require('../model/database');


const SequelizeService = require('../services/sequelizeService');
const s3Service = require('../services/s3Service');





//For showing premium expense page
exports.getPremiumPage = (req,res,next)=>{
    res.status(200).sendFile(path.join(__dirname,'../','public','premium.html'));

};





//to send leaderboard page
exports.getLeaderboardPage = (req,res,next)=>{
  res.status(200).sendFile(path.join(__dirname,'../','public','leaderboard.html'));

};





//to send leaderboard data
exports.getLeaderBoard = async(req,res,next)=>{
  let page = Number( req.params.page);
  let limit = Number(req.query.limit);
  
  try{

    let leaderBoard = await SequelizeService.FindAllService(User,{
      attributes:['name','total_expense'] ,
      offset: (page-1)*limit,
      limit: limit,
      order: [['total_expense', 'DESC']]
    });
    
  
    let count = await SequelizeService.CountService(User);

    //console.trace(leaderBoard, count);
    
    count = Math.ceil(count/limit);
    let obj = {
        count: count,
        page: page
    }

    if(leaderBoard){    
      res.send({user: leaderBoard, obj: obj });
    }
    else{
      res.send('fail');
    }

  }catch(err){
    console.error(err);
  }
  
};






exports.downloadExpense = async(req,res,next)=>{
  let t = await sequelize.transaction();

    try{
		    
        let id = req.userID;
        const user = await SequelizeService.FindAllService(Expense,{
            where:{
                userId:id
            }
        });

        if(user){
          let stringyfy = JSON.stringify(user);
          let filename = `Expense${id}-${new Date()}.txt`;
          let fileUrl = await s3Service.uploadToS3(stringyfy,filename);
 
          let link1 = await SequelizeService.CreateService(DownloadedFile,{
          userId: id,
          links: fileUrl.Location
          },
          {transaction: t
          })

          console.trace(link1);
          res.send(fileUrl.Location); 

        }
    
    await t.commit();
    }catch(err){
        await t.rollback();
        console.trace(err);
        res.send(err);
    }


};





//to send downloaded file data
exports.downloadList = async(req,res,next)=>{
  
  let id = req.userID;
  let page = Number( req.params.page);
  let limit = Number(req.query.limit);
  
  

  try{
    let list = await SequelizeService.FindAllService(DownloadedFile,{
      attributes: ['userId','links'],
      offset: (page-1)*limit,
      limit: limit,
      where: {
        userId: id
      }
    })

    let count = await SequelizeService.CountService(DownloadedFile,{
      where: {
          userId: id
      }
    });

    count = Math.ceil(count/limit);
    let obj = {
        count: count,
        page: page
    }

    if(list){
      res.send({user: list, obj: obj });
    }
    else{
      res.send('fail');
    }
    
  }catch(err){
    console.trace(err);
  }


}





//to send downloaded file page
exports.getDownloadedListPage = (req,res,next)=>{
  res.status(200).sendFile(path.join(__dirname,'../','public','downloadlist.html'));

};




