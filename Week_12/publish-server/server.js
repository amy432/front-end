let http = require('http');
let https = require('https');
// let fs = require('fs');
let unzipper = require('unzipper');
let querystring = require('querystring');

// auth 路由：接受 code，用 code + client_id + client_secret 换取 token

function auth(request,response) {
    let query = querystring.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1]);
    getToken(query.code,function(info) {
       console.log(info);
       // response.write(JSON.stringify(info));
       response.write(`<a href='http://localhost:8083/?token=${info.token}'>publish</a>`)
       response.end();
    });
}

function getToken(code,callback) {
   let client_id = "Iv1.3dc05bb38dfc06d8";
   let client_secret = "d89993800eabac55d5135267ab05071945026d05";
   let request = https.request({
      hostname:"github.com",
      path:`/login/oauth/access_token?code=${code}&client_id=${client_id}&client_secret=${client_secret}`,
      port:443,
      method: "POST"
   },function(response){
       let body = "";
       response.on('data',chunk => {
          body += chunk.toString();
       });

       response.on('end',chunk => {       
         let o = querystring.parse(body);        
         callback(o);
      });
   });

   request.end();
}

// publish 路由： 用 token 获取用户信息，检查权限，接受发布
function publish(request,response) {    
   let query = querystring.parse(request.url.match(/^\/publish\?([\s\S]+)$/)[1]);
   if(query.token) {
      getUser(query.token,info=> {
         if(info.name === 'amy432') {
            //  let outFile = fs.createWriteStream('../server/public/tmp.zip');
            //  request.pipe(outFile); 

             request.pipe(unzipper.Extract({path:'../server/public/tmp.zip'}))   
         }
      });
   }  
}

function getUser(token){
   let request = https.request({
      hostname: "github.com",
      path:`/user`,
      port:443,
      method: "GET",      
      headers:{
         'Authorization':`token ${token}`
      }
  },(response,callback )=> {
      let body = "";
      response.on('data',chunk => {
         body += chunk.toString();
      });

     response.on('end',chunk => {       
      callback(JSON.stringify(body));
     });
  });
}

http.createServer(function(request, response){

   if(request.url.match(/^\/auth\?/))
       return auth(request,response);
   
   if(request.url.match(/^\/publish\?/))
       return publish(request,response);

  
}).listen(8082);