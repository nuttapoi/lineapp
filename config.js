// config.js
const dotenv = require('dotenv');
dotenv.config();
// console.log(`Your port is ${process.env.PORT}`); // 8626
// console.log(`Your port is ${process.env.channelAccessToken}`); // 8626
// console.log(`Your port is ${process.env.channelSecret}`); // 8626
module.exports = {
    port : process.env.port,
    channelAccessToken : process.env.channelAccessToken,
    channelSecret : process.env.channelSecret,
    mysqlhost : process.env.mysqlhost,
    mysqluser : process.env.mysqluser,
    mysqlpw : process.env.mysqlpw,
    mysqldb : process.env.mysqldb
};