const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

const app = express();
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public_1"))

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB",{useNewUrlParser:true})

const articleSchema ={
    title : String,
    content:String
}

const Article = mongoose.model("Article",articleSchema)
//////// Request Targeting a All Article////////////////////
app.route("/articles")
    .get(function (req,res) {
    async function findByAll(){
        try{
            const foundArticles = await Article.find({})
            res.send(foundArticles)
        }catch (err) {
            console.log(err)
        }
    }
    findByAll().then()
})
    .post(function (req,res){
        const newArticle = new Article({
        title: req.body.title,
        content:req.body.content
    });
    newArticle.save().then(r =>{
            res.send("Successfully added a new article")
        }
    )
    })
    .delete(function (req,res) {
    async function deleteArticles(){
        try{
            await Article.deleteMany({});
            res.send("Successfully deleted all items")

        }catch (err) {
            console.log(err)

        }
    }
    deleteArticles().then();
});
//////// Request Targeting a specific Article////////////////////
app.route("/articles/:articleTitle")
    .get( async (req, res) => {
    try {
        const foundArticle = await Article.findOne({ title: req.params.articleTitle });
        if (foundArticle) {
            res.send(foundArticle);
        } else {
            res.send('No articles matching the given title');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
})
    // put is used for updating whole of the object and patch can be used to update any single entity, so we will be moving on with patch property
    .put(function (req,res) {
        async function updateArticle(){
            try{
                await Article.updateOne({
                        title: req.params.articleTitle},
                    {
                        title: req.body.title,
                        content:req.body.content
                    }
                    )


            }catch (err) {
                console.log(err)
            }
        }
updateArticle().then(r=>{
    res.send("Successfully updated the changes")
})
    })
    .patch(function (req,res) {
        async function updateArticle(){
            try{
                await Article.updateOne({
                        title: req.params.articleTitle},
                    {
                      $set:req.body
                    }

                )


            }catch (err) {
                console.log(err)
            }
        }
        updateArticle().then(r=>{
            res.send("Successfully updated the changes")
        })
    })
    .delete(async function(req,res){
        try{
            await Article.deleteOne({title:req.params.articleTitle})
            res.send("Article Deleted Succesfully")
        }catch (err) {
            console.log(err)

        }
    })
app.listen(3000,function () {
    console.log("Server Started on port 3000")
})