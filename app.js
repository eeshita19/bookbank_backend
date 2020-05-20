var express= require("express"),
    app = express();

    app.use(express.static('config'));

    app.set("view engine","ejs");

 


    app.get("/",function(req,res){
        res.render("login");
    });

    app.get("/main",function(req,res){
        res.render("main");
    });

    app.get("/form",function(req,res){
        res.render("form");
    });



app.listen(3000,function(){
    console.log("started");
});