//var imagedir = './';
//var outputfile = './imgurlout.txt';
//
//自动上传相片
//输出相片地址在outputfile 
var imagedir = './机器人男女资料包/帅哥头像/'
var outputfile = 'boy_image_url.txt';

var config = require('./config.json');
var qiniu = require("qiniu");
var fs = require('fs');
var path = require('path');


//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = config.access_key;
qiniu.conf.SECRET_KEY = config.secret_key;

//要上传的空间
bucket = config.bucket;

//构建上传策略函数
function uptoken(bucket, key) {
    var putPolicy = null;
  if(key){
      putPolicy = new qiniu.rs.PutPolicy(config.bucket + ':' + key);
  } else {
      putPolicy = new qiniu.rs.PutPolicy(config.bucket);
  }
  return putPolicy.token();
}

//生成上传 Token
token = uptoken(bucket);

//构造上传函数
function uploadFile(uptoken, localFile, callback) {
  var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(uptoken, null, localFile, extra, function(err, ret) {
      if(!err) {
        // 上传成功， 处理返回值
//        console.log(ret.hash, ret.key, ret.persistentId);
        callback(true, ret.key);
      } else {
        // 上传失败， 处理返回代码
        console.log(err);
        callback(false, ret.key);
      }
  });
}
//uploadFile(token, './11.jpg');

var rmOutFileCmd = require('child_process').exec('ps', function(){
    console.log();
    fs.readdir(imagedir, function(err, files){
        var upfilename = [];

        files.forEach(function(file){
            var stats = fs.statSync(path.join(imagedir, file));
            if(stats.isFile()){
                (function(){
                    var arr = file.split('.');
                    var len = arr.length;
                    var ext = arr[len - 1];

                    if('jpg' == ext || 'png' == ext || 'gif' == ext){
                        upfilename.push(path.join(imagedir, file));
                    }
                })();
            }
        });

        var finishedfilenum = 0;
        var filewritedata = '';

        for(var i = 0;i < upfilename.length;i++){
            (function(relativepathfile){
                uploadFile(token, relativepathfile, function(ok, key){
                    console.log(relativepathfile + ' upload');
                    console.log('get the image url : ' + 'http://image.miusky.com/' + key);

                    filewritedata += (key + '\n');

                    if(ok){
                        finishedfilenum++;
                        if(finishedfilenum ==  upfilename.length){
                            fs.writeFile(outputfile, filewritedata,
                                    {
                                        encoding : 'utf-8',
                                        mode : 777,
                                        flag : 'a'
                                    }, function(){
                                        console.log('all filename writeFile successfully');
                                    }
                                    )
                        }
                    } else {
                        console.log('somewrong');
                    }
                });
            })(upfilename[i]);
        }
    });
});
//调用uploadFile上传
//uploadFile(token, key, filePath);


