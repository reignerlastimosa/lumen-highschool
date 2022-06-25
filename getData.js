function getData(req,res,next){
    var username = req.body.username;
    var password = req.body.password;
    console.log(username);
    console.log(password);
    next();
}


module.exports = getData;