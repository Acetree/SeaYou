

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
let port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server listening at port: " + port);
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


app.post('/getSomeRecords', (request, response) => {
  db.find({}, (errors, data) => {
    if (errors) {
      response.json({ status: false });
    } else {

      function getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }

      let numsToReturn;
      let seaShellList = [];

      function seaShellExist(randomSeaShellIndex) {
        for (let i = 0; i < seaShellList.length; i++) {
          if (seaShellList[i]._id == randomSeaShellIndex) {
            return true;
          }
        }
        return false;
      }

      if (data.length > 3) {
        numsToReturn = 2 + getRandomInt(3);
        while (numsToReturn > 0) {
          let randomSeaShellIndex = getRandomInt(data.length);
          if (!seaShellExist(data[randomSeaShellIndex]._id)) {
            let s = {
              fileName: data[randomSeaShellIndex].fileName,
              seaShellType: data[randomSeaShellIndex].seaShellType
            };
            seaShellList.push(s);
            numsToReturn--;
          }
        }
      } else {
        for (let i = 0; i < data.length; i++) {
          let s = {
            fileName: data[i].fileName,
            seaShellType: data[i].seaShellType
          };
          seaShellList.push(s);
        }
      }

      let remainNum = 4 + getRandomInt(4) - seaShellList.length;

      for (let i = 0; i < remainNum; i++) {
        let s = {
          fileName: "",
          seaShellType: getRandomInt(5)
        };
        seaShellList.splice(getRandomInt(seaShellList.length), 0, s);
      }
      

      let obj = { status: true, data: seaShellList };
      response.json(obj);
    }
  });
});

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
      upfile.mv('public/assets/userRecording/' + fileName);

      let timeType = request.body.timeType;
      let seaShellType = request.body.seaShellType;

      Date.prototype.Format = function (fmt) {
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
        seaShellType: seaShellType,
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