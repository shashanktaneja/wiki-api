const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const e = require("express");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/WikiDB", {useNewUrlParser: true});

const articleSchema = {
  content: String,
  title: String
};

const Article = mongoose.model('Article', articleSchema);

//--------------Requests targeting all Articles----------//

app.route("/articles")

.get(function(req,res){
  Article.find(function(err, foundarticles){
    if(!err){
      res.send(foundarticles);
    }
    else{
      res.send(err);
    }
  });
})

.post(function(req,res){
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if(!err){
      res.send("Article Added Successfully");
    }
    else{
      res.send(err);
    }
  });
})

.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted all the articles.");
    }
    else{
      res.send(err);
    }
  });
});

//--------------Requests targeting a particular Article----------//

app.route("/articles/:articleTitle")

.get(function(req,res){
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }
    else{
      res.send("No such article found.");
    }
  });
})

.put(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    // { new: true, overwrite: true },                             //not working
    function(err){
      if(!err){
        res.send("Successfully updated the article.");
      }
      else{
        res.send("Error");
      }
    }
  );
})

.patch(function(req,res){
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated the article.");
      }
      else{
        res.send(err);
      }
    }
  );
})

.delete(function(req,res){
  Article.deleteOne({title: req.params.articleTitle}, function(err){
    if(!err){
      res.send("Successfully deleted the article.");
    }
    else{
      res.send(err);
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});