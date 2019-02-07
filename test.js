connection.query('INSERT INTO tweet (id, text , user_id , user_screen_name , user_name , created_at , retweets , likes , replies , profile_pic , query ,date ,media_image ) VALUES ?', [all_values], function(err,result) {
    if(err) {
       console.log("opps record not inserted")
    }
   else {
    console.log("element inserted")
    }
  });
  // search code
  if(pid){
    kill(pid);
    console.log(pid + " has been killed");
  }
  
  var spawn= require('child_process').spawn;
  var py = spawn('python3', ['twit_scrap.py']);
  pid = py.pid;
  var py_response = ""
  
    request = {
      query:req.body.query
      };
    console.log( request['query'] + "is received") ;
    myQuery = request['query']
     
    py.stdout.on('data', function(data){
        py_response += data.toString();
        console.log(py_response)
       
        
      });
      py.stdout.on('end', function(){
       
        
      });
  
    py.stdin.write(JSON.stringify(request['query']) , function(err){
    
    py.stdin.end();
  
    
    
    
    });
  
  
  
    return res.send( request['query']);
     //console.log(response);
     //res.end();  


    // module.exports code 

     module.exports = {
      run_scrapper : function (query){
      setInterval( function(){scrapper(query)} , 5000);
  
      }
  };
  

  // add & configure middleware
app.use(session({
  genid: (req) => {
    console.log('Inside the session middleware')
    console.log(req.sessionID)
    return uuid() // use UUIDs for session IDs
  },
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))



var kill = function (pid, signal, callback) {
  signal   = signal || 'SIGKILL';
  callback = callback || function () {};
  var killTree = true;
  if(killTree) {
      psTree(pid, function (err, children) {
          [pid].concat(
              children.map(function (p) {
                  return p.PID;
              })
          ).forEach(function (tpid) {
              try { process.kill(tpid, signal) }
              catch (ex) { }
          });
          callback();
      });
  } else {
      try { process.kill(pid, signal) }
      catch (ex) { }
      callback();
  }
};







function getMysqlConnection() {
  return mysql.createConnection( 
    {
      host: "172.104.189.102",
      user: "remote_user",
      password: "myPassw0rd_01",
      database: "twitter"
    }
  );
}