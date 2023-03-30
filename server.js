const express = require("express");
const fs = require("fs");
const bodyparser = require("body-parser");
const app = express();
var request = require("request");
const { response } = require("express");
const parser = require("xml2js");
const xml = require("x2js");
const {LocalStorage} = require('node-localstorage');
const localStorage = new LocalStorage('./localStorage');
app.use(bodyparser.json());
console.log('deployed')
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  next();
});

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
var custid;
app.post("/customer", function (req, res) {
  var custpass;

  custid = req.body.custid;
  custpass = req.body.custpass;

  console.log(custid,custpass,'inputs');
  localStorage.setItem('auth',custid);
  console.log(localStorage.getItem('auth'));
  console.log(typeof custid,"type off");
  var options = {
    method: "POST",
    url: "https://dxbktlds4.kaarcloud.com:4300/sap/bc/srt/rfc/sap/zes_login_15_01/100/zes_login_15_01/zes_login_15_01",
    headers: {
      "Content-Type": "application/soap+xml",
      SOAPAction:
        "urn:sap-com:document:sap:rfc:functions:ZES_LOGIN_15_01:ZSK_LOGINRequest",
      Authorization: "Basic QWJhcGVyOkFiYXBlckAxMjM=",
      Cookie: "sap-usercontext=sap-client=100",
    },
    body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:urn="urn:sap-com:document:sap:rfc:functions">\r\n   <soap:Header/>\r\n   <soap:Body>\r\n      <urn:ZSK_LOGIN>\r\n         <P_CUSTOMERID>'+ custid +'</P_CUSTOMERID>\r\n         <P_PASSWORD>' + custpass+' </P_PASSWORD>\r\n      </urn:ZSK_LOGIN>\r\n   </soap:Body>\r\n</soap:Envelope>',
  };

  request(options, function (error, response) {
    if (error) throw new Error(error);
    var data = new xml();
    var xmljs = data.xml2js(response.body);
    xmljs = JSON.stringify(xmljs);
    res.send(xmljs);
  });

  console.log(custid);
});
app.get("/logout", function(req, res) {
  localStorage.removeItem('auth');
  console.log(localStorage.getItem('auth'), "logout");
  res.send("Logged out successfully");
});
//DONE
app.post("/profile", function (req, res) {
  var options = {
    'method': 'POST',
    'url': 'https://dxbktlds4.kaarcloud.com:4300/sap/bc/srt/rfc/sap/zes_sk_profile/100/zes_sk_profile/zes_sk_profile',
    'headers': {
      'Content-Type': 'application/soap+xml',
      'SOAPAction': 'urn:sap-com:document:sap:rfc:functions:ZSK_FM_PROFILE:ZSK_FM_PROFILEResponse',
      'Authorization': 'Basic QWJhcGVyOkFiYXBlckAxMjM=',
      'Cookie': 'sap-usercontext=sap-client=100'
    },
    body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:urn="urn:sap-com:document:sap:rfc:functions">\r\n   <soap:Header/>\r\n   <soap:Body>\r\n      <urn:ZSK_FM_PROFILE>\r\n         <!--Optional:-->\r\n         <IT_KNA1>\r\n            <!--Zero or more repetitions:-->\r\n            <item>\r\n             \r\n            </item>\r\n         </IT_KNA1>\r\n         <P_CUSTOMER_ID>'+ localStorage.getItem('auth')+'</P_CUSTOMER_ID>\r\n      </urn:ZSK_FM_PROFILE>\r\n   </soap:Body>\r\n</soap:Envelope>'
  
  };

  request(options, function (error, response) {
    if (error) throw new Error(error);
    var data = new xml();
    var xmljs = data.xml2js(response.body);
    xmljs = JSON.stringify(xmljs);
    res.send(xmljs);
  });

  console.log(custid);
});

//done
app.post("/invoice", function (req, res) {
  var options = {
    'method': 'POST',
    'url': 'https://dxbktlds4.kaarcloud.com:4300/sap/bc/srt/rfc/sap/zes_sk_invoice/100/zes_sk_invoice/zes_sk_invoice',
    'headers': {
      'Content-Type': 'application/soap+xml',
      'SOAPAction': 'urn:sap-com:document:sap:rfc:functions:ZES_SK_INVOICE:ZSK_FM_INVOICEResponse',
      'Authorization': 'Basic QWJhcGVyOkFiYXBlckAxMjM=',
      'Cookie': 'sap-usercontext=sap-client=100'
    },
    body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:urn="urn:sap-com:document:sap:rfc:functions">\r\n   <soap:Header/>\r\n   <soap:Body>\r\n      <urn:ZSK_FM_INVOICE>\r\n         <IM_CUSID>'+ localStorage.getItem('auth')+'</IM_CUSID>\r\n         <!--Optional:-->\r\n         <IT_INVOICE_LIST>\r\n            <!--Zero or more repetitions:-->\r\n            <item>\r\n               \r\n            </item>\r\n         </IT_INVOICE_LIST>\r\n      </urn:ZSK_FM_INVOICE>\r\n   </soap:Body>\r\n</soap:Envelope>'
  
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    var data = new xml();
    var xmljs = data.xml2js(response.body);
    xmljs = JSON.stringify(xmljs);
    res.send(xmljs);
  });

  console.log(custid);
});

app.post("/inquiry", function (req, res) {
  var options = {
    'method': 'POST',
    'url': 'https://dxbktlds4.kaarcloud.com:4300/sap/bc/srt/rfc/sap/zes_sk_inquiry/100/zes_sk_inquiry/zes_sk_inquiry',
    'headers': {
      'Content-Type': 'application/soap+xml',
      'SOAPAction': 'urn:sap-com:document:sap:rfc:functions:ZSK_FM_INQUIRY:ZSK_FM_INQUIRYResponse',
      'Authorization': 'Basic QWJhcGVyOkFiYXBlckAxMjM=',
      'Cookie': 'sap-usercontext=sap-client=100'
    },
    body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:urn="urn:sap-com:document:sap:rfc:functions">\r\n   <soap:Header/>\r\n   <soap:Body>\r\n      <urn:ZSK_FM_INQUIRY>\r\n         <!--Optional:-->\r\n         <IT_INQUIRY_LIST>\r\n            <!--Zero or more repetitions:-->\r\n            <item>\r\n              \r\n            </item>\r\n         </IT_INQUIRY_LIST>\r\n         <P_CUSTOMER_ID>' + localStorage.getItem('auth') + '</P_CUSTOMER_ID>\r\n      </urn:ZSK_FM_INQUIRY>\r\n   </soap:Body>\r\n</soap:Envelope>'
  
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    var data = new xml();
    var xmljs = data.xml2js(response.body);
    xmljs = JSON.stringify(xmljs);
    res.send(xmljs);
  });

  console.log(custid);
});
//DONE
app.post("/creditdebit", function (req, res) {
  var options = {
    'method': 'POST',
    'url': 'https://dxbktlds4.kaarcloud.com:4300/sap/bc/srt/rfc/sap/zes_sk_credeb/100/zes_sk_credeb/zes_sk_credeb',
    'headers': {
      'Content-Type': 'application/soap+xml',
      'SOAPAction': 'urn:sap-com:document:sap:rfc:functions:ZES_SK_CREDEB:ZSK_FM_CREDEBResponse',
      'Authorization': 'Basic QWJhcGVyOkFiYXBlckAxMjM=',
      'Cookie': 'sap-usercontext=sap-client=100'
    },
    body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:urn="urn:sap-com:document:sap:rfc:functions">\r\n   <soap:Header/>\r\n   <soap:Body>\r\n      <urn:ZSK_FM_CREDEB>\r\n         <!--Optional:-->\r\n         <IT_CREDIT>\r\n            <!--Zero or more repetitions:-->\r\n            <item>\r\n               \r\n            </item>\r\n         </IT_CREDIT>\r\n         <!--Optional:-->\r\n         <IT_DEBIT>\r\n            <!--Zero or more repetitions:-->\r\n            <item>\r\n               \r\n            </item>\r\n         </IT_DEBIT>\r\n         <P_CUSTOMER_ID>'+ localStorage.getItem('auth') +'</P_CUSTOMER_ID>\r\n      </urn:ZSK_FM_CREDEB>\r\n   </soap:Body>\r\n</soap:Envelope>'
  
  };

  request(options, function (error, response) {
    if (error) throw new Error(error);
    var data = new xml();
    var xmljs = data.xml2js(response.body);
    xmljs = JSON.stringify(xmljs);
    res.send(xmljs);
  });

  console.log(custid);
});

app.post("/payments", function (req, res) {
  var options = {
    'method': 'POST',
    'url': 'https://dxbktlds4.kaarcloud.com:4300/sap/bc/srt/rfc/sap/zes_sk_payments/100/zes_sk_payments/zes_sk_payments',
    'headers': {
      'Content-Type': 'application/soap+xml',
      'SOAPAction': 'urn:sap-com:document:sap:rfc:functions:ZSK_FM_PAYMENT:ZSK_FM_PAYMENTResponse',
      'Authorization': 'Basic QWJhcGVyOkFiYXBlckAxMjM=',
      'Cookie': 'sap-usercontext=sap-client=100'
    },
    body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:urn="urn:sap-com:document:sap:rfc:functions">\r\n   <soap:Header/>\r\n   <soap:Body>\r\n      <urn:ZSK_FM_PAYMENT>\r\n         <!--Optional:-->\r\n         <IT_DET>\r\n            <!--Zero or more repetitions:-->\r\n            <item>\r\n              \r\n            </item>\r\n         </IT_DET>\r\n         <P_CUSTOMER_ID>'+ localStorage.getItem('auth') +'</P_CUSTOMER_ID>\r\n      </urn:ZSK_FM_PAYMENT>\r\n   </soap:Body>\r\n</soap:Envelope>'
  
  };

  request(options, function (error, response) {
    if (error) throw new Error(error);
    var data = new xml();
    var xmljs = data.xml2js(response.body);
    xmljs = JSON.stringify(xmljs);
    res.send(xmljs);
  });

  console.log(custid);
});
//Done
app.post("/salesorder", function (req, res) {
  var options = {
    'method': 'POST',
    'url': 'https://dxbktlds4.kaarcloud.com:4300/sap/bc/srt/rfc/sap/zes_sk_saleorder/100/zes_sk_saleorder/zes_sk_saleorder',
    'headers': {
      'Content-Type': 'application/soap+xml',
      'SOAPAction': 'urn:sap-com:document:sap:rfc:functions:ZES_SK_SALESORDER:ZSK_FM_SALESORDERResponse',
      'Authorization': 'Basic QWJhcGVyOkFiYXBlckAxMjM=',
      'Cookie': 'sap-usercontext=sap-client=100'
    },
    body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:urn="urn:sap-com:document:sap:rfc:functions">\r\n   <soap:Header/>\r\n   <soap:Body>\r\n      <urn:ZFM_SK_SALESORDER>\r\n         <P_CUSTOMER_ID> ' + localStorage.getItem('auth') + '</P_CUSTOMER_ID>\r\n         <SALES_ORDER>\r\n            <!--Zero or more repetitions:-->\r\n            <item>\r\n    \r\n            </item>\r\n         </SALES_ORDER>\r\n         <SALES_ORG>0001</SALES_ORG>\r\n      </urn:ZFM_SK_SALESORDER>\r\n   </soap:Body>\r\n</soap:Envelope>'
  
  };

  request(options, function (error, response) {
    if (error) throw new Error(error);
    var data = new xml();
    var xmljs = data.xml2js(response.body);
    xmljs = JSON.stringify(xmljs);
    res.send(xmljs);
  });

  console.log(custid);
});
//DONE
app.post("/delivery", function (req, res) {
  var options = {
    'method': 'POST',
    'url': 'https://dxbktlds4.kaarcloud.com:4300/sap/bc/srt/rfc/sap/zes_sk_delivery/100/zes_sk_delivery/zes_sk_delivery',
    'headers': {
      'Content-Type': 'application/soap+xml',
      'SOAPAction': 'urn:sap-com:document:sap:rfc:functions:ZSK_FM_DELIVERY:ZSK_FM_DELIVERYResponse',
      'Authorization': 'Basic QWJhcGVyOkFiYXBlckAxMjM=',
      'Cookie': 'sap-usercontext=sap-client=100'
    },
    body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:urn="urn:sap-com:document:sap:rfc:functions">\r\n   <soap:Header/>\r\n   <soap:Body>\r\n      <urn:ZSK_FM_DELIVERY>\r\n         <!--Optional:-->\r\n         <IT_DELIVERY_LIST>\r\n            <!--Zero or more repetitions:-->\r\n            <item>\r\n               \r\n            </item>\r\n         </IT_DELIVERY_LIST>\r\n         <P_CUSTOMER_ID>'+ localStorage.getItem('auth') +'</P_CUSTOMER_ID>\r\n      </urn:ZSK_FM_DELIVERY>\r\n   </soap:Body>\r\n</soap:Envelope>'
  
  };

  request(options, function (error, response) {
    if (error) throw new Error(error);
    var data = new xml();
    var xmljs = data.xml2js(response.body);
    xmljs = JSON.stringify(xmljs);
    res.send(xmljs);
  });

  console.log(custid);
  console.log(localStorage.getItem('auth'),'local storage')
});


app.listen(3030, () => {
  console.log("server listening on 3030");
});
