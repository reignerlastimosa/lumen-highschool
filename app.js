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
    let sql="CREATE TABLE account(id int AUTO_INCREMENT, username varchar(50), password varchar(50), firstname varchar (50), lastname varchar (50), birthday date, role varchar(50), PRIMARY KEY (id))";
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

app.get("/insert-account",(req,res)=>{
    let sql = `INSERT INTO account(username, password,firstname,lastname, role, section) VALUES("reignerlastimosa@gmail.com", "123", "Reigner", "Lastimosa", "admin", "3ISA"`;
})


app.get("/create-class-table",(req,res)=>{
    let sql = "CREATE TABLE class (class_id varchar(50), account_id int, section varchar(50), year_level int, FOREIGN KEY (account_id) REFERENCES account(id))";

    database.query(sql,(err,result)=>{
        if(!err){
            res.send("successfully created class table");
        }
        else{
            res.send("failed to create class table");
        }
    })
});


app.get("/create-lesson-table",(req,res)=>{
    let sql = "CREATE TABLE lesson (lesson_id int AUTO_INCREMENT, class_id varchar(50), lesson_name varchar(50), lesson_description varchar(50), section varchar(50), PRIMARY KEY (lesson_id))";

    database.query(sql,(err,result)=>{
        if(!err){
            res.send("Successfully created lesson table");
        }
        else{
            throw err;
        }
    });
});


app.get("/create-announcement-table",(req,res)=>{
    let sql = "CREATE TABLE announcement (announcement_id int AUTO_INCREMENT, class_id varchar(50), announcement_title varchar(50), announcement_body varchar(200), announcement_date date, section varchar(50), PRIMARY KEY (announcement_id))";

    database.query(sql,(err,result)=>{
        if(!err){
            res.send("Successfully created announcement table");
        }
        else{
            throw err;
        }
    });
});


app.get("/class/:id/:section/add-lesson",(req,res)=>{
    let sql =`INSERT INTO lesson(class_id, lesson_name, lesson_description, section) VALUES("${req.params.id}","MEASURE OF CENTRAL TENDENCY", "Recalling Mean, median and mode","${req.params.section}")`;
    database.query(sql,(err,result)=>{
        if(!err){
            console.log("successfully inserted new lesson");
        }
        else{
            throw err;
        }
    });
});


app.get("/class/:id/:section/add-announcement",(req,res)=>{
    

    let sql =`INSERT INTO announcement(class_id, announcement_title, announcement_body, announcement_date,section) VALUES("${req.params.id}","HOMEWORK #1", "Please answer your homework #1 at page 34.", "2022-06-29","${req.params.section}")`;
    database.query(sql,(err,result)=>{
        if(!err){
            console.log("successfully inserted new announcement");
        }
        else{
            throw err;
        }
    });
});





app.get("/add-class-account",(req,res)=>{
   
    let sql = `INSERT  INTO class(class_id,account_id, section, year_level) VALUES('STATS101', 1,'3ISA',7)`;
    database.query(sql,(err,result)=>{
        if(!err){

          
            console.log(result);
        }
        else{
            throw err;
        }
    })
});



app.post('/login', (req,res)=>{
    
    var username = req.body.username;
    var password = req.body.password;

    var sql = `SELECT id, username, password FROM account where username = "${username}" AND password = "${password}"` ;
    database.query(sql,(err,result)=>{
        if(!err){
            if(result.length > 0) {
                console.log(result);
                req.session.loggedin = true;
                req.session.username = username;
                req.session.password = password;
                req.session.account_id = result[0].id;
                
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

app.post('/edit_account',(req,res)=>{
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var password = req.body.password;
    
    


    var sql = `UPDATE account SET firstname = "${firstname}", lastname = "${lastname}", username="${email}", password="${password}"  WHERE id = ${req.session.account_id}`;
    
    database.query(sql,(err,result)=>{
        if(!err){
            console.log("successfully updated account table");
            res.redirect("/index");
        }
        else{
            throw err;
        }
    })
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
    if(req.session.loggedin) {
        let sql = "SELECT * FROM student";

        database.query(sql,(err,result)=>{
            if(!err){
                res.render('grades', {students:result});
    
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

app.get('/announcement', (req,res)=>{
    if(req.session.loggedin) {
        res.render('announcement');   
    }
    else{
        res.send('Please log in to view the page');
    }
   
});




app.get('/class', (req,res)=>{
    if(req.session.loggedin) {
        let sql = `SELECT class_id, year_level, section FROM class WHERE account_id = ${ req.session.account_id}`;

        database.query(sql,(err,result)=>{
            if(!err){
                res.render('class', {classes:result});
                console.log(result);
    
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


app.get('/class/:id/:section', (req,res)=>{
    let sql =`SELECT lesson_name, lesson_description FROM lesson WHERE class_id = "${req.params.id}" AND section = "${req.params.section}"`;
    database.query(sql,(err,result)=>{
        if(!err){
            
            res.render("lesson", {title: req.params.id, lessons:result, section:req.params.section});
        }
        else{
            throw err;
        }
    });
    

   
});


app.get('/class/:id/:section/announcement_class', (req,res)=>{
    let sql =`SELECT announcement_title, announcement_body, announcement_date FROM announcement WHERE class_id = "${req.params.id}" AND section = "${req.params.section}"`;
    database.query(sql,(err,result)=>{
        if(!err){
            
            res.render("announcement_class", {title: req.params.id, announcements:result, section:req.params.section});
        }
        else{
            throw err;
        }
    });
    

   
});



app.get('/schedule', (req,res)=>{
    if(req.session.loggedin) {
        res.render('schedule'); 
    }
    else{
        res.send('Please log in to view the page');
    }
  
});


app.listen(PORT, ()=>{
    console.log("Listening to port 26...")
});