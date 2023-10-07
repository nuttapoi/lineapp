const helpMsg = {
  "type": "text",
  "text": "Hi their\ni'm the old robot, i understand only 5number ex:00001\nit's the supplier id. Tell me your supID :-)\n"
}
const serverErrorMsg = {
  "type": "text",
  "text": "SERVER ERROR"
}
class FlexMsgItemBoxV {
    constructor (contents)
    {
        this.type = "box";
        this.layout = "vertical";
        this.margin = "xxl";
        this.spacing = "sm";
        this.contents = contents
      }
    }

class FlexMsgItemBoxH {
    constructor (contents)
    {
            this.type = "box";
            this.layout = "horizontal";
            this.contents = contents
        }
    }

class FlexMsgItemL {
    constructor (text)
    {
        this.type = "text";
        this.text = text;
        this.size = "sm";
        this.color = "#555555";
        this.flex = 0
      }
    }

 class FlexMsgItemR {
        constructor (text)
        {
            this.type = "text";
            this.text = text;
            this.size = "sm";
            this.color = "#111111";
            this.align = "end"
          }
        }

class FlexMsgAll {
       constructor (header,altText,items)
        {
            this.type = "flex";
            this.altText = altText;
            this.contents = {
                "type": "bubble",
                "styles": {
                  "footer": {
                    "separator": true
                  }
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": header,
                      "weight": "bold",
                      "color": "#1DB446",
                      "size": "sm"
                    },
                    {
                      "type": "separator",
                      "margin": "xxl"
                    },
                    items
                ]
            }
        }
      }        
    }
 
function flexMsgTest()
 {
    let item1L = new FlexMsgItemL("this is abook");
    let item1R = new FlexMsgItemR("15 ชิ้น");
    let item1Content = new Array(item1L,item1R); 
    let item1H = new FlexMsgItemBoxH(item1Content);
    let item1HContent = new Array(item1H);
    let itemVContent = new FlexMsgItemBoxV(item1HContent);
    let itemAll = new FlexMsgAll("SERVER ERROR","ติดต่อเครื่องที่ร้านไม่ด้",itemVContent);
    //var tmp = JSON.stringify(itemAll);
    return itemAll;
 }   

 function orderToFlex(json){
  var item1HContent = new Array();
  var orderFlex;
  if (json.length > 0) {
    
      for(var i = 0; i < json.length; i++) {
        let item1L = new FlexMsgItemL(json[i].businessName);
        let qty = json[i].calOrderLimitBuy + json[i].unitNameZ.trim();
        let item1R = new FlexMsgItemR(qty);
        //let item1R = new FlexMsgItemR(json[i].CalOrderLimitBuy+json[i].unitNameZ);
        let item1Content = new Array(item1L,item1R); 
        let item1H = new FlexMsgItemBoxH(item1Content);
        item1HContent.push(item1H);
        let itemVContent = new FlexMsgItemBoxV(item1HContent);
        orderFlex = new FlexMsgAll("รายการตามนี้ครับ","สั่งของด่วน..",itemVContent);
      }
  } else {
      let item1L = new FlexMsgItemL("ไม่มีของสั่ง...");
      let item1R = new FlexMsgItemR("1Mb");
      let item1Content = new Array(item1L,item1R); 
      let item1H = new FlexMsgItemBoxH(item1Content);
      item1HContent.push(item1H);
      let itemVContent = new FlexMsgItemBoxV(item1HContent);
      orderFlex = new FlexMsgAll("ยังไม่มีอะไรสั่งครับ","สต๊อกบวม..",itemVContent);
  }
       
    let orderflexjson = JSON.stringify(orderFlex);
    console.log(orderflexjson );
    return  orderFlex;
 }

 function FlexMsgDailyReport(json)
 {
      var item1HContent = new Array();
      var orderFlex;

      let item1L = new FlexMsgItemL("ยอดขาย");
      let sale = typeof json[0].sale === 'string' ? json[0].sale : json[0].sale.toString();
      let item1R = new FlexMsgItemR(sale);
      let item1Content = new Array(item1L,item1R); 
      let item1H = new FlexMsgItemBoxH(item1Content);
      item1HContent.push(item1H);

      let item2L = new FlexMsgItemL("กำไร");
      let profit = typeof json[0].profit === 'string' ? json[0].profit : json[0].profit.toFixed(2).toString();
      let item2R = new FlexMsgItemR(profit);
      let item2Content = new Array(item2L,item2R); 
      let item2H = new FlexMsgItemBoxH(item2Content);
      item1HContent.push(item2H);

      let item3L = new FlexMsgItemL("คนเข้า");
      let customers = typeof json[0].customerCount === 'string' ? json[0].customerCount : json[0].customerCount.toString();
      let item3R = new FlexMsgItemR(customers);
      let item3Content = new Array(item3L,item3R); 
      let item3H = new FlexMsgItemBoxH(item3Content);
      item1HContent.push(item3H);

      itemVContent = new FlexMsgItemBoxV(item1HContent);

      final = new FlexMsgAll("สรุปยอดขาย","ยอดขายถึงตอนนี้",itemVContent);
      return final;
 }

 var msgOk = 
  {
    "type": "flex",
    "altText": "This is a Flex message",
    "contents": {
      "type": "bubble",
      "styles": {
        "footer": {
          "separator": true
        }
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "RECEIPT",
            "weight": "bold",
            "color": "#1DB446",
            "size": "sm"
          },
          {
            "type": "separator",
            "margin": "xxl"
          },
          {
            "type": "box",
            "layout": "vertical",
            "margin": "xxl",
            "spacing": "sm",
            "contents": [
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "text": "Energy Drink",
                    "size": "sm",
                    "color": "#555555",
                    "flex": 0
                  },
                  {
                    "type": "text",
                    "text": "$2.99",
                    "size": "sm",
                    "color": "#111111",
                    "align": "end"
                  }
                ]
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "text": "Chewing Gum",
                    "size": "sm",
                    "color": "#555555",
                    "flex": 0
                  },
                  {
                    "type": "text",
                    "text": "$0.99",
                    "size": "sm",
                    "color": "#111111",
                    "align": "end"
                  }
                ]
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "text": "Bottled Water",
                    "size": "sm",
                    "color": "#555555",
                    "flex": 0
                  },
                  {
                    "type": "text",
                    "text": "$3.33",
                    "size": "sm",
                    "color": "#111111",
                    "align": "end"
                  }
                ]
              }
             ]
          }
        ]
      }
    }
  }

  function chunkArray(myArray, chunk_size){
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];
    
    for (index = 0; index < arrayLength; index += chunk_size) {
        myChunk = myArray.slice(index, index+chunk_size);
        // Do something if you want with the group
        tempArray.push(myChunk);
    }

    return tempArray;
  }

  module.exports = {
        flexMsgTest : flexMsgTest,
        orderToFlex : orderToFlex,
        helpMsg: helpMsg,
        serverErrorMsg: serverErrorMsg,
        chunkArray: chunkArray,
        FlexMsgDailyReport: FlexMsgDailyReport
  };