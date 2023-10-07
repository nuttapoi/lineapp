'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
//const config = require('./config.json');
const { port, channelAccessToken, channelSecret,
  mysqlhost,mysqldb,mysqluser,mysqlpw } = require('./config.js');
const axios = require('axios');
const fMsg = require('./flexMessage.js');
// create LINE SDK client
// console.log(`${port} ${channelAccessToken} ${channelSecret}`);
let API_LINEBOT = {
    "port": port,
    "channelAccessToken": channelAccessToken,
    "channelSecret": channelSecret
};

//const API_LINEBOT = JSON.stringify(obj);
//console.log(API_LINEBOT);
const client = new line.Client(API_LINEBOT);
const app = express();

const mysql      = require('mysql');
const connection = mysql.createConnection({
  "host"     : mysqlhost,
  "user"     : mysqluser,
  "password" : mysqlpw,
  "database" : mysqldb
});

connection.connect(function(err) {
    if (err) throw err;
});
// webhook callback
app.post('/webhook', line.middleware(API_LINEBOT), (req, res) => {
  // req.body.events should be an array of events
  if (!Array.isArray(req.body.events)) {
    return res.status(500).end();
  }
  // handle events separately
  Promise.all(req.body.events.map(event => {
    console.log('event', event);
    // check verify webhook event
    if (event.replyToken === '00000000000000000000000000000000' ||
      event.replyToken === 'ffffffffffffffffffffffffffffffff') {
      return;
    }
    return handleEvent(event);
  }))
    .then(() => res.end())
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// test server is ok
app.get('/', (req, res) => {
  res.send('Hello world tesxxxxt\n');
});

/* app.get('/mariadb/:id', function (req, res) {
    // res.send('Hello world im here\n');
    //let query_str = "CALL sp_getSupID(?,@output)";
    let query_str = "CALL sp_getUserID(?)";
    connection.query(query_str,[req.params.id],function (err, rows) {
        if (err) {
           res.status(400).send(err);
        }
        //let jsonResult = JSON.parse(rows);
        //res.status(200).send("OK");
        //res.status(200).send(jsonResult[0][0]['@OutSupID']);
        //res.status(200).send(rows[0][0]['@OutSupID']);
        //res.status(200).send(rows[0][0]['userId']);
        if (rows[0].length > 0)
        {        
          res.status(200).send(rows);
        }else{
          res.status(200).send("no data");
        }
    });
}); */
// test server is ok
app.get('/botIsActivate/', (req, res) => {
    let query_str = "CALL sp_getOwnerRoute(?)"
    connection.query(query_str,[req.query.infralution],function (err, rows) {
        if (err) {
           console.error(err);
           return res.status(200).send(JSON.stringify({"isBotActivate": false}));
        }
        if (rows[0].length > 0){
          return res.status(200).send(JSON.stringify({"isBotActivate": true}));
          
        } else {
          return res.status(200).send(JSON.stringify({"isBotActivate": false}));
        }
    });
});

app.get('/botOrder/', (req, res) => {
    let query_str = "CALL sp_getOrderRoute(?,?)";
    connection.query(query_str,[req.query.infralution,req.query.supID],function (err, rows) {
        if (err) {
           console.error(err);
           return res.status(500).end();
        }
        if (rows[0].length > 0){
          pushOrder(rows[0][0]['ddns'],rows[0][0]['userId'],rows[0][0]['supID']);
        }
    });
    res.status(200).end();
});

app.get('/botBill', (req, res) => {
    let query_str = "CALL sp_getBillRoute(?,?)";
    connection.query(query_str,[req.query.infralution,req.query.billID],function (err,rows) {
        if (err) {
          console.error(err);
          return res.status(500).end();
        }
        if (rows[0].length > 0) {
          let ddns = rows[0][0].ddns;
          let userId = rows[0][0].userId;
          axios.get(`${ddns}/api/bot_pushBill/${billID}`)
            .then((res) => pushMultiFlex(userId,res.data)
            )
            .catch((err) => {
              return res.status(500).end();
          });
        }
    });
    return res.status(200).end();
});

app.get('/botDailyReport', (req, res) => {
    //console.log("botDailyReport");
    let query_str = "CALL sp_getOwnerRoute(?)";
    connection.query(query_str,[req.query.infralution],function (err,rows) {
        if (err) {
          console.error(err);
          return res.status(500).end();
        }
        if (rows[0].length > 0) {
          let ddns = rows[0][0].ddns;
          let userId = rows[0][0].userId;
          pushDaily(ddns,userId);
        }
    });
    return res.status(200).end();
  });

app.get('/botUpdateProfile/:userID', (req, res) => {
    client.getProfile(req.params.userId).then((profile) => {
      let query_str = "CALL sp_updateProfile(?,?,?,?)";
      connection.query(query_str,[profile.userId,
        profile.displayName,profile.pictureUrl,profile.statusMessage],function (err) {
          if (err) {
            console.log(err);
            return res.status(500).end();
          }
        })
      });
    return res.status(200).end();
});

app.get('/scbSmsAlert', (req, res) => {
    let query_str = "CALL sp_getSmsAlert()"
    connection.query(query_str,function (err, rows) {
        if (err) {
           console.error(err);
           return res.statusi(500).end();
        }
        return res.status(200).send(JSON.stringify(rows[0]));
    });
});

app.post('/scbSmsAlert', (req, res) => {
      let query_str = "CALL sp_smsAlert(?,?)";
      connection.query(query_str,[req.body.from,req.body.text],function (err) {
          if (err) {
            console.log(err);
            return res.status(500).end();
          }
        });
    return res.status(200).end();
});

// simple reply function
// const replyText = (token, texts) => {
//   texts = Array.isArray(texts) ? texts : [texts];
//   return client.replyMessage(
//     token,
//     texts.map((text) => ({ type: 'text', text }))
//   );
// };
const replyText = (token, texts) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(token,fMsg.helpMsg);
}
// simple reply function
/* const replyText = (token, texts) => {
  let regex = /^[0-9]{1,5}$/;
  let supID = texts;
  if (regex.test(supID)){
  //const url = `${this.baseUrl}/api/rpt_minStock/${supID}`;
  let formattedNumber = ("0000" + supID).slice(-5);
  axios.get(`http://phonprasit.thddns.net:5544/api/rpt_pushOrder/${formattedNumber}`)
  //axios.get('http://localhost:3001/api/rpt_minStock/00001')
  .then((res) => parseFlex(token,res.data)
  );
  //let res = await axios.get('http://localhost:3001/api/rpt_minStock/00001');
  //console.log(res.data.login);
  }else{
    return client.replyMessage(token,fMsg.helpMsg)
  }
}; */

const pushOrder = (ddns,userID,supID) => {
  axios.get(`${ddns}/api/bot_pushOrder/${supID}`)
  .then((res) => pushMultiFlex(userID,res.data))
  .catch((err) => {
      console.error(err);
   });
};

const pushDaily = (ddns,userID) => {
  axios.get(`${ddns}/api/bot_pushDaily`)
  .then((res) => {
    if (res.data.length > 0){
    client.pushMessage(userID,fMsg.FlexMsgDailyReport(res.data));
    }
  })
  .catch((err) => {
      client.pushMessage(userID,fMsg.serverErrorMsg);
   });
};

function parseFlex(token,data){
   return client.replyMessage(token,fMsg.orderToFlex(data[0]))
}
function pushMultiFlex(userID,data){
   let order  = fMsg.chunkArray(data,30);
   for(var i = 0; i < order.length; i++) {
      client.pushMessage(userID,fMsg.orderToFlex(order[i]))
   }
}
const logUserID = (userId) => {
    let query_str = "CALL sp_logUserId(?)";
    connection.query(query_str,[userId],function (err) {
        if (err) {
          return console.log(err);
        }
    });
      return console.log(`Success log userId`);
};

function UpdateProfile(userId){
}

function IsValidJSONString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

// callback function to handle a single event
function handleEvent(event) {
  switch (event.type) {
    case 'message':
      const message = event.message;
      switch (message.type) {
        case 'text':
          return handleText(message, event.replyToken);
        case 'image':
          return handleImage(message, event.replyToken);
        case 'video':
          return handleVideo(message, event.replyToken);
        case 'audio':
          return handleAudio(message, event.replyToken);
        case 'location':
          return handleLocation(message, event.replyToken);
        case 'sticker':
          return handleSticker(message, event.replyToken);
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`);
      }

    case 'follow':
      return logUserID(event.source.userId);
      //return replyText(event.replyToken, 'Got followed event');

    case 'unfollow':
      return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

    case 'join':
      return logUserID(event.replyToken, event.source);

    case 'leave':
      return console.log(`Left: ${JSON.stringify(event)}`);

    case 'postback':
      let data = event.postback.data;
      return replyText(event.replyToken, `Got postback: ${data}`);

    case 'beacon':
      const dm = `${Buffer.from(event.beacon.dm || '', 'hex').toString('utf8')}`;
      return replyText(event.replyToken, `${event.beacon.type} beacon hwid : ${event.beacon.hwid} with device message = ${dm}`);

    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
}

function handleText(message, replyToken) {
 
  return replyText(replyToken, message.text);
}

function handleImage(message, replyToken) {
  return replyText(replyToken, 'Got Image');
}

function handleVideo(message, replyToken) {
  return replyText(replyToken, 'Got Video');
}

function handleAudio(message, replyToken) {
  return replyText(replyToken, 'Got Audio');
}

function handleLocation(message, replyToken) {
  return replyText(replyToken, 'Got Location');
}

function handleSticker(message, replyToken) {
  return replyText(replyToken, 'Got Sticker');
}

// async function asyncFunction() {
//   let conn;
//   try {
// 	conn = await pool.getConnection();
// 	const rows = await conn.query("SELECT * FROM userProfile");
// 	// const rows = await conn.query("SELECT * FROM userProfile");
// 	//console.log(rows); //[ {val: 1}, meta: ... ]
// 	// const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
// 	// console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
//     return rows;
//   } catch (err) {
// 	throw err;
//   } finally {
// 	if (conn) return conn.end();
//   }
// }
// const port = config.port;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
