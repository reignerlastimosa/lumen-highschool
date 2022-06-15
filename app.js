const express = require('express');
const database = require('./database');

const app = express();
const PORT = process.env.PORT || 26;


database.connect((err)=>{
    if(!err){
        console.log("Connected to mysql database at port 3306");
    }
    else{
        console.log("failed to connect at mysql...")
    }
});


app.use(express.json());

app.use(express.urlencoded());

app.use(express.static('public'));
app.use('/style',express.static(__dirname + 'public/style'));
app.use('/script',express.static(__dirname + 'public/script'));
app.use('/img',express.static(__dirname + 'public/img'));

app.set('views', __dirname + '/public/views');

app.set('view engine', 'ejs');





app.get("/create-lumen-db",(req,res)=>{
    let sql = "CREATE DATABASE lumen";
    database.query(sql,(err,result)=>{
        if(!err){
            res.send("successfulyl created Lumen's database");
        }
        else{
            res.send("failed to create Lumen database");
        }
    });
});


app.get("/create-student-table",(req,res)=>{
    let sql = "CREATE TABLE student(id int AUTO_INCREMENT, firstname varchar(50), lastname varchar(50), yearsec varchar(50), academicyear varchar(50), class varchar(50), grade varchar(50), PRIMARY KEY(id))";
    database.query(sql,(err,result)=>{
        if(!err){
            res.send("successfulyl created  student table");
        }
        else{
            res.send("failed to create student table");
        }
    });
});


app.get("/create-account-table",(req,res)=>{
    let sql="CREATE TABLE account(id int AUTO_INCREMENT, username varchar(50), password varchar(50), PRIMARY KEY (id))";
    database.query(sql,(err,result)=>{
        if(!err){
            res.send("successfully created account table");
        }
        else{
            res.send("failed to create account table");
        }
    });
});


app.post('/add-student',(req,res)=>{
    
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var occupation = req.body.occupation;
    var address = req.body.address;
    var sex = req.body.sex;
    var age = req.body.age;


    var sql = `INSERT INTO student (firstname, lastname, yearsec, academicyear, class) VALUES ("${firstname}", "${lastname}", "${yearsec}","${academicyear}", "${classname}")`;
    database.query(sql,(err,result)=>{
        if (!err){
            console.log("successfully inserted new record");
            res.redirect('/add-student');
        }
        else{
            throw err;
        }
    });
  
  
});



app.post('/login_account',(req,res)=>{
    
    var username = req.body.username;
    var password = req.body.password;

    var sql = "SELECT * FROM account";
    database.query(sql,(err,result)=>{
        if(!err){
            for(var i =0; i<result.length;i++){
                if(username == result[i].username && password == result[i].password){
                    console.log("success");
                    res.redirect("/index");
                }
                
            }
           
        }
        else{
            throw err;
        }
    });
});



app.get('/', (req,res)=>{
    res.render('login');
});

app.get('/login', (req,res)=>{
    res.render('login');
});

app.get('/index', (req,res)=>{
    res.render('index');
});

app.get('/announcement', (req,res)=>{
    res.render('announcement');
});

app.get('/class', (req,res)=>{
    res.render('class');
});

app.get('/grades', (req,res)=>{
    res.render('grades');
});

app.get('/schedule', (req,res)=>{
    res.render('schedule');
});


app.listen(PORT, ()=>{
    console.log("Listening to port 26...")
});