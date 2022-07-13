const express = require('express');
const database = require('./database');
const getData = require('./getData');
const session = require('express-session');
const { request } = require('express');
const app = express();
const multer = require('multer');
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
app.use(express.static('images'));
app.use(express.static('public'));







app.set('views', __dirname + '/public/views');

app.set('view engine', 'ejs');


const fileStorageEngine = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, './images')
    },
    filename: (req,file,cb)=>{
        cb(null, Date.now() + '_' + file.originalname)
    },
});


const lessonFiles = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./public/files');
    },
    filename:(req,file,cb)=>{
        cb(null, Date.now() + '_' + file.originalname)
    },
});

const upload = multer({storage: fileStorageEngine})
const document = multer({storage: lessonFiles})




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
    let sql="CREATE TABLE account(id int AUTO_INCREMENT, username varchar(50), password varchar(50), firstname varchar (50), lastname varchar (50), birthday date, role varchar(50), image varchar(100),PRIMARY KEY (id))";
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
    let sql = `INSERT INTO account(username, password,firstname,lastname, birthday,role) VALUES("catherinebautista@gmail.com", "123", "Catherine", "Bautista", "2000-03-12","student")`;
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
    let sql = "CREATE TABLE class (class_id varchar(50), account_id int, section varchar(50), grade int, attendance DOUBLE,FOREIGN KEY (account_id) REFERENCES account(id))";

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
    let sql = "CREATE TABLE grades (account_id int,activity_id int AUTO_INCREMENT, class_id varchar(50), section varchar(50),activity_name varchar(50), activity_grade int,PRIMARY KEY(activity_id),FOREIGN KEY(account_id) REFERENCES account(id))";

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


app.get("/create-file-table",(req,res)=>{
    let sql = "CREATE TABLE file (file_id int AUTO_INCREMENT, lesson_id int, lesson_name varchar(50), filename varchar(100), PRIMARY KEY (file_id), FOREIGN KEY (lesson_id) REFERENCES lesson(lesson_id))";

    database.query(sql,(err,result)=>{
        if(!err){
            res.send("Successfully created file table");
        }
        else{
            throw err;
        }
    });
});


app.get("/insert-file",(req,res)=>{
    let sql =`INSERT INTO file(lesson_id, lesson_name,filename) VALUES("${req.params.lesson_id}","SELECT lesson_name from lesson WHERE lesson_id=${req.params.lesson_id}", "Recalling Mean, median and mode","${req.params.section}")`;
    database.query(sql,(err,result)=>{
        if(!err){
            console.log("successfully inserted new lesson");
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

    var sql = `SELECT * FROM account where username = "${username}" AND password = "${password}"` ;
    database.query(sql,(err,result)=>{
        if(!err){
            if(result.length > 0) {
                console.log(result);
                req.session.loggedin = true;
                req.session.username = username;
                req.session.password = password;
                req.session.account_id = result[0].id;
                req.session.role = result[0].role;
                if(req.session.role==='admin'){
                    res.redirect('/index');
                }
                else{
                    res.redirect('/student/profile');
                }
                
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


app.post('/upload_image', upload.single('image'),(req,res)=>{
    console.log(req.file);
    
    let sql = `UPDATE account SET image = "${req.file.filename}" WHERE id=${req.session.account_id}`;
    database.query(sql,(err,result)=>{
        if(!err){
            console.log("image successfully uploaded");
            res.redirect("index");
        }
        else{
            throw err;
        }
    });
});

app.post('/student/upload_image', upload.single('image'),(req,res)=>{
    console.log(req.file);
    
    let sql = `UPDATE account SET image = "${req.file.filename}" WHERE id=${req.session.account_id}`;
    database.query(sql,(err,result)=>{
        if(!err){
            console.log("image successfully uploaded");
            res.redirect("student_index");
        }
        else{
            throw err;
        }
    });
});


app.get('/grades/:class',(req,res)=>{

    database.query(`SELECT account.firstname, account.lastname, account.role, grades.class_id, grades.section, grades.activity_name, grades.activity_grade from account JOIN grades ON account.id = grades.account_id WHERE class_id = ?`,req.params.class,(err,result)=>{
      if(!err){
          console.log("filtered schedule by section");
          res.render('grades', {students:result});
      }
      else{
          throw err;
      }
    });
  
  });

  app.get('/student/grades/:class',(req,res)=>{

    database.query(`SELECT account.firstname, account.lastname, account.role, grades.class_id, grades.section, grades.activity_name, grades.activity_grade from account JOIN grades ON account.id = grades.account_id WHERE class_id = ? AND account_id = ?`,[req.params.class, req.session.account_id],(err,result)=>{
      if(!err){
          console.log("filtered schedule by section");
          res.render('student_grades', {students:result});
      }
      else{
          throw err;
      }
    });
  
  });

app.get("/insert-grades",(req,res)=>{
    let sql = `insert into grades (account_id, class_id, section, activity_name, activity_grade) values(3,'ENGLISH101','3ISA','Pecha Kucha',);`;


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
    
    database.query('select account.firstname, account.lastname, account.role, grades.class_id, grades.section, grades.activity_name, grades.activity_grade from account JOIN grades ON account.id = grades.account_id WHERE firstname LIKE ? OR lastname LIKE ?', ['%'+search+'%', '%'+search+'%'], (err,result)=>{
        if(!err){
            console.log("successfully searched student grade");
            res.render("grades",{students:result})

        }
        else{
            throw err;
        }
    });
});

app.post('/add_new_grades',(req,res)=>{
    let account_id = req.body.account_id;
    
    let class_id = req.body.class;
    let section = req.body.section;
    let activity = req.body.activity;
    let grades = req.body.grades;

    database.query(`INSERT INTO grades(account_id,class_id,section,activity_name,activity_grade) VALUES(${account_id},"${class_id}","${section}","${activity}",${grades})`,(err,result)=>{
        if(!err){
            console.log("successfully inserted new student grade");
            res.redirect("/grades");
        }
        else{
            throw err;
        }
    });
});


app.post('/edit_grades',(req,res)=>{
    let activity_id = req.body.hidden;
    
    let class_id = req.body.class;
    let section = req.body.section;
    let activity = req.body.activity;
    let grades = req.body.grades;

    let sql = `UPDATE grades SET class_id = "${class_id}", section = "${section}", activity_name = "${activity}", activity_grade = "${grades}" where activity_id = "${activity_id}"`;

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
    let activity_id = req.body.hidden;

    database.query('DELETE FROM grades WHERE activity_id = ?', activity_id, (err,result)=>{
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

app.post('/student/edit_account',(req,res)=>{
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var password = req.body.password;
    
    


    var sql = `UPDATE account SET firstname = "${firstname}", lastname = "${lastname}", username="${email}", password="${password}"  WHERE id = ${req.session.account_id}`;
    
    database.query(sql,(err,result)=>{
        if(!err){
            console.log("successfully updated account table");
            res.redirect("/student/profile");
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


        let sql = `SELECT * from account WHERE username = "${req.session.username}" AND password = "${req.session.password}"`;
        database.query(sql,(err,result)=>{
            if(!err){ 
                
               
                res.render('index', { email : req.session.username, password: req.session.password, id: result[0].id, firstname: result[0].firstname, lastname: result[0].lastname, birthday: result[0].birthday, image:result[0].image });
                
                
               
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

app.get('/student/profile', (req,res)=>{

    if(req.session.loggedin) {


        let sql = `SELECT * from account WHERE username = "${req.session.username}" AND password = "${req.session.password}"`;
        database.query(sql,(err,result)=>{
            if(!err){ 
                
               
                res.render('student_index', { email : req.session.username, password: req.session.password, id: result[0].id, firstname: result[0].firstname, lastname: result[0].lastname, birthday: result[0].birthday, image:result[0].image });
                
                
               
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
        let sql = "SELECT account.firstname, account.lastname, account.role, grades.activity_id,grades.class_id, grades.section, grades.activity_name, grades.activity_grade from account JOIN grades ON account.id = grades.account_id";

        database.query(sql,(err,result)=>{
            if(!err){
                console.log(result);
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

app.get('/student/grades', (req,res)=>{
    if(req.session.loggedin) {
        let sql = `SELECT account.firstname, account.lastname, account.role, grades.class_id, grades.section, grades.activity_name, grades.activity_grade from account JOIN grades ON account.id = ${req.session.account_id}`;

        database.query(sql,(err,result)=>{
            if(!err){
                res.render('student_grades', {students:result});
    
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

app.get('/student/announcement', getAnnouncement,(req,res)=>{
    if(req.session.loggedin) {
        let sql = `SELECT class_id, announcement_title, announcement_body, announcement_date from announcement where class_id IN (${req.session.classes})`;
        database.query(sql,(err,result)=>{
            if(!err){
                console.log(result);
             res.render("student_announcement",{announcements:result});
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
        let sql = `SELECT class_id, section FROM class WHERE account_id = ${ req.session.account_id}`;

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

app.get('/student/class', (req,res)=>{
    if(req.session.loggedin) {
        let sql = `SELECT class_id, section FROM class WHERE account_id = ${ req.session.account_id}`;

        database.query(sql,(err,result)=>{
            if(!err){
                res.render('student_class', {classes:result});
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
    let sql =`SELECT * FROM lesson WHERE class_id = "${req.params.id}" AND section = "${req.params.section}"`;
    database.query(sql,(err,result)=>{
        if(!err){
            
            res.render("lesson", {title: req.params.id, lessons:result, section:req.params.section});
        }
        else{
            throw err;
        }
    });
    

   
});

app.get('/student/class/:id/:section', (req,res)=>{
    let sql =`SELECT * FROM lesson WHERE class_id = "${req.params.id}" AND section = "${req.params.section}"`;
    database.query(sql,(err,result)=>{
        if(!err){
            
            res.render("student_lesson", {title: req.params.id, lessons:result, section:req.params.section});
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

app.get('/student/class/:id/:section/announcement_class', (req,res)=>{
    let sql =`SELECT announcement_title, announcement_body, announcement_date FROM announcement WHERE class_id = "${req.params.id}" AND section = "${req.params.section}"`;
    database.query(sql,(err,result)=>{
        if(!err){
            
            res.render("student_announcement_class", {title: req.params.id, announcements:result, section:req.params.section});
        }
        else{
            throw err;
        }
    });
    

   
});

app.get("/class/:id/:section/students",(req,res)=>{
    let sql = `SELECT account.firstname, account.lastname, account.role, class.section, class.attendance from account JOIN class ON account.id = account_id WHERE class_id ="${req.params.id}"`;
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

app.get("/student/class/:id/:section/students",(req,res)=>{
    let sql = `SELECT account.firstname, account.lastname, account.role, class.section, class.attendance from account JOIN class ON account.id = account_id WHERE class_id ="${req.params.id}"`;
    database.query(sql,(err,result)=>{
        if(!err){
            console.log(result);
            res.render("student_view", {title:req.params.id,students:result, section:req.params.section})
        }
        else{
            throw err;
        }
    });
});



app.get('/schedule',getAnnouncement, (req,res)=>{
    if(req.session.loggedin) {
        let sql = `SELECT * FROM schedule WHERE class_id IN (${req.session.classes})`;
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

app.get('/student/schedule',getAnnouncement, (req,res)=>{
    if(req.session.loggedin) {
        let sql = `SELECT * FROM schedule WHERE class_id IN (${req.session.classes})`;
        database.query(sql,(err,result)=>{
            if(!err){
                console.log(result);
                res.render("student_schedule", {schedules:result});
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


app.post('/add_schedule',(req,res)=>{

    let class_id = req.body.class;
    let section = req.body.section;
    let schedule_name = req.body.activity;
    let schedule_date = req.body.schedule;
    let sql = `INSERT INTO schedule (class_id, section, schedule_name, schedule_date) VALUES("${class_id}", "${section}", "${schedule_name}", "${schedule_date}")`;

    database.query(sql,(err,result)=>{
        if(!err){
            console.log("inserted new schedule");
            res.redirect("schedule");
        }
        else{
            throw err;
        }
    });
});


app.post('/delete_schedule',(req,res)=>{
    database.query('DELETE FROM schedule WHERE schedule_id = ?', req.body.hidden,(err,result)=>{
        if(!err){
            console.log("successfully deleted schedule");
            res.redirect("schedule");
        }
        else{
            throw err;
        }
    });
});

app.get('/schedule/section/:section',(req,res)=>{

  database.query(`SELECT * FROM schedule WHERE section = ?`,req.params.section,(err,result)=>{
    if(!err){
        console.log("filtered schedule by section");
        res.render('schedule', {schedules:result});
    }
    else{
        throw err;
    }
  });

});


app.get('/schedule/class/:class',(req,res)=>{

    database.query(`SELECT * FROM schedule WHERE class_id = ?`,req.params.class,(err,result)=>{
      if(!err){
          console.log("filtered schedule by section");
          res.render('schedule', {schedules:result});
      }
      else{
          throw err;
      }
    });
  
  });

  app.get('/student/schedule/class/:class',(req,res)=>{

    database.query(`SELECT * FROM schedule WHERE class_id = ?`,req.params.class,(err,result)=>{
      if(!err){
          console.log("filtered schedule by section");
          res.render('student_schedule', {schedules:result});
      }
      else{
          throw err;
      }
    });
  
  });




  app.get("/class/:id/:section/:lesson_id",(req,res)=>{
    let sql = `SELECT * from file WHERE lesson_id=${req.params.lesson_id}`;
    database.query(sql,(err,result)=>{
        if(!err){
            console.log(result);
            res.render("file", {title:req.params.id,files:result, section:req.params.section, lesson_id: req.params.lesson_id})
        }
        else{
            throw err;
        }
    });
});

app.get("/student/class/:id/:section/:lesson_id",(req,res)=>{
    let sql = `SELECT * from file WHERE lesson_id=${req.params.lesson_id}`;
    database.query(sql,(err,result)=>{
        if(!err){
            console.log(result);
            res.render("student_file", {title:req.params.id,files:result, section:req.params.section, lesson_id: req.params.lesson_id})
        }
        else{
            throw err;
        }
    });
});

app.get('/class/:id/:section/:lesson_id/:filename',(req,res)=>{  

    

    
    let sql = `SELECT * FROM file WHERE filename = "${req.params.filename}"`;
    database.query(sql,(err,result)=>{
        if(!err){
            
           res.render('fileview', {title:req.params.id,section:req.params.section, files:result[0].filename});
        }
        else{
            throw err;
        }
        
    });
});









app.post('/class/:id/:section/:lesson_id/upload_file', document.single('file'),(req,res)=>{
    console.log(req.file);
    
    let sql = `INSERT INTO file (lesson_id, filename) VALUES(${req.body.lesson_id},"${req.file.filename}")`
    database.query(sql,(err,result)=>{
        if(!err){
            console.log("file successfully uploaded");
            res.redirect(`/class/${req.params.id}/${req.params.section}/${req.params.lesson_id}`);
            
        }
        else{
            throw err;
        }
    });
});

app.post('/class/:id/:section/:lesson_id/edit_upload_file', document.single('file'),(req,res)=>{
    console.log(req.file);
    
    let sql = `UPDATE file SET filename = "${req.file.filename}" WHERE file_id=${req.body.file_id}`;
    database.query(sql,(err,result)=>{
        if(!err){
            console.log("file successfully edited");
            res.redirect(`/class/${req.params.id}/${req.params.section}/${req.params.lesson_id}`);
        }
        else{
            throw err;
        }
    });
});


app.post('/class/:id/:section/:lesson_id/delete_upload_file', document.single('file'),(req,res)=>{
    console.log(req.file);
    
    let sql = `DELETE FROM file WHERE file_id=${req.body.file_id}`;
    database.query(sql,(err,result)=>{
        if(!err){
            console.log("file successfully deleted");
            res.redirect(`/class/${req.params.id}/${req.params.section}/${req.params.lesson_id}`);
        }
        else{
            throw err;
        }
    });
});



app.listen(PORT, ()=>{
    console.log("Listening to port 26...")
});