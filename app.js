var express = require('express');
var app = express();
//var mysql = require('mysql');
//var myQuery ;
//var pid;
var bodyParser = require('body-parser');
var ps = require('ps-node');
var session = require('express-session')
var pool = require('./database')


app.use(session({
  secret : '343ji43j4n3jn4jk3n' ,
  saveUninitialized: false
}))
app.use(bodyParser.json());

app.use(express.static('public'));
var path = __dirname + '/views/';
//app.set('view engine' , 'pug')
app.get('/', function (req, res) {
   //res.render( 'index' );
   res.sendFile(path + "front_page.html");
})










function runQuery(res , query , pid){
  var tweets = [];
 // Connect to MySQL database.
 //var connection = getMysqlConnection();
 //connection.connect(); 
 query_text = "SELECT * FROM tweet WHERE query="+ "'" + query + "'" + "AND process_id =" + "'" + pid + "'"  +"ORDER BY created_at DESC";
 console.log(query_text);

 // Do the query to get data.
 pool.query(query_text, function(err, rows, fields) {
  if (err) {
   console.log(err)
  } else {
    // Loop check on each row
    for (var i = 0; i < rows.length; i++) {

      // Create an object to save current row's data
      var tweet = {
        'User_name':rows[i].user_name,
        'user_screen_name': rows[i].user_screen_name,
        'tweet':rows[i].text,
        'profile_pic':rows[i].profile_pic,
        'time_stamp':rows[i].created_at,
        'date':rows[i].date , 
        'retweets':rows[i].retweets,
        'likes':rows[i].likes, 
        'replies':rows[i].replies,
        'media_image':rows[i].media_image
        
      }
      console.log(  tweet.tweet + " found ")
      // Add object into array
      tweets.push(tweet);
  }

  // Send the tweets back to the ajax response
  return res.send(tweets);
   
  }

 
});




}

app.post('/search', function (req, res) {
  
  var process_array = [];
  
  if(req.session.pid){
    ps.kill( req.session.pid, 'SIGKILL', function( err ) {
      if (err) {
          throw new Error( err );
      }
      else {
          console.log( 'Process %s has been killed without a clean-up!', req.session.pid );
      }
      req.session.pid = null;
  });
  }
var cp = require('child_process');
var child = cp.fork('./scrapper' , {
  detached: true

});

req.session.pid = child.pid;
process_array.push(req.session.pid);
  request = {
    query:req.body.query
    };
  process_array.push(request['query'] )
  console.log( request['query'] + "is received") ;
  req.session.myQuery = request['query']
  child.send(process_array);
  
  child.on('exit', function () {
    console.log('child process exited ');
 });

 child.unref();

  res.send("script started")

}) ;


app.get('/view_tweets', function (req, res) {
  console.log("receiving control");

   
   //tweet=[{'User_name':'Mufaddal' , 'tweet':'This is a test tweet'}];

  runQuery(res , req.session.myQuery , req.session.pid);
})


app.post('/unload', function (req, res) {
  

  if(req.session.pid){
   
    ps.kill( req.session.pid, 'SIGKILL', function( err ) {
      if (err) {
          throw new Error( err );
      }
      else {
          console.log( 'Process %s has been killed without a clean-up!', req.session.pid );
      }
  });
    console.log(req.session.pid + " (on exit) has been killed");
    req.session.pid = null;
    return res.send("bye")
  }
  return res.send("You are clear")
  
})


app.get('/analysis', function (req, res) {
 console.log("performing analysis");
 var analysis = {};
 // Connect to MySQL database.
 if(req.session.myQuery){
  try{ //of no use :(
 //var connection = getMysqlConnection();
 //connection.connect(); 
 query_text = "SELECT COUNT(*) AS tweetCount FROM tweet WHERE query="+ "'" + req.session.myQuery + "'" + "AND process_id=" + "'" + req.session.pid + "'";
 pool.query(query_text, function(err, rows, fields) {
  if (err) {
    console.log(err)
   } else {
     try{
   analysis.count = rows[0].tweetCount ; 
   console.log("count is " + analysis.count)
     }

     catch(error) {
      return res.send(analysis);
    
    }
   
  }

 }) ;

 query_text_time = "SELECT date from tweet WHERE created_at = (SELECT MAX(created_at) FROM tweet WHERE query="+ "'" + req.session.myQuery + "'" + "AND process_id=" + "'" + req.session.pid + "'"+")" ;
 pool.query(query_text_time, function(err, rows, fields) {
  if (err) {
    console.log(err)
   } else {
    
    try{  
   analysis.date = rows[0].date ; 
   console.log("date is " + analysis.date)
   
   console.log(analysis)
   //connection.destroy();
   return res.send(analysis);
   
    }
    catch(error) {
      //connection.destroy();
      return res.send(analysis);
    
    }


   }

 }) ;
  }

  catch(error) {
    
    return res.send(analysis);
  
  }
  
  
}
  
  
   //tweet=[{'User_name':'Mufaddal' , 'tweet':'This is a test tweet'}];

 
})


var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)

})