
exports.FindOneService = async (database,obj)=>{
    try{

        let res = await database.findOne(obj);
        return res;
    }
    catch(err){
        console.trace(err);
        return err;
    }
}


exports.FindAllService = async (database,obj) =>{
    try{

        
        let res = await database.findAll(obj);
        return res;
    }
    catch(err){
        console.trace(err);
        return err;
    }
};


exports.CreateService = async (database,obj)=>{
    try{

        let res = await database.create(obj);
        return res;
    }
    catch(err){
        console.trace(err);
        return err;
    }
}


exports.CountService = async (database,obj)=>{
    try{

        let res = await database.count(obj);
        return res;
    }
    catch(err){
        console.trace(err);
        return err;
    }

}

exports.UpdateService = async (database,obj,obj2)=>{
    
    try{

        let res = await database.update(obj,obj2);
        return res;
    }
    catch(err){
        console.trace(err);
        return err;
    }
}



exports.DeleteService = async (database,obj)=>{

    try{

        let res = await database.destroy(obj);
        return res;
    }
    catch(err){
        console.trace(err);
        return err;
    }
};