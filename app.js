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
    let sql = `INSERT INTO account(username, password,firstname,lastname, birthday) VALUES("catherinebautista@gmail.com", "123", "Catherine", "Bautista", "2000-03-12")`;
    database.query(sql,(err,result)=>{
        if(!err){
            console.log("successfulyl created new account");
        }
        else{
            throw err;
        }
    });
});


app.get("/create-class-table",(req,res)=>{
    let sql = "CREATE TABLE class (class_id varchar(50), account_id int, firstname varchar(50), lastname varchar(50), section varchar(50), year_level int, grade int, attendance DOUBLE,FOREIGN KEY (account_id) REFERENCES account(id))";

    database.query(sql,(err,result)=>{
        if(!err){
            res.send("successfully created class table");
        }
        else{
            res.send("failed to create class table");
        }
    })
});


app.get("/create-grades-table",(req,res)=>{
    let sql = "CREATE TABLE grades (account_id int, firstname varchar(50), lastname varchar(50), class_id varchar(50), section varchar(50),activity_name varchar(50), activity_grade int,FOREIGN KEY(account_id) REFERENCES account(id))";

    database.query(sql,(err,result)=>{
        if(!err){
            res.send("successfully created grades table");
        }
        else{
           throw err;
        }
    })
});


app.get("/create-schedule-table",(req,res)=>{
    let sql = "CREATE TABLE schedule (schedule_id int AUTO_INCREMENT,class_id varchar(50), section varchar(50),schedule_name varchar(50), schedule_date date, PRIMARY KEY(schedule_id))";

    database.query(sql,(err,result)=>{
        if(!err){
            res.send("successfully created schedule table");
        }
        else{
           throw err;
        }
    })
});

app.get("/insert-schedule",(req,res)=>{
    let sql = `INSERT INTO schedule(class_id, section, schedule_name, schedule_date) VALUES("ENGLISH101", "3ISB", "Homework 1", "2022-07-11")`;

    database.query(sql,(err,result)=>{
        if(!err){
            res.send("successfully inserted new schedule");
        }
        else{
           throw err;
        }
    });
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
   
    let sql = `INSERT  INTO class(class_id,account_id, firstname, lastname, section, year_level, grade,attendance) VALUES('ENGLISH101', 1, 'Reigner', 'Lastimosa','3ISA',7, 90, 87)`;
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


app.get("/insert-grades",(req,res)=>{
    let sql = `INSERT INTO grades(account_id,firstname,lastname,class_id,section, activity_name, activity_grade) VALUES(3, "Catherine", "Bautista", "MATH101", "3ISC", "Homework 2", 92)`;


    database.query(sql,(err,result)=>{
        if(!err){
            res.send("successfully inserted new grades");
        }
        else{
           throw err;
        }
    });
});

app.post('/search_grades',(req,res)=>{

    let search = req.body.search;

    database.query('SELECT * FROM grades WHERE firstname LIKE ? OR lastname LIKE ?', ['%'+search+'%', '%'+search+'%'], (err,result)=>{
        if(!err){
            console.log("successfully searched student grade");
            res.render("grades",{students:result})

        }
        else{
            throw err;
        }
    });
});



app.post('/edit_grades',(req,res)=>{
    let account_id = req.body.hidden;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let class_id = req.body.class;
    let section = req.body.section;
    let activity = req.body.activity;
    let grades = req.body.grades;

    let sql = `UPDATE grades SET firstname ="${firstname}", lastname = "${lastname}", class_id = "${class_id}", section = "${section}", activity_name = "${activity}", activity_grade = "${grades}" where account_id = "${account_id}"`;

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

app.post('/delete_grades',(req,res)=>{
    let account_id = req.body.hidden;

    database.query('DELETE FROM grades WHERE account_id = ?', account_id, (err,result)=>{
        if(!err){
            console.log("successfully deleted student grade");
            res.redirect("grades");
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
        let sql = "SELECT * FROM grades";

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

function getAnnouncement(req,res,next){
    let sql = `SELECT class_id from class WHERE account_id = ${req.session.account_id}`;
    database.query(sql,(err,result)=>{
        if(!err){
            
            req.session.classes = [];
            for(var i = 0; i<result.length;i++){
                
                
                req.session.classes.push('"'+result[i].class_id+ '"');

                console.log(req.session.clasess);
            }

            next();
        }
        else{
            throw err;
        }
    });
};

app.get('/announcement', getAnnouncement,(req,res)=>{
    if(req.session.loggedin) {
        let sql = `SELECT class_id, announcement_title, announcement_body, announcement_date from announcement where class_id IN (${req.session.classes})`;
        database.query(sql,(err,result)=>{
            if(!err){
                console.log(result);
             res.render("announcement",{announcements:result});
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

app.get("/class/:id/:section/students",(req,res)=>{
    let sql = `SELECT firstname, lastname, section, year_level, attendance FROM class WHERE class_id ="${req.params.id}"`;
    database.query(sql,(err,result)=>{
        if(!err){
            console.log(result);
            res.render("student", {title:req.params.id,students:result, section:req.params.section})
        }
        else{
            throw err;
        }
    });
});



app.get('/schedule',getAnnouncement, (req,res)=>{
    if(req.session.loggedin) {
        let sql = `SELECT class_id, section, schedule_name, schedule_date FROM schedule WHERE class_id IN (${req.session.classes})`;
        database.query(sql,(err,result)=>{
            if(!err){
                console.log(result);
                res.render("schedule", {schedules:result});
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


app.listen(PORT, ()=>{
    console.log("Listening to port 26...")
});