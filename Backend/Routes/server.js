const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const app = express();

const mongoUrl = "mongodb+srv://XharkTank:XharkTank07@cluster0.diwtok4.mongodb.net/xharktank?retryWrites=true&w=majority";
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


//MIDDLEWARE
app.use(bodyParser.json());


//MODELS
const {Pitch} = require('../Models/pitch');
const {Offer} = require('../Models/offer');


//"GET" ROUTES:- 

app.get("/pitches", (req,res) => {
    Pitch.find().sort({createdAt: 'desc'}).populate("offer").exec((err,pitches) => {
        if(err) res.status(404).send(err);
        res.status(200).send(JSON.stringify(pitches));
    })
});

app.get("/pitches/:pitchid", (req,res) => {
    Pitch.findOne({id : req.params.pitchid}).populate("offer").exec((err, pitch) => {
        if(err) res.status(400).send(err);
        if(pitch)
            res.status(200).send(pitch);
        else
            res.status(201).send("Invalid Pitch ID");
    })
});


//"POST" ROUTES:-

app.post("/pitches", async (req,res) => {
    const id = await Pitch.count({}) + 1;
    const pitch = new Pitch({
        id,
        enterpreneur: req.body.enterpreneur,
        pitchTitle: req.body.pitchTitle,
        pitchIdea: req.body.pitchIdea,
        askAmount: req.body.askAmount,
        equity: req.body.equity,
        ceatedAt: Date.now(),
        offer: []
    })

    pitch.save((err, doc) => {
        if(err) res.status(400).send(err);
        res.status(200).send(doc);
    })
})

app.post("/pitches/:pitchid/makeOffer", async (req,res) => {

    Pitch.findOne({id: req.params.pitchid}, (err, pitch)=>{
        if(err) res.status(400).send(err);
        if(pitch){
            const offer = new Offer({
                id: pitch.id,
                investor: req.body.investor,
                amount: req.body.amount,
                equity: req.body.equity,
                comment: req.body.comment
            });
        
            offer.save((err, doc) => {
                if(err) res.status(400).send(err);
                const offers = pitch.offer;
                offers.push(doc);
                Pitch.findOneAndUpdate({id: pitch.id}, {offer: offers}, {new: true},(err, found)=>{
                    if(err) res.status(404).send(err);
                    res.status(200).send(`Offer Succesfully made to Pitch ID ${found.id}`);
                });
            });
        }
        else
            res.status(201).send("No such pitch exists");
    })
})

//PORT
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Starting Server on port ${port}`);
});