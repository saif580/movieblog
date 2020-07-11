var express= require("express"),
app=express(),
bodyParser=require("body-parser"),
mongoose=require("mongoose"),
methodoverride=require("method-override"),
expressSanitizer=require("express-sanitizer"),
dotenv=require("dotenv");
dotenv.config();

var PORT=process.env.PORT||3000;

//APP CONFIGURATON
// mongoose.connect("mongodb://localhost/restful_blog_app");

require("./db");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.use(expressSanitizer());

//MONGOOSE/MODEL CONFIGURATION
var blogschema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});
var Blog=mongoose.model("Blog",blogschema);

//RESTFUL ROUTES
app.get("/",function(req,res){
    res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log("ERROR!!");
        } else {
            res.render("index",{blogs:blogs});
        }
    })
});

//NEW ROUTE
app.get("/blogs/new",function(req,res){
    res.render("new");
});

//CREATE ROUTE
app.post("/blogs",function(req,res){
    //CREATE BLOGS
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render("new");
        } else {
            //REDIRECT TO INDEX
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
    // console.log(req.params.id,"yoo");
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show",{blog:foundBlog});
        }
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit",{blog:foundBlog});
        }
    });
});
//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            red.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});

app.listen(PORT,function(req,res){
    console.log("Server Started at "+PORT);
});