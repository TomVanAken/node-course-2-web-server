const express = require("express");
const hbs = require("hbs");
const fs = require('fs');

//Use Heroku PORT or 3000 as default on local
const port = process.env.PORT || 3000;


var app = express();
hbs.registerPartials(__dirname + "/views/partials")

app.set('view engine', 'hbs');



app.use((req, res, next) => {
    
    
    //Logger of requests
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url} ${req.ip}`;
    console.log(log);
    fs.appendFile("server.log", log + "\n", (err) => {
        if(err) {
            console.log('Unable to append to server.log');
        }
    });


    //You should call next() to proceed with requests.
    next();

});


/* app.use((req, res, next) => {
    //Stop normal rendering by redirecting to maintenance page (example)
    res.render('maintenance.hbs');
}); */

//app.use is called in order. So move static rendering to make sure these calls are redirected too
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
})



app.get('/', (req, res) => {
   res.render('home.hbs', {
       pageTitle: 'Home page', 
       welcomeMessage: 'Welcome to the home of this site'
   })
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'HBS About'
    });
});

app.get('/projects', (req, res) => {
    res.render('projects.hbs', {
        pageTitle: 'The Projects Page'
    });
})

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Bad JSON request'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ', port);
});