const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
require('dotenv/config')
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_CONNECTION,{useNewUrlParser:true},()=>{
    console.log("DB Connected")
})
const { User } = require("./model/user");
const { Role } = require("./model/role");
const { RoleMapping } = require("./model/rolemapping");
const { Subject } = require("./model/subject");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

function isAdminLoggedIn(req,res,next){
    jwt.verify(req.headers['Authorization'],'thisIsAdmin',function(err,decoded){
        if(decoded){
            next()
        }else{
            res.status(401).json({
                message : "Unauthorized User"
            })
        }
    })
}
function isStudentLoggedIn(req,res,next){
    jwt.verify(req.headers['Authorization'],'thisIsStudent',function(err,decoded){
        if(decoded){
            next()
        }else{
            res.status(401).json({
                message : "Unauthorized User"
            })
        }
    })
}

app.get("/",function(req,res){
    res.json({
        "Welcome Message": "Backend Task given to Parthasarathi RV"
    })
})
app.post("/register",isAdminLoggedIn, function(req, res) {
    let user = new User({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password
    })
  bcrypt.hash(req.body.password, 10, function(err, hash) {
    // Store hash in your password DB.
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hash
    });

    user.save().then(
      function(userData) {
        res.json({
          message: "User Created Successfuly!"
        });
      },
      function(err) {
        res.json({
          message: "Sorry Something Went Wrong"
        });
      }
    );
  });
});

app.post('/role',isAdminLoggedIn,function(req,res){
    let role = new Role({
        role : req.body.role
    });
    role.save().then(function(role) {
        res.json({
            message : "Success"
        })
    },function(error){
        res.json(error);
    })    
})

app.post('/rolemapping',isAdminLoggedIn,function(req,res){
    let rolemapping = new RoleMapping({
        userId : req.body.userId,
        roleId : req.body.roleId
    });
    rolemapping.save().then(function(rolemapping) {
        res.json({
            message : "Success"
        })
    },function(error){
        res.json(error);
    })    
})

app.post('/subject',isStudentLoggedIn,function(req,res){
    let subject = new Subject({
        userId : req.body.userId,
        semester:req.body.semester,
        subjects : req.body.subjects
    });
    if(req.body.semester==5 && subject.subjects.length==1){
        subject.save().then(function(subject) {
            res.json({
                message : "Success"
            })
        },function(error){
            res.json(error);
        })    
    }
    else{
        res.json({message :"Choose only one Subject"});
    }
    if(req.body.semester==6 && subject.subjects.length==2){
        subject.save().then(function(subject) {
            res.json({
                message : "Success"
            })
        },function(error){
            res.json(error);
        })    
    }
    else{
        res.json({message :"Choose only two Subjects"});
    }
    
})

app.get('/subjects',isAdminLoggedIn,function(req,res){
    Subject.find()
    .then(function(response){
        res.json(response)
    },function(err){
        res.json(err)
    })
})

app.get('/user',isAdminLoggedIn,function(req,res){
    User.find()
    .then(function(response){
        res.json(response)
    },function(err){
        res.json(err)
    })
})

app.get('/user/:userId',isAdminLoggedIn,function(req,res){
    User.find({"userId":req.params.userId}).then(function(response){
        res.json(response);
    },function(err){
        res.json(err);
    })
});

app.post('/login',function(req,res){
    User.findOne({"email":req.body.email}).then(function(response){
        bcrypt.compare(req.body.password, response.password, function(err, bcryptRes) {
            // res == true
            if(response.role=="Admin"){
                if(bcryptRes == true){
                    var Token = jwt.sign({ name: response.name }, 'thisIsAdmin');
                    res.json({Token });
                }
            }
            if(response.role=="Student"){
                if(bcryptRes == true){
                    var Token = jwt.sign({ name: response.name }, 'thisIsStudent');
                    res.json({Token });
                }
            }
            if(bcryptRes==false){
                res.json({
                    "Error":"Invalid User"
                })
            }
            
        });
    },function(err){
        res.json(err);
    })
});

app.listen(8000,function(){
    console.log('Port listen in 8000')
});