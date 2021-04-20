const express = require('express');
const app = express();
const path = require('path');
const { v4: uuid } = require('uuid');

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//const postRouter = require('./routes/posts');

// DB Setting Start---------------------------------------------------------
const mongoose = require('mongoose');

// This is the default address for MongoDB.
// Make sure MongoDB is running!
const mongoEndpoint = 'mongodb://127.0.0.1/project_3_hacker_news';

// useNewUrlParser is not required, but the old parser is deprecated
mongoose.connect(mongoEndpoint, { useNewUrlParser: true });

// Get the connection string
const db = mongoose.connection;

// This will create the connection, and throw an error if it doesn't work
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));
// DB Setting End-----------------------------------------------------------

const UserModel = require('./model/user.model')

app.get('/findAllUsers', function(req, res){
    const testUsers = UserModel.findAllUsers()
        .then((findAllUserResponse) => {
            res.status(200).send({res_msg:"Success", res_body: findAllUserResponse});
        }, (error) => {
            res.status(500).send(error);
        })
})

app.post('/addUser', function(req, res){
    console.log(req.body);
    let newUser = {
        userId: uuid(),
        account: req.body.user.account,
        password: req.body.user.password
    }
    UserModel.addUser(newUser)
        .then((addUserResponse)=>{
            res.status(200).send({res_msg:"Success", res_body:""});
        }, (error) => {
            res.status(500).send(error);
        });
})

//Wildcard. The root redirect. 
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

//Listen to port, 8000.
app.listen(process.env.PORT || 8000, () => {
  console.log('Starting server');
});