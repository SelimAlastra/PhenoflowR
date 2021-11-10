const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/PhenoflowR', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let db = mongoose.connection; 

//Check connection
db.once('open',function(){
    console.log('Connected to MongoDB');
})

//Check for DB errors
db.on('error', function(err){
    console.log(err);
});

//Init app
const app = express();

//Bring in Models
let User = require('./models/user');

//Load view engine
app.set('Views', path.join(__dirname, 'views'));
app.set('View engine', 'pug');

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//parse application/json
app.use(bodyParser.json())

//set public folder

app.use(express.static(path.join(__dirname, 'public')));
//Home route
app.get('/', function (req,res) {
        res.render('index.pug'); 
});

//Prototype route
app.get('/prototype', function(req,res) {
    res.render('prototype.pug', {
        title: 'Phenoflow prototype'
    }); 
})

//Users route
app.get('/users', function (req,res) {
    User.find({}, function(err, users){
        if(err){
            console.log(err);
        }
        else{
            res.render('users.pug', {
                title: 'Users',
                users : users
            });
        }
    });
});

//Register route
app.get('/register', function(req,res) {
    res.render('register.pug', {
        title: 'Register on Phenoflow'
    }); 
})

//Add Register Sumbit POST route
app.post('/register', function(req,res) {
    let user = new User();
    user.username = req.body.username;
    user.password = req.body.password;

    user.save(function(err){
        if(err){
            console.log(err);
            return;
        }
        else{
            res.redirect('/')
        }
    });
})

//Start server
app.listen(3000, function(){
    console.log('Server started on port 3000...')
});
