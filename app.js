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
app.use(bodyParser.urlencoded({ extended: true }));
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

app.use('/lookFor', function (req, res) {
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

app.post('/uploadRecording', async (request, response) => {
  try {
    if (!request.files) {
      response.send({
        status: false,
        message: 'No file uploaded'
      });
    } else {

      let upfile = request.files.upfile;
      let fileName = upfile.name;
      upfile.mv('userRecording/' + fileName);

      let timeType = request.body.timeType;

      Date.prototype.Format = function (fmt) { //author: meizz 
        var o = {
          "M+": this.getMonth() + 1, //月份 
          "d+": this.getDate(), //日 
          "h+": this.getHours(), //小时 
          "m+": this.getMinutes(), //分 
          "s+": this.getSeconds(), //秒 
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
          "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
      }

      let timeString = new Date().Format("yyyyMMddhhmmssS");

      let item = {
        timeType: timeType,
        fileName: fileName,
        timeString: timeString
      };

      db.insert(item, (errors, newDocs) => {
        if (errors) {
          response.send({
            status: false,
            message: 'File uploaded failed'
          });
        } else {
          response.send({
            status: true,
            message: 'File is uploaded'
          });
        }
      })

    }
  } catch (errors) {
    response.status(500).send(errors);
  }
});