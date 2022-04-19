/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose= require('mongoose');

mongoose.connect(process.env.DB,{useNewUrlParser:true,useUnifiedTopology:true},
  () => {
    console.log('Connected to MongoDB');
  });
// create schema for books
const bookSchema = new mongoose.Schema({
  title:{type:String,required:true},
  commentcount: {type:Number,default:0},
  comments:{type:[String],default:[]}
})
const book = mongoose.model("book",bookSchema);
module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      
        book.find({},(err,query)=>{
          res.json(query)
        })
     
      
    })
    
    .post(function (req, res){
      //response will contain new book object including atleast _id and title
      let title = req.body.title;
      if (!title){
        res.send('missing required field title');
        return
      }
      let newBook = new book({title: title})
      newBook.save((err,data)=>{
        if(err||!data){console.log('error saving')}
        else{
          res.json({_id:data._id,title:data.title})
          }
        })
      
      
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      book.remove({},(err,data)=>{
        if (err){
          console.error(err);
        }else{
          res.send('complete delete successful');
        }
      })
      
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      book.findById(bookid,(err,query)=>{
         
          if (!query){
            res.send('no book exists')
          } else{
            res.json({_id:query._id,
              title:query.title,
              comments:query.comments,
              commentcount:query.comments.length
              })
          }
          
        })
    })
    
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment){
        res.send('missing required field comment')
        return 
      }
      book.findById(bookid,(err,query)=>{
        
        if (!query){
          res.send('no book exists')
        } else{
          query.comments.push(comment);
          query.commentcount= query.comments.length;
          query.save((err,data)=>{
            if (err){
              console.error(err);
            }else{
              res.json({_id:query._id,
                title:query.title,
                comments:query.comments,
                commentcount:query.comments.length
                });
            }
          })
        }
        
      })
      
      

    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      book.findByIdAndRemove(bookid,(err,query)=>{
        if (err){
          console.log(err)
        }
        if (!query){
          res.send('no book exists')
        } else{
          res.send('delete successful');
        }
        
      })

    });
  
};
