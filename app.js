var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let courses = require('./coursesFall21.json')
for(let i=0; i<courses.length; i++){
  courses[i]['id'] = i
}

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/testing',(req,res,next) =>{
  let c = courses[0]
  console.log('course 0 is ')
  console.dir(c)
  console.log('there are '+courses.length + 'course')
  res.json(c)
})

app.get('/courseByNum/:num', (req,res,next) => {
  let num = parseInt(req.params.num)
  let cs = courses.filter(c=>(c['id']==num))
  res.json(cs[0])
})

app.post('/coursesByDesc', (req,res,next) => {
  let phrase = req.body.phrase
  let cs = courses.filter(
       x => x['description'].includes(phrase))
  console.log('cs=')
  console.dir(courses.map(x=>x['name']))
  res.json(cs)
})

app.post('/coursesByEmail', (req,res,next) => {
  let email= req.body.email
  let cs = courses.filter(
       x => x['instructor'].includes(email))
  res.json(cs)
})

// generate form to ask user for a phrase
app.get('/byDesc',(req,res,next) => {
  try {
    res.locals.phrase=""
    res.locals.cs = []
    res.render('byDesc')
  }catch(e){
    next(e)
  }
})

app.post('/byDesc',(req,res,next) => {
  try {
    let phrase = req.body.phrase
    let cs = courses.filter(
         x => x['description'].includes(phrase)
       )
    res.locals.cs = cs
    res.locals.phrase = phrase
    res.render('byDesc')
  }catch(e){
    next(e)
  }
})

app.get('/byNum/:num', (req,res,next) => {
  try {
    let num = parseInt(req.params.num)
    let cs = courses.filter(c=>(c['id']==num))
    res.locals.c = cs[0]
    res.render('showCourse')
  }catch(e){
    next(e)
  }
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
