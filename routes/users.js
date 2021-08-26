var express = require('express');
var mysql = require('mysql');
var router = express.Router();
//Call Response Function
var Response = require('../class/response');

//Db Connection Start 

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'db_aptutorials'
});

connection.connect(function(err){
  if(!err) {
      console.log("Database is connected ");    
  } else {
      console.log("Error connecting database");    
  }
  });
//DB Connection End

 


 





//Display Home Page (Index Page)
router.get('/', function(req, res, next) {
    res.render('index');
  });
  
//Display all records API
router.get('/get-all-users-api', function(req, res, next) {
   
    connection.query("select * from tbl_user",function(err,rows){
     if(err) 
     {
         Response.errorResponse(err, res);
     }else{
         console.log(rows);
         res.send(JSON.stringify(rows));
         
         //Response.successResponse('User Listing!', res, rows);
     }
    })

});

//Add User API
router.post('/add-users-api', function(req, res, next) {
     

   


    console.log(req.body);
    const mybodydata = {
        user_name: req.body.user_name,
        user_email: req.body.user_email,
        user_mobile: req.body.user_mobile
    }
    
    connection.query("insert into tbl_user set ?",mybodydata,function(err,result){

        if(err){
            Response.errorResponse(err, res);
        }else{
            var mydata = {
                msg : 'yes',
                flag : 1
            }
            res.send(JSON.stringify(mydata))
            //Response.successResponse('User Added!', res, {});
        }

        

    });
});


//Get Single Data API
//Open Using FormData Method 
router.get('/get-users-details-api/:id', function(req, res, next) {
    console.log("Details API");
    var id = req.params.id;
    
    console.log(id);
    connection.query("select * from tbl_user where user_id = ?",[id],function(err,rows){
        if(err) 
        {
            Response.errorResponse(err, res);
        }else{
            console.log(rows);
            Response.successResponse('User Listing!', res, rows);
        }
       })
  
});

//Delete Record API
router.delete('/delete-users-api', function(req, res, next) {

    var deleteid = req.body.id;
    console.log(req.body.id);
    console.log("Show id is " + deleteid);
       
    connection.query("delete from tbl_user where user_id = ? ",[deleteid],function (err,rows)
    {
        if (err) {
            Response.errorResponse(err,rows);
          } else {
            console.log(rows);
            Response.successResponse('User deleted!',res,{});
          }
    })

});



//Update Record API
router.post('/update-users-api', function(req, res) {

    console.log("Update API Called");
  console.log(req.body.user_id);
  console.log(req.body);
 
 
var user_id = req.body.user_id;
var user_name = req.body.user_name;
var user_email = req.body.user_email;
var user_mobile = req.body.user_mobile;

console.log(user_email + user_mobile + user_name);

  connection.query("update  tbl_user set user_name = ? , user_email = ? , user_mobile = ? where user_id = ?  " ,[user_name,user_email,user_mobile,user_id],function(err,respond){
      if (err) {
        Response.errorResponse(err,res);
      } else {
        Response.successResponse('Record updated!',res,{});
      }
     });
});



















/*

HTML Based Data Rendring

*/


//List Table Data
router.get('/display', function(req, res,next) {
    console.log("First");

    connection.query("select * from tbl_user",function(err,rows){
        if(err) throw err;
        console.log(rows);
        console.log("After Data Load");
        res.render('display-table',{users:rows});
      })
});


//Call Add Form Method
router.get('/add', function(req, res, next) {
    res.render('add-form');
});
 
//Add Form Processing using Post Method 
router.post('/add', function(req, res) {
    
    
    console.log(req.body);
    const mybodydata = {
        user_name: req.body.user_name,
        user_email: req.body.user_email,
        user_mobile: req.body.user_mobile
    }
     
    connection.query("insert into tbl_user set ?",mybodydata,function(err,result){
        if(err) throw err; 
         res.redirect('/add');
        });
});

//Delete User By ID
router.get('/delete/:id', function(req, res) {

     var deleteid = req.params.id;
  
    console.log("Delete id is " + deleteid);
   connection.query("delete from tbl_user where user_id = ? ",[deleteid],function(err,rows){
      if(err) throw err;
      console.log(rows);
      console.log("Record  Deleted");
      res.redirect('/display');
    })
    

 
});

//Get Single User By ID
router.get('/show/:id', function(req, res) {
    var showid = req.params.id;
    console.log(req.params.id);
    console.log("Show id is " + showid);
       
    connection.query("select * from tbl_user where user_id = ? ",[showid],function (err,rows)
    {
        console.log(rows);
        if(err) throw err;
        res.render("show",{users:rows});
  
    })
});

//Get Single User for Edit Record
router.get('/edit/:id', function(req, res) {
   
    console.log("Edit id is : "+ req.params.id);
      
    var user_id = req.params.id;
    connection.query("select * from tbl_user where user_id = ? ",[user_id],function (err,rows)
    {
    if(err) throw err;
    console.log(rows);
    res.render("edit-form",{users:rows});
    })

});

//Update Record Using Post Method
router.post('/edit/:id', function(req, res) {
  console.log("Edit ID  is"+ req.params.id);

  /*const mybodydata = {
    user_name: req.body.user_name,
    user_email: req.body.user_email,
    user_mobile: req.body.user_mobile 
    } */
  var userid = req.params.id;
  var username = req.body.user_name;
  var useremail = req.body.user_email;
  var usermobile = req.body.user_mobile;
  
    connection.query("update  tbl_user set user_name = ? , user_email = ? , user_mobile = ? where user_id = ?  " ,[username,useremail,usermobile,userid],function(err,respond){
        if(err) throw err; 
        res.redirect('/display');
       });

});

module.exports = router;
