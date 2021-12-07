//Server with Express
const { request, response } = require('express');
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');


const app = express();

// enable files upload
app.use(fileUpload({
  createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

//start app
app.listen(3000, () => {
  console.log('Listening at Port 3000');
});


//Serve files from the "public" folder
app.use(express.static('public'));

//Parse JSON data
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

//Init datastorage
let dataStore = require('nedb');
let db = new dataStore('seayou.db');
db.loadDatabase();



app.use('/', express.static('public'));

app.use('/lookFor', function(req,res){
  res.sendFile("public/look-for.html");
});




// app.get('/showPokemon', (request, response) => {
//   db.find({}, (errors, data) => {
//     if(errors){
//       response.json({ status: "task failed" });
//     }else{
//       let obj = { data: data };
//       response.json(obj);
//     }
//   });
// });

app.post('/saveRecording', (request, response) => {

  let currentDate = new Date();
  let obj = {
    date: currentDate,
    height: request.body.height,
    weight: request.body.weight
  }

  db.insert(obj, (errors, newDocs) => {
    if (errors) {
      response.json({ status: "task failed" });
    } else {
      response.json({ status: "success" });
    }
  })

})

app.post('/uploadRecording', async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded'
      });
    } else {
     
      let upfile = req.files.upfile;
      upfile.mv('userRecording/' + upfile.name);

      //send response
      res.send({
        status: true,
        message: 'File is uploaded',
        data: {
          name: upfile.name,
          mimetype: upfile.mimetype,
          size: upfile.size
        }
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});