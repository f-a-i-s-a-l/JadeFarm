

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/jadefarmDB",{useNewUrlParser : true,autoIndex: true});

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

// ==================================== Student collection ===================================
const studentSchema = new mongoose.Schema({         // new Students collection
    user: String,                                  // (user, pass, rollnum)
    pass: String,
    rollnum: String 
});
const Student = mongoose.model("Student",studentSchema);


// ==================================== Accdetails collection ===================================
const accDetailsSchema = new mongoose.Schema({  // Accountdetails collection (new users)
    fullName: String,                          // fname, deptname, batch, city, intro, (studentdetails)
    deptName: String,
    batch: String,
    city: String,
    intro: String,
    userDetails: studentSchema
});
const AccDetails = mongoose.model("AccDetails",accDetailsSchema);
// ====================================================================================================


let accountHolder,accountHolderName,accDeptName,accBatchYear,accCityName,accIntroDetails,accUserName,  newStudent,  fullnam;

app.get("/",function(req,res){
    res.sendFile( __dirname+"/signup.html");
});


app.post("/",function(req,res){
    console.log(req.body);
    var username = req.body.user;
    var password = req.body.pass;
    var rollNo = req.body.rollnum;
    Student.findOne({user: username},function(err,existingUserName){      // checking username is already taken or not
        console.log("existig data : " + existingUserName);
        if(existingUserName == null){
            console.log("All data are fine");
            Student.findOne({rollnum : rollNo},function(err,existingRollNo){     // checking rollno is already taken or not
                console.log("existig data : " + existingRollNo);
                if(existingRollNo == null){
                    newStudent = new Student(
                        {
                            user: username,
                            pass: password,
                            rollnum: rollNo
                        }
                    )
                    newStudent.save();
                    res.sendFile(__dirname+"/fetchDetails.html");
                }
                else{
                    console.log("Class Roll No is already taken !");
                    res.render("warning.ejs",{duplicateElement:"CLASS ROLL NO."});
                }
            })
        }
        else{
            console.log("Username is already taken !");
            res.render("warning.ejs",{duplicateElement:"USERNAME"});
        }
    })
});

app.post("/setup",function(req,res){
    console.log(req.body);
    var fName = req.body.fullName;
    var dName = req.body.deptName;
    var batchYear = req.body.batch;
    var city_place = req.body.city;
    var desc_intro = req.body.intro;
    accountHolderName = fName;
    fullnam = fName;
    accDeptName = dName;
    accBatchYear = batchYear;
    accCityName = city_place;
    accIntroDetails = desc_intro;
    const studentAccDetails = new AccDetails(
        {
            fullName: fName,
            deptName: dName,
            batch: batchYear,
            city: city_place,
            intro: desc_intro,
            userDetails: newStudent
        }
    );
    
    studentAccDetails.save();
    studentAccDetails.updateOne({fullName: fullnam},{userDetails: newStudent},function(err,res){
        if(err){
            console.log(err);
        }
        else{
            console.log("Success");
        }
    });
    accUserName = studentAccDetails.userDetails.user;
    console.log("accUserName");
    console.log(studentAccDetails);
    console.log(accUserName);
    res.redirect("/home");
})

app.get("/home",function(req,res){
    console.log(accountHolder);
    res.render("home.ejs",{accountHolder: accountHolderName});
});


app.get("/profile",function(req,res){
    console.log("hello");
    console.log(accountHolderName);
    console.log(accUserName);

    AccDetails.find({user: accUserName},function(err,existingUserName){      // find the user in accdetails Collection
        console.log("existingUserName.user");
        console.log(existingUserName);
        var x;
        for(var i=0;i<existingUserName.length;i++){
            if(existingUserName[i].userDetails.user === accUserName){
                x=i;
            }
        }
        
        res.render("profile.ejs",{accountHolder: existingUserName[x].fullName,accDept: existingUserName[x].deptName,accBatch: existingUserName[x].batch,accCity: existingUserName[x].city,accIntro: existingUserName[x].intro});
    });

});

app.get("/peers",function(req,res){
    res.sendFile(__dirname + "/peers.html");
})
app.get("/peers_profile",function(req,res){
    res.sendFile(__dirname + "/peers_profile.html");
})
app.get("/clubs",function(req,res){
    res.sendFile(__dirname + "/clubs.html");
})
app.get("/clubs_profile",function(req,res){
    res.render("clubs_profile.ejs",{accountHolder: accountHolderName});
})
app.get("/logout",function(req,res){
    res.sendFile(__dirname+"/logout.html");
})
app.post("/goback",function(req,res){
    res.redirect("/");
})

app.get("/login",function(req,res){
    res.sendFile(__dirname + "/login.html");
})
app.get("/settings",function(req,res){
    res.sendFile(__dirname + "/settings.html");
})

app.post("/homepage",function(req,res){

    var username = req.body.username;
    var password = req.body.passwd;
    // var accountName;
    console.log(username);
    console.log(password);
    Student.findOne({user: username},function(err,existingUserName){      // checking username is already taken or not
        console.log("existing data (login) : " + existingUserName);
        if(existingUserName == null){
            console.log("Username is not registered");
            res.sendFile(__dirname + "/wrongPass.html");
        }
        else if(existingUserName.user == username){

            console.log("username registered");

            if(existingUserName.pass == password){
                console.log("Useername is registered and password is also correct !!");
                AccDetails.find({user:username},function(err,person){
                    console.log(person);
                    var x;
                    for(var i=0;i<person.length;i++){
                        if(person[i].userDetails.user === username){
                            x=i;
                        }
                    }
                    accountHolderName = person[x].fullName;
                    accUserName = person[x].userDetails.user;
                    console.log(accountHolderName);
                    console.log(accUserName);
                    res.render("home.ejs",{accountHolder:accountHolderName});
                })
                
            }
            else{
                console.log("Username is registered but password is incorrect !!");
                res.sendFile(__dirname + "/wrongPass.html");
            }
        }
        else{
            console.log("Nothing");
        }
    })
});

app.listen(3000);