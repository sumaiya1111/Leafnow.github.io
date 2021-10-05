const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');


require("./db/conn");
const Register = require("./models/registers");
const { json } = require("express");
const { log } = require("console");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public" );
const template_path = path.join(__dirname, "../templates/views" );
const partials_path = path.join(__dirname, "../templates/partials" );

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);


app.get("/", (req, res) => {
    res.render("index")
});

app.get("/register", (req, res) =>{
    res.render("register");
})

app.get("/login", (req, res) =>{
    res.render("login");
})

app.get("/donate", (req, res) =>{
    res.render("donate");
})
app.get("/invoice", (req, res) =>{
    res.render("invoice");
})
app.get("/contact", (req, res) =>{
    res.render("contact");
})
app.get("/sale", (req, res) =>{
    res.render("sale");
})
app.get("/products", (req, res) =>{
    res.render("products");
})
app.get("/store", (req, res) =>{
    res.render("store");
})
app.get("/about", (req, res) =>{
    res.render("about");
})

//salllllllllllllllllllleeeeeeeee

const Schema = mongoose.Schema;
const movieSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    // https://mongoosejs.com/docs/schematypes.html#buffers
    img: {
        type: Buffer,
        required: true
    },
    imgType: {
        type: String,
        required: true
    }
});
// https://mongoosejs.com/docs/tutorials/virtuals.html
// a virtual is a property that is not stored in MongoDB. Virtuals are typically used for computed properties on documents.
// IT WILL GIVE US OUR IMAGE SOURCE THAT WE WILL USE IN OUT IMG TAG
movieSchema.virtual('coverImagePath').get(function (){
    if(this.img != null && this.imgType != null){
        return `data:${this.imgType};charset=utf-8;base64,${this.img.toString('base64')}`;
    }
})



module.exports = mongoose.model('movies', movieSchema);

// create a new user in our database
app.post("/register", async (req, res) =>{
    try {

      const password = req.body.password;
      const cpassword = req.body.confirmpassword;

      if(password === cpassword){
        
        const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname:req.body.lastname,
                email:req.body.email,
                gender:req.body.gender,
                phone:req.body.phone,
                age:req.body.age,
                password:req.body.password,
                confirmpassword:req.body.confirmpassword    
        })

        console.log("the success part" + registerEmployee);

        const token = await registerEmployee.generateAuthToken();
        console.log("the token part" + token);

        const registered = await registerEmployee.save();
        console.log("the page part" + registered);

        res.status(201).render("index");

      }else{
          res.send("password are not matching")
      }
        
    } catch (error) {
        res.status(400).send(error);
        console.log("the error part page ");
    }
})


// login check

app.post("/login", async(req, res) =>{
   try {
    
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({email:email});

        const isMatch = await bcrypt.compare(password, useremail.password);

        const token = await useremail.generateAuthToken();
        console.log("the token part" + token);
       
        if(isMatch){
            res.status(201).render("index");
        }else{
           res.send("invalid Password Details"); 
        }
    
   } catch (error) {
       res.status(400).send("invalid login Details")
   }
})

app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
})