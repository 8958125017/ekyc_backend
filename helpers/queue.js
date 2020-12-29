const amqp = require('amqplib/callback_api');
const nodemailer = require('nodemailer');
const config = require('./config')
const constant = require('./constant')
const complaint = require('../controllers/complaint')
const dmanager = require('../controllers/dltToDb')
const headerDb = require('../models/header')
const templateDb = require('../models/template')
const helpers = require('../helpers/helper')
const Hyperledger = require("../helpers/network");
var globalCh

var elasticsearch = require('elasticsearch');
var elasticsearch_client = constant.elasticsearch_client

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.emailAddress,
    pass: config.emailPassword
  }
});

// let transporter = nodemailer.createTransport({
//   service : 'mail.infotelconnect.com',
//   host: 'mail.infotelconnect.com',
//   path: '/usr/sbin/sendmail',
//   port : 25,
//   secure : false,
//   sendmail: true,
//   newline: 'windows',
//   logger: false
// });

amqp.connect(config.queue, function(err, conn) {
  conn.createChannel(function(err, ch) {
    // Declaring queues
    const q = constant.mailQueue;

// ************************** EMAIL Consumer ***********************
    ch.assertQueue(q, { durable: true });
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, async function(msg) {
      console.log(" [x] Received");
      let mailOptions = JSON.parse(msg.content.toString());
        await transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log('Error occurred while sending mail ============ :::::', error);
            // callback("Mail sent failed")
            // return res.send({
            //   statusCode: 500,
            //   message: error
            // })
          } else {
            console.log('********************** Mail sent successfully **************************')
            // callback("Mail sent succesfully")
          }
        })
        ch.ack(msg);
    }, { noAck: false });
// *************************** END EMAIL CONSUMER ***********************

  });
});



// ************************** DLT to DB Consumer (DLT MANAGER) ***********************
amqp.connect(config.queue, function(err, connDlt) {
  connDlt.createChannel(function(err, chDLT) {
    globalCh = chDLT
    const dltToDbQueue = constant.dltToDbQueue
    chDLT.assertQueue(dltToDbQueue, { durable: true });
    chDLT.consume(dltToDbQueue, saveConsumer, { noAck: false });
  })
})
// ************************** END DLT to DB Consumer (DLT MANAGER) ***********************




/* ********************** FUNCTIONS FOR DLT MANAGER ******************************
  Consumer processing functions for DLT.
********************************************************************************* */
function saveConsumer(msg) {
  console.log("=====Save Consumer===========",JSON.parse(msg.content.toString()));
  data = JSON.parse(msg.content.toString())
  console.log('========== cli ========', data)
  if(data.type == 'header-pe') {
    esHeaderEntity(data.data.cli, data.ename, (cb) => {
      console.log('========== cb header pe ==========', cb)
      dmanagerAck(cb, msg)
    })
  }
  else if(data.type == 'header-tm') {
    console.log("=====Data ename====",data.ename);
    esHeaderTm(data.data.cli, data.tmid, data.ename, (cb) => {
      console.log('========== cb header tm ==========', cb)
      dmanagerAck(cb, msg)
    })
  }
  else if(data.type == 'header-op') {
    esHeaderOp(data.data.cli, data.tmid, data.ename, (cb) => {
      console.log('========== cb header op ==========', cb)
      dmanagerAck(cb, msg)
    })
  }
  else if(data.type == 'template-pe') {
    esTemplatePe(data.data.urn,data.tmid, data.ename, (cb) => {
      console.log('========== cb template pe ==========', cb)
      dmanagerAck(cb, msg)
    })
  }
  else if(data.type == 'template-tm') {
    esTemplateTm(data.data.urn, data.tmid, data.ename, (cb) => {
      console.log('========== cb template tm ==========', cb)
      dmanagerAck(cb, msg)
    })
  }
  else if(data.type == 'template-op') {
    esTemplateOp(data.data.urn, data.tmid, data.ename, (cb) => {
      console.log('========== cb template op ==========', cb)
      dmanagerAck(cb, msg)
    })
  }
}

function dmanagerAck(resp, msg) {
  console.log('============ ack dmanager ack =============', resp)
  if(resp == 'done') {
    globalCh.ack(msg)
  }
  if(resp == 'reject') {
    globalCh.reject(msg, false)
  }
  if(resp == 'requeue') {
    globalCh.reject(msg, true)
  }
}

function esHeaderEntity(cli, ename, esHeaderCb) {
  let modelName
  let searchQuery =  {"query":{ "term": { "cli.keyword": cli }}}
  elasticsearch_client.search({
    index: constant.headerIndex,
    type: constant.headerType,
    body: searchQuery,
  },  function (error, response, status) {
    if(response) {
      if(response.hits){
        if(response.hits.hits){
          if(response.hits.hits[0]){
            let cliDataToInsert = response.hits.hits[0]['_source']
            console.log("--- Response ---", cliDataToInsert);
            if(cliDataToInsert.obj == 'HeaderVoice') {
              modelName = require('../models/cli')
            }
            else {
              modelName = require('../models/header')
            }
            delete cliDataToInsert['crtr']
            delete cliDataToInsert['uby']
            delete cliDataToInsert['obj']
            cliDataToInsert['sts'] = 'P'
            cliDataToInsert['ename'] = ename
            cliDataToInsert['_id'] = cli
            cliDataToInsert['uts'] = helpers.dateSeconds()
            cliDataToInsert['isMigration'] = true
            helpers.generateRefNo({request: "cli"}, callback => {
              console.log("Reference number callback ===================", callback);
              cliDataToInsert['referenceNo'] = callback;
            })

            modelName.create(cliDataToInsert)
            .then(insertSuccess => {
              return esHeaderCb('done')
            })
            .catch(insertFailure => {
              if(insertFailure.code == 11000) {
                //console.log('========== insert failure ==========', insertFailure)
                return esHeaderCb('reject')
              }
              return esHeaderCb('requeue')
            })
          }
          else return esHeaderCb('reject')
        }
        else return esHeaderCb('reject')
      }
      else return esHeaderCb('reject')
    }
    else return esHeaderCb('reject')
  });
}

function esHeaderTm(cli, tmid, ename, esHeaderCb) {
  let modelName
  let searchQuery =  {"query":{ "term": { "cli.keyword": cli }}}
  elasticsearch_client.search({
    index: constant.headerIndex,
    type: constant.headerType,
    body: searchQuery,
  },  function (error, response, status) {
    if(response) {
      if(response.hits) {
        if(response.hits.hits) {
          if(response.hits.hits[0]) {
            let cliDataToInsert = response.hits.hits[0]['_source']
            console.log("--- Response ---", cliDataToInsert);
            if(cliDataToInsert.obj == 'HeaderVoice') {
              modelName = require('../models/cli')
            }
            else {
              modelName = require('../models/header')
            }
            delete cliDataToInsert['crtr']
            delete cliDataToInsert['uby']
            delete cliDataToInsert['obj']
            cliDataToInsert['sts'] = 'P'
            cliDataToInsert['ename'] = ename
            cliDataToInsert['_id'] = cli
            cliDataToInsert['tmid'] = tmid
            cliDataToInsert['uts'] = helpers.dateSeconds()
            cliDataToInsert['isMigration'] = true
            helpers.generateRefNo({request: "cli"}, callback => {
              console.log("Reference number callback ===================", callback);
              cliDataToInsert['referenceNo'] = callback;
            })

            modelName.create(cliDataToInsert)
            .then(insertSuccess => {
              return esHeaderCb('done')
            })
            .catch(insertFailure => {
              console.log('========= insertFailure.code ==========', insertFailure.code)
              if(insertFailure.code == 11000) {
                return esHeaderCb('reject')
              }
              return esHeaderCb('requeue')
            })
          }
          else return esHeaderCb('reject')
        }
        else return esHeaderCb('reject')
      }
      else return esHeaderCb('reject')
    }
    else return esHeaderCb('reject')
  });
}

function esHeaderOp(cli, tmid, ename, esHeaderCb) {
  console.log("=======ename======",ename);
  let modelName
  let searchQuery =  {"query":{ "term": { "cli.keyword": cli }}}
  elasticsearch_client.search({
    index: constant.headerIndex,
    type: constant.headerType,
    body: searchQuery,
  },  function (error, response, status) {
    if(response){
      if(response.hits) {
        if(response.hits.hits) {
          if(response.hits.hits[0]) {
            let cliDataToInsert = response.hits.hits[0]['_source']
            console.log("--- Response ---", cliDataToInsert);
            if(cliDataToInsert.obj == 'HeaderVoice') {
              modelName = require('../models/cli')
            }
            else {
              modelName = require('../models/header')
            }
            let etityname=ename;
            delete cliDataToInsert['crtr']
            delete cliDataToInsert['uby']
            delete cliDataToInsert['obj']
            cliDataToInsert['sts'] = 'A'
            cliDataToInsert['ename'] = ename
            cliDataToInsert['_id'] = cli
            cliDataToInsert['tmid'] = tmid
            cliDataToInsert['uts'] = helpers.dateSeconds()
            cliDataToInsert['isMigration'] = true
            helpers.generateRefNo({request: "cli"}, callback => {
              console.log("Reference number callback ===================", callback);
              cliDataToInsert['referenceNo'] = callback;
            })

            fun = 'uhs';
            obj = [JSON.stringify({
                "cli": cli,
                "sts": 'A',
                "uts": cliDataToInsert.uts
            })]
            console.log("====Insert Data======",cliDataToInsert);
            console.log("=========== Hyperledger Object ===========", obj)
            var publishData = {
                chaincodeId: constant.headersmsChaincodeId,
                chainId: constant.headersmsChainId,
                functionName: fun,
                args: obj
            }
            let req, res
            console.log('======== args ======== ', publishData.args);

            Hyperledger.publishStream(req, res, publishData, (hyperledgerData) => {
                console.log('========= Hyperledger Response ===========', hyperledgerData);
                if (hyperledgerData.statusCode == 200) {

                  modelName.create(cliDataToInsert)
                  .then(insertSuccess => {
                    return esHeaderCb('done')
                  })
                  .catch(insertFailure => {
                    if(insertFailure.code == 11000) {
                      console.log("===Reject========");
                      return esHeaderCb('reject')
                    }
                    return esHeaderCb('requeue')
                  })
                }
                else if(hyperledgerData.statusCode == 500)
                {
                  console.log("========test==========");
                  return esHeaderCb('reject')
                }
            })
          }
          else return esHeaderCb('reject')
        }
        else return esHeaderCb('reject')
      }
      else return esHeaderCb('reject')
    }
    else return esHeaderCb('reject')
  });
}

function esTemplatePe(urn, tmid, ename, esTemplateCb) {
  console.log("====esTemplatePe=======",urn,ename);
  let searchQuery =  {"query":{"multi_match":{"query":urn,"fields":["urn^1"],"type":"phrase_prefix"}}}
  elasticsearch_client.search({
    index: constant.templateIndex,
    type: constant.templateType,
    body: searchQuery,
  },  function (error, response, status) {
    if(response) {
      console.log("======Response=====",response);
      if(response.hits) {
        if(response.hits.hits) {
          if(response.hits.hits[0]) {
            let tempDataToInsert = response.hits.hits[0]['_source']
            console.log("--- Response ---", tempDataToInsert);
            let dataRef

            delete tempDataToInsert['crtr']
            delete tempDataToInsert['uby']
            delete tempDataToInsert['obj']

            tempDataToInsert['_id'] = tempDataToInsert['urn']

            if(tempDataToInsert["ttyp"] == "CTSMS") dataRef = 'CT'
            else dataRef = 'CS'
            helpers.generateRefNo({request: dataRef}, callback => {
              console.log("Reference number callback ===================", callback);
              tempDataToInsert['refNo'] = callback;
            })
            tempDataToInsert['ename'] = ename
            tempDataToInsert['type'] = dataRef
            tempDataToInsert['sts'] = 'P'
            tempDataToInsert['isOtpVerified'] = '1'
            tempDataToInsert['uts'] = helpers.dateSeconds()
            tempDataToInsert['isMigration'] = true
            tempDataToInsert["regEx"]=helpers.generateRegex(tempDataToInsert["tcont"]);
            console.log("=======template=======",tempDataToInsert);
            templateDb.create(tempDataToInsert)
            .then(insertSuccess => {
              return esTemplateCb('done')
            })
            .catch(insertFailure => {
              if(insertFailure.code == 11000) {
                return esTemplateCb('reject')
              }
              return esTemplateCb('requeue')
            })
          }
          else return esTemplateCb('reject')
        }
        else return esTemplateCb('reject')
      }
      else return esTemplateCb('reject')
    }
    else return esTemplateCb('reject')
  });
}

function esTemplateTm(urn, tmid, ename, esTemplateCb) {
  let searchQuery =  {"query":{"multi_match":{"query":urn,"fields":["urn^1"],"type":"phrase_prefix"}}}
  elasticsearch_client.search({
    index: constant.templateIndex,
    type: constant.templateType,
    body: searchQuery,
  },  function (error, response, status) {
      if(response) {
        if(response.hits) {
          if(response.hits.hits) {
            if(response.hits.hits[0]) {
              let tempDataToInsert = response.hits.hits[0]['_source']
              console.log("--- Response ---", tempDataToInsert);
              let dataRef

              delete tempDataToInsert['crtr']
              delete tempDataToInsert['uby']
              delete tempDataToInsert['obj']

              tempDataToInsert['_id'] = tempDataToInsert['urn']

              if(tempDataToInsert["ttyp"] == "CTSMS") dataRef = 'CT'
              else dataRef = 'CS'
              helpers.generateRefNo({request: dataRef}, callback => {
                console.log("Reference number callback ===================", callback);
                tempDataToInsert['refNo'] = callback;
              })
              tempDataToInsert['ename'] = ename
              tempDataToInsert['type'] = dataRef
              tempDataToInsert['sts'] = 'P'
              tempDataToInsert['isOtpVerified'] = '1'
              tempDataToInsert['tmid'] = tmid
              tempDataToInsert['uts'] = helpers.dateSeconds()
              tempDataToInsert['isMigration'] = true
              tempDataToInsert["regEx"]=helpers.generateRegex(tempDataToInsert["tcont"]);
              console.log("=======template=======",tempDataToInsert);
              templateDb.create(tempDataToInsert)
              .then(insertSuccess => {
                return esTemplateCb('done')
              })
              .catch(insertFailure => {
                if(insertFailure.code == 11000) {
                  return esTemplateCb('reject')
                }
                return esTemplateCb('requeue')
              })
            }
            else return esTemplateCb('reject')
          }
          else return esTemplateCb('reject')
        }
        else return esTemplateCb('reject')
      }
      else return esTemplateCb('reject')
  });
}

function esTemplateOp(urn, tmid, ename, esTemplateCb) {
  let searchQuery =  {"query":{"multi_match":{"query":urn,"fields":["urn^1"],"type":"phrase_prefix"}}}
  elasticsearch_client.search({
    index: constant.templateIndex,
    type: constant.templateType,
    body: searchQuery,
  },  function (error, response, status) {
      if(response) {
        if(response.hits) {
          if(response.hits.hits) {
            if(response.hits.hits[0]) {
              let tempDataToInsert = response.hits.hits[0]['_source']
              console.log("--- Response ---", tempDataToInsert);
              let dataRef

              delete tempDataToInsert['crtr']
              delete tempDataToInsert['uby']
              delete tempDataToInsert['obj']

              tempDataToInsert['_id'] = tempDataToInsert['urn']

              if(tempDataToInsert["ttyp"] == "CTSMS") dataRef = 'CT'
              else dataRef = 'CS'
              helpers.generateRefNo({request: dataRef}, callback => {
                console.log("Reference number callback ===================", callback);
                tempDataToInsert['refNo'] = callback;
              })
              tempDataToInsert['ename'] = ename
              tempDataToInsert['type'] = dataRef
              tempDataToInsert['sts'] = 'A'
              tempDataToInsert['isOtpVerified'] = '1'
              tempDataToInsert['tmid'] = tmid
              tempDataToInsert['uts'] = helpers.dateSeconds()
              tempDataToInsert['isMigration'] = true
              tempDataToInsert["regEx"]=helpers.generateRegex(tempDataToInsert["tcont"]);
              var publishData = {
                chaincodeId: constant.templateChaincodeId,
                functionName: 'uts',
                chainId: constant.templateChainId,
                args: [urn, 'A', tempDataToInsert.uts]
              }

              console.log('\n \n ARGS ARGS ARGS ARGS \n \n', publishData.args);
              let req, res
              Hyperledger.publishStream(req, res, publishData, (callback) => {
                  if (callback.statusCode == 200) {
                    templateDb.create(tempDataToInsert)
                    .then(insertSuccess => {
                      return esTemplateCb('done')
                    })
                    .catch(insertFailure => {
                      console.log('======= template insert failure op ========', tempDataToInsert)
                      if(insertFailure.code == 11000) {
                        return esTemplateCb('reject')
                      }
                      return esTemplateCb('requeue')
                    })
                  }
                  else {
                    console.log('====== hyperledger failure op =======', callback)
                    return esTemplateCb('reject')
                  }
              })
            }
            else return esTemplateCb('reject')
          }
          else return esTemplateCb('reject')
        }
        else return esTemplateCb('reject')
      }
      else return esTemplateCb('reject')
  });
}

// ****************************** END CONSUMER DLT MANAGER FUNCTIONS ********************************
