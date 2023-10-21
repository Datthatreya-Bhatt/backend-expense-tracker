
exports.FindOneService = async (database,obj)=>{
    let res = await database.findOne(obj);
    return res;
};



exports.FindAllService = async (database,obj) =>{
    let res = await database.findAll(obj);
    return res;
};


exports.CreateService = async (database,obj)=>{
    let res = await database.create(obj);
    return res;
}


exports.CountService = async (database,obj)=>{
    let res = await database.count(obj);
    return res;
}

exports.UpdateService = async (database,obj,obj2)=>{
    let res = await database.update(obj,obj2);
    return res;
}



exports.DeleteService = async (database,obj)=>{
    let res = await database.destroy(obj);
    return res;
};