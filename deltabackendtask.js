var http = require('http');
var fs = require('fs');
var formidable = require("formidable");
var util = require('util');
var bodyParser = require('body-parser');
var mysql=require('mysql');
var qs = require('querystring');
var bcrypt=require('bcryptjs');


var con=mysql.createConnection(
        {host:'localhost',
         user:'root',
         password:'Priyankapal16@sql',
         database:'deltaaccounts'});
con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

var server = http.createServer(function (req, res) {
    if (req.method.toLowerCase() == 'get'&& req.url=='/') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
               
        });
        fs.createReadStream('deltafrontpage.html').pipe(res);
        
    } 
  else if (req.method.toLowerCase() == 'get'&& req.url=='/deltaregister.html') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
               
        });
        
        fs.createReadStream('deltaregister.html').pipe(res);
        
        
        
    }
    
    else if (req.method.toLowerCase() == 'get'&& req.url=='/deltalogin.html') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
               
        });
        
        fs.createReadStream('deltalogin.html').pipe(res);
        
        
        
    }
    else if (req.method.toLowerCase() == 'get'&& req.url=='/editdetails.html') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
               
        });
        
        fs.createReadStream('editdetails.html').pipe(res);
        
        
        
    }
    else if (req.method.toLowerCase() == 'get'&& req.url=='/deltafrontpage.html') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
               
        });
        
        fs.createReadStream('deltafrontpage.html').pipe(res);
        
        
        
    }
    else if (req.method.toLowerCase() == 'get'&& req.url=='/viewprofilepic.html') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
               
        });
        
        fs.createReadStream('viewprofilepic.html').pipe(res);
        
        
        
    }
    else if (req.method.toLowerCase() == 'post'&& req.url=='/register') {
        processfields(req,res);
      }
    else if(req.method.toLowerCase()=='post' && req.url=='/login')  {
      processfieldstwo(req,res);
    }
    else if(req.method.toLowerCase()=='post' && req.url=='/viewpic')  {
      viewpic(req,res);
    }



   else if (req.method.toLowerCase() == 'post'&& req.url=='/changename') {
        changename(req,res);
      }

   else if (req.method.toLowerCase() == 'post'&& req.url=='/changeusername') {
        changeusername(req,res);
      }
      
   else if (req.method.toLowerCase() == 'post'&& req.url=='/changeemail') {
        changeemail(req,res);
      }
   /* else if (req.method.toLowerCase() == 'post'&& req.url=='/changepassword') {
        changepassword(req,res);
      }*/
    else if (req.method.toLowerCase() == 'post'&& req.url=='/changeprofilepic') {
        changeprofilepic(req,res);
      }          










  });



function processfields(req,res)
{
  
            var record={
                name:'',
                username :'',
                email : '',
                password : '',
                profilepic:null
           
                };
    i=0;
    var fields=[];var confirmpassword='';
    var form = new formidable.IncomingForm();
    form.on('field',function(field,value){
      fields[field]=value;
      i++;
      if(i===1)
          record.name = value;
      else if(i===2)
      {
          record.username= value;
      }
      else if(i===3)
          record.email=value;
      else if(i===4)
          record.password = value;
      else if(i===5)  
          confirmpassword=value;
    });
    form.on('file',function(name,file){
       record.profilepic=file.path;
    });
    form.on('end',function(){
        
            
            var salt = bcrypt.genSaltSync(1);
            var hash = bcrypt.hashSync(record.password,salt);
            record.password = hash;
            var validname=validatename(record.name);
            var validusername=validateusername(record.username);
            var validemail=validateemail(record.email);
            var matchpass=bcrypt.compareSync(confirmpassword,record.password);
            if(matchpass==false)
            {res.writeHead(200, {
                'Content-Type': 'text/plain'
               
                      });


              res.write("Passwords do not match");
              res.end();
             }
            else if(validname==false && validusername==false && validemail==false)
            {res.writeHead(200, {
                'Content-Type': 'text/plain'
               
                      });


              res.write("Name,username,email id are of wrong format");
              res.end();
            }
            else if(validname==false && validusername==false)
            {res.writeHead(200, {
                'Content-Type': 'text/plain'
               
                      });


              res.write("Name,username are of wrong format ");
              res.end();
            }
            else if(validemail==false && validusername==false)
            {res.writeHead(200, {
                'Content-Type': 'text/plain'
               
                      });


              res.write("Email,username are of wrong format ");
              res.end();
            }
            else if(validemail==false && validname==false)
            {res.writeHead(200, {
                'Content-Type': 'text/plain'
               
                      });


              res.write("Email,name are of wrong format ");
              res.end();
            }
            else if(validemail==false)
            {res.writeHead(200, {
                'Content-Type': 'text/plain'
               
                      });


              res.write("Email is of wrong format ");
              res.end();
            }
            else if(validname==false)
            {res.writeHead(200, {
                'Content-Type': 'text/plain'
               
                      });


              res.write("Name is of wrong format ");
              res.end();
            }
            else if(validusername==false)
            {res.writeHead(200, {
                'Content-Type': 'text/plain'
               
                      });


              res.write("Username is of wrong format ");
              res.end();
            }



          else{
            con.query('INSERT INTO users SET ?',record,function(err,result){
                
                if(!err)
                {
                console.log("Inserted");
                res.writeHead(200, {
                'Content-Type': 'text/html'
               
                      });
        
              fs.createReadStream('deltalogin.html').pipe(res);
                //displayForm(res);
            }});
             }
        
        
      });

 form.parse(req);
}

function processfieldstwo(req,res)
{
   var post={
                
                username :'',
                
                password : ''

                
                
           
       };
     var i=0;
    var fields=[];
    var formnew = new formidable.IncomingForm();
    formnew.on('field',function(field,value){
      fields[field]=value;
      i++;
      if(i===1)
          post.username = value;
      else if(i===2)
      {
          post.password= value;
      }
      
      
    });






formnew.on('end',function(){


con.query('SELECT * FROM users WHERE username=?',post.username,function(err,rows,fields){
                if(!err)
                {
                    if(rows.length>0&&bcrypt.compareSync(post.password,rows[0].password))
                    {  
                     
                       
                        console.log(rows);

                        
                        /*var img=fs.readFileSync(rows[0].profilepic);
                        res.writeHead(200, {
                        'Content-Type': 'image/png'
               
                        });
        
                       
                        res.end(img,'binary');*/
                        var body='<html><body><ul><li>Name :'+rows[0].name+'</li><li> Username:'+rows[0].username+'</li><li> email id:'+rows[0].email+'</li></body></html>';
                       res.writeHead(200, {
                        'Content-Type': 'text/html'
               
                        });
                       res.write(body);
                       res.end();
                      
                   }
                else
                    res.end("Either Username or Password is wrong");
                }
                else
                    console.log("Error has occurred");
            });

});

formnew.parse(req);

}
function viewpic(req,res)
{

  var post={
                
                username :'',
                
                password : ''

                
                
           
       };
     var i=0;
    var fields=[];
    var formnew = new formidable.IncomingForm();
    formnew.on('field',function(field,value){
      fields[field]=value;
      i++;
      if(i===1)
          post.username = value;
      else if(i===2)
      {
          post.password= value;
      }
      
      
    });






formnew.on('end',function(){


con.query('SELECT * FROM users WHERE username=?',post.username,function(err,rows,fields){
                if(!err)
                {
                    if(rows.length>0&&bcrypt.compareSync(post.password,rows[0].password))
                    {  
                     
                       
                        console.log(rows);

                        
                        var img=fs.readFileSync(rows[0].profilepic);
                        res.writeHead(200, {
                        'Content-Type': 'image/png'
               
                        });
        
                       
                        res.end(img,'binary');
                        
                      
                   }
                else
                    res.end("Either Username or Password is wrong");
                }
                else
                    console.log("Error has occurred");
            });

});

formnew.parse(req);

}





























function changename(req,res)
{var post={     
                
              username :'',

              password : '',
                newname:''
              };
     var i=0;
    var fields=[];
    var formnew = new formidable.IncomingForm();
    formnew.on('field',function(field,value){
      fields[field]=value;
      i++;
      if(i===1)
          post.username = value;
      else if(i===2)
      {
          post.password= value;
      }
      else if(i===3)
      {
          post.newname= value;
      }
      
    });






formnew.on('end',function(){


con.query('SELECT * FROM users WHERE username=?',post.username,function(err,rows,fields){


if(rows.length>0 && bcrypt.compareSync(post.password,rows[0].password))
  {con.query('UPDATE users SET name=? WHERE username=?',[post.newname,post.username],function(err,result)
  {
    if(!err){res.writeHead(200, {
            'Content-Type': 'text/html'
               
        });
        
        fs.createReadStream('editdetails.html').pipe(res);}
  });
   }


else {res.writeHead(200, {
            'Content-Type': 'text/plain'
               
        });

       res.end("Username or password invalid");
     }});});
formnew.parse(req);

}
function changeusername(req,res)
{var post={     
                
              username :'',

              password : '',
                newusername:''
              };
     var i=0;
    var fields=[];
    var formnew = new formidable.IncomingForm();
    formnew.on('field',function(field,value){
      fields[field]=value;
      i++;
      if(i===1)
          post.username = value;
      else if(i===2)
      {
          post.password= value;
      }
      else if(i===3)
      {
          post.newusername= value;
      }
      
    });






formnew.on('end',function(){


con.query('SELECT * FROM users WHERE username=?',post.username,function(err,rows,fields){


if(rows.length>0 && bcrypt.compareSync(post.password,rows[0].password))
  {con.query('UPDATE users SET username=? WHERE username=?',[post.newusername,post.username],function(err,result)
  {
    if(!err){res.writeHead(200, {
            'Content-Type': 'text/html'
               
        });
        
        fs.createReadStream('editdetails.html').pipe(res);}
  });
   }


else {res.writeHead(200, {
            'Content-Type': 'text/plain'
               
        });

       res.end("Username or password invalid");
     }});});
formnew.parse(req);

}
function changeemail(req,res)
{var post={     
                
              username :'',

              password : '',
                newemail:''
              };
     var i=0;
    var fields=[];
    var formnew = new formidable.IncomingForm();
    formnew.on('field',function(field,value){
      fields[field]=value;
      i++;
      if(i===1)
          post.username = value;
      else if(i===2)
      {
          post.password= value;
      }
      else if(i===3)
      {
          post.newemail= value;
      }
      
    });






formnew.on('end',function(){


con.query('SELECT * FROM users WHERE username=?',post.username,function(err,rows,fields){


if(rows.length>0 && bcrypt.compareSync(post.password,rows[0].password))
  {con.query('UPDATE users SET email=? WHERE username=?',[post.newemail,post.username],function(err,result)
  {
    if(!err){res.writeHead(200, {
            'Content-Type': 'text/html'
               
        });
        
        fs.createReadStream('editdetails.html').pipe(res);}
  });
   }


else {res.writeHead(200, {
            'Content-Type': 'text/plain'
               
        });

       res.end("Username or password invalid");
     }});});
formnew.parse(req);

}
function changepassword(req,res)
{var post={     
                
              username :'',

              password : '',
                newpassword:''
              };
     var i=0;
    var fields=[];
    var formnew = new formidable.IncomingForm();
    formnew.on('field',function(field,value){
      fields[field]=value;
      i++;
      if(i===1)
          post.username = value;
      else if(i===2)
      {
          post.password= value;
      }
      else if(i===3)
      {
          post.newname= value;
      }
      
    });






formnew.on('end',function(){

            var salt = bcrypt.genSaltSync(1);
            var hash = bcrypt.hashSync(post.newpassword,salt);
            post.newpassword = hash;

con.query('SELECT * FROM users WHERE username=?',post.username,function(err,rows,fields){


if(rows.length>0 && bcrypt.compareSync(post.password,rows[0].password))
  {con.query('UPDATE users SET password=? WHERE username=?',[post.newpassword,post.username],function(err,result)
  {
    if(!err){res.writeHead(200, {
            'Content-Type': 'text/html'
               
        });
        
        fs.createReadStream('editdetails.html').pipe(res);}
  });
   }


else {res.writeHead(200, {
            'Content-Type': 'text/plain'
               
        });

       res.end("Username or password invalid");
     }});});
formnew.parse(req);

}
function changeprofilepic(req,res)
{var post={     
                
              username :'',

              password : '',
                newprofilepic:null
              };
     var i=0;
    var fields=[];
    var formnew = new formidable.IncomingForm();
    formnew.on('field',function(field,value){
      fields[field]=value;
      i++;
      if(i===1)
          post.username = value;
      else if(i===2)
      {
          post.password= value;
      }
     
      
    });

formnew.on('file',function(name,file){
       post.newprofilepic=file.path;
    });




formnew.on('end',function(){


con.query('SELECT * FROM users WHERE username=?',post.username,function(err,rows,fields){


if(rows.length>0 && bcrypt.compareSync(post.password,rows[0].password))
  {con.query('UPDATE users SET profilepic=? WHERE username=?',[post.newprofilepic,post.username],function(err,result)
  {
    if(!err){res.writeHead(200, {
            'Content-Type': 'text/html'
               
        });
        
        fs.createReadStream('editdetails.html').pipe(res);}
  });
   }


else {res.writeHead(200, {
            'Content-Type': 'text/plain'
               
        });

       res.end("Username or password invalid");
     }});});
formnew.parse(req);

}

function validatename(name)
{var alphaExp =  /^[A-Za-z ]{3,20}$/;
  //var name=document.getElementById("name").va
if(name.match(alphaExp))
return true;
else {return false;}}

function  validateusername(user)
{var userid=/^[A-Za-z0-9_]{3,20}$/;
 if(user.match(userid))
return true;
else {return false;}
}


function  validateemail(mail)
{var mailid=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
 if(mail.match(mailid))
return true;
else {return false;}
}
















server.listen(1185);
console.log("server listening on 1185");