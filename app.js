const express = require('express');
const database = require('./database');
const getData = require('./getData');
const session = require('express-session');
const { request } = require('express');
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

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

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
    let sql="CREATE TABLE account(id int AUTO_INCREMENT, username varchar(50), password varchar(50), firstname varchar (50), lastname varchar (50), birthday date, PRIMARY KEY (id))";
    database.query(sql,(err,result)=>{
        if(!err){
            res.send("successfully created account table");
        }
        else{
            res.send("failed to create account table");
        }
    });
});


app.get("/drop-account-table", (req,res)=>{
    let sql = "DROP TABLE account";
    database.query(sql,(err,result)=>{
        if(!err){
            res.send("successfully dropped account table");
        }
        else{
            res.send("failed to drop account table");
        }
    });
})



app.post('/login', (req,res)=>{
    
    var username = req.body.username;
    var password = req.body.password;

    var sql = `SELECT username, password FROM account where username = "${username}" AND password = "${password}"` ;
    database.query(sql,(err,result)=>{
        if(!err){
            if(result.length > 0) {
                console.log(result);
                req.session.loggedin = true;
                req.session.username = username;
                req.session.password = password;

                res.redirect("/index");
                
            }
            else {
                res.send("No account found");
            }
          
        }
        else{
            throw err;
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





app.post('/edit_grades',(req,res)=>{
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var grades = req.body.grades;

    var sql = `UPDATE student SET grade ="${grades}" where firstname = "${firstname}" AND lastname = "${lastname}"`;
    database.query(sql,(err,result)=>{
        if(!err){
            console.log("successfully updated student grade");
            res.redirect("/grades");
        }
        else{
            throw err;
        }
    });
  
});

app.post('/edit_profile',(req,res)=>{
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var password = req.body.password;
    var birthday = req.body.birthday;
    var id = req.body.id;


    var sql = "SELECT * FROM account";
    database.query(sql,(err,result)=>{
        if(!err){
            for(var i =0; i<result.length;i++){
                if(email == result[i].email && password == result[i].password){
                    console.log("found an account");
                    
                    var sql2 = `UPDATE account SET email = "${email}, password = "${password}"`;
                    var sql3 = `UPDATE profile SET firstname = "${firstname}", lastname="${lastname}", email = "${email}", password= "${password}", birthday = "${birthday}", id = "${id}"`;

                    database.query(sql2,(err,result)=>{ 
                        if(!err){   
                            console.log("updated account table");
                        }
                        else{
                            throw err;
                        }
                    });

                    database.query(sql3,(err,result)=>{
                        if(!err){
                            console.log("updated profile table");
                        }
                        else{
                            throw err;
                        }
                    });
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

    if(req.session.loggedin) {


        let sql = `SELECT id, firstname, lastname, birthday from account WHERE username = "${req.session.username}" AND password = "${req.session.password}"`;
        database.query(sql,(err,result)=>{
            if(!err){ 
            res.render('index', { email : req.session.username, password: req.session.password, id: result[0].id, firstname: result[0].firstname, lastname: result[0].lastname, birthday: result[0].birthday });
                
               
            }
            else{
                throw err;
            }
        });

        
    }
    else{
        res.send('Please log in to view the page');
    }
    
   
    
    
});

app.get('/grades', (req,res)=>{
    let sql = "SELECT * FROM student";

    database.query(sql,(err,result)=>{
        if(!err){
            res.render('grades', {students:result});

        }
        else{
            throw err;
        }
    });
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