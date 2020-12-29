const logo = require('../../config.js').logo
const portal=require('../../config.js').portal
const login = require('../../config.js').opURL
const gtick = require('../../config.js').gtick
const rcross = require('../../config.js').rcross
const tmURL = require('../../config.js').tmURL
module.exports={
  template:(sendMailData)=>{
    sendMailData["logo"]=logo
    sendMailData["portal"]=portal
    sendMailData["login"]=login
    sendMailData["gtick"]=gtick
    sendMailData["rcross"]=rcross
    sendMailData["tmURL"]=tmURL
    return `<!doctype html>
    <html>
        <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Entity Approval Notification</title>
      <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" >
      <link href="https://fonts.googleapis.com/css?family=Roboto:300,400&display=swap" rel="stylesheet">
        <style type="text/css">
      html,  body {
      margin: 0 !important;
      padding: 0 !important;
      height: 100% !important;
      width: 100% !important;
    }
    * {
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }
    .ExternalClass {
      width: 100%;
    }
    
    table,  td {
      padding:0px 32px;
    }
    table {
      border-spacing: 0 !important;
      border-collapse: collapse !important;
      table-layout: fixed !important;
      margin: 0 auto !important;
    }
    
    table  tr{
      line-height:35px;
      margin-bottom:20px;
    }
    
    
    .Welcome-for-PETM {
         width: 550px;
        min-height: 600px;
        background-color: #fefefe;
        margin: 10px auto;
        padding: 39px 25px 15px 25px;
        box-sizing: border-box;
        border: 1px solid #b5b5b5;
      }
      
    .Rectangle {
        width: 500px;
        box-shadow: 0 0 2px 0 rgba(233, 233, 233, 0.5);
        background-color: #ffffff;
        margin: 0px auto;
        box-sizing: border-box;
        padding-bottom: 21px;
    }
    
     .Rectangle  p{
       margin:0px;
     }
    
    
    .logo {
      width: 110px;
      height: 46.2px;
      opacity: 0.74;
      margin-bottom: 12px;
      margin-left: 34px;
    }
    
    .WelcomeText {
      height: 24px;
      font-family: 'Roboto';
      font-size: 19px;
      font-weight: 700;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: center;
      color: #4b4c4c;
      padding: 0px;
        margin: 0px 0px 42px 0px !important;
      text-transform:uppercase;
      
    }
    
    .globe {
        height: 50px;
        width: 120px;
      }
    
    ul.ruler {
         width: 360px;
        height: 4px;
        border-radius: 3.5px;
        list-style: none;
        text-align: center;
        margin: 0px auto;
      position:relative;
    }
    
    
    ul.ruler::before {
        width: 360px;
        content: "";
        height: 4px;
        border-radius: 3.5px;
        background-color: #f8f8f8;
        position: absolute;
        top: 11px;
        left: 19px;
    }
    
    
    ul.ruler li {
        width: 68px;
        min-height: 23px;
        float: left;
        margin-right: 66px;
        font-family: 'Roboto';
        font-size: 8px;
        font-weight: 300;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: center;
        color: #aeafaf;
        position: relative;
    }
    
    
    .disablelink{
    color: #ccc;
    }
    
    .fa-check-circle{
    font-size: 23px;
        width: 14px;
        color: #00ae23;
    }
    
    .In-case-of-any-assis {
      width: 380px;
      font-family: 'Roboto';
      font-size: 12px;
      font-weight: 300;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.42;
      letter-spacing: normal;
      color: #474747;
    }
    
    .TM-NameE {
      font-family: 'Roboto';
      font-size: 12px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.86;
      letter-spacing: normal;
      color: #474747;
      margin-bottom: 17px !important;
    }
    
    .login{
        width: 107px;
        height: 30px;
        background-color: #2fa4f2;
        color: #ffffff;
        font-size: 12px;
        padding: 9px 10px 9px 14px;
      text-decoration:none;
      font-family: 'Roboto';
    
    }
    
    .Dear-Telemarketer {
     font-family: 'Roboto';
      font-size: 14px;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #474747;
      margin-bottom:9px !important;
    }
    
    .logo-section{
        height: 78px;
        background-color: #2fa4f2;
        line-height: 98px;
        box-sizing: border-box;
        padding: 10px 0px 17px 0px;
        margin: 0px;
        margin-bottom: 34px !important;
      text-align: center;
    }
    
    
    
    .Powered-By-Teledgers {
         font-family: 'Roboto';
        font-size: 9px;
        font-weight: 300;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.67;
        letter-spacing: normal;
        text-align: center;
        color: #bcbcbc;
        margin: 0px;
        margin-top: 17px;
    }
    
             @media screen and (max-width: 600px) {
    
                .email-container {
                    width: 100% !important;
    
                }
    
               .Welcome-for-PETM{
               width: 100% !important;
        margin: 0px;
        padding: 10px;
           }
           
             .Rectangle{
             width:100% !important;
           }
           
        ul.ruler::before {
            width: 242px;
            content: "";
            height: 4px;
            border-radius: 3.5px;
            background-color: #f8f8f8;
            position: absolute;
            top: 11px;
            left: 19px;
           }
         
    ul.ruler {
        width: 100%;
        height: 100%;
        border-radius: 3.5px;
        list-style: none;
        text-align: center;
        margin: 0px auto;
        position: relative;
          padding-left: 0px;
            margin-left: 0px;
    }
        ul.ruler li {
            width: 41px;
        }
                    
            }
        
        
    .approved {
        font-family: Roboto;
        font-size: 30px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #06c350;
        padding: 15px 0px;
        background: #edfff5;
        width: 255px;
        position: relative;
        text-align: center;
      margin-bottom: 9px !important;
          display: flex;
        justify-content: center;
    }		
        
        .Group{
              margin-right: 7px;
        }
    
        </style>
        </head>
      
        <body bgcolor="#e0e0e0" width="100%" style="margin: 0;" yahoo="yahoo">
      <div class="Welcome-for-PETM">
       <div class="Rectangle">
         <p class="logo-section">
                  <img src=${sendMailData.logo} alt="alt_text" border="0" class="globe">
           </p>
          <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" class="email-container" style="width: 100%;">
        
      
                <tr>
                    <td style="text-align:center;">
              <p class="WelcomeText">Entity Header REgisteration status</p>
            </td>
                </tr>
          
        
        
                <tr>
            <td>
             <p class="Dear-Telemarketer"> <strong>Dear Entity,</strong></p>
              </td>
            </tr>
      
                <tr>
                    <td style="line-height: 30px; color: #474747; font-family: 'Roboto';">
            
            <p style="font-size: 12px; ">Your Header Registeration request is successful.</p>
            
            <p class="approved"><img src=${sendMailData.gtick}  class="Group"> APPROVED</p>
            
            <p style="font-size: 12px; ">Details are given below -</p>
            
            <p style="font-size: 14px; margin-bottom: 71px; ">
            
            
                
                  <strong>Entity ID ${sendMailData.peid}</strong> ${sendMailData.peName}<br>
              <strong>Header Name</strong> ${sendMailData.cli} <br> 
               
            </p>
              
            
                    </td>
                </tr>
          
          
                <tr>
                    <td>
                <p class="TM-NameE">
                Click below to check the Header Registeration Status.
               </p>
          </td>
                </tr>
          
          
             <tr>
                    <td>
            <p>
              <a class="login" href=${sendMailData.tmURL}>CHECK NOW <i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
              </p>
              </td>
                </tr>
          
                <tr>
                    <td>
            <p style="font-size: 12px; color: #474747;font-family: 'Roboto'; margin-top:54px !important;line-height: 17px;">
              Best Regards, <br>
              ${sendMailData.portal}
             </p>
                    </td>
              </tr>
        </table>
      </div>
      
       <p  class="Powered-By-Teledgers">
             Powered By Teledgers. Copyright © 2019 Connect Enterprise Solutions.
        </p>
      </div>
     
    </body>
    </html>`

  }
}
