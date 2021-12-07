
//Server with Express
const { request, response } = require('express');
let express = require('express');
let app = express();

//Serve files from the "public" folder
app.use(express.static('public'));

//Parse JSON data
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

//Init datastorage
let dataStore = require('nedb');
let db = new dataStore('seeyou.db');
db.loadDatabase();



app.use('/', express.static('public'));

app.use('/lookFor', function(req,res){
  res.sendFile("public/look-for.html");
});

app.listen(3000, () => {
  console.log('Listening at Port 3000');
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

// app.post('/savePokemon', (request, response) => {

//   let currentDate = new Date();
//   let obj = {
//     date: currentDate,
//     name: request.body.name,
//     height: request.body.height,
//     weight: request.body.weight
//   }

//   db.insert(obj, (errors, newDocs) => {
//     if (errors) {
//       response.json({ status: "task failed" });
//     } else {
//       response.json({ status: "success" });
//     }
//   })

// })

