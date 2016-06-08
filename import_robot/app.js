var fs = require('fs');
var http = require('http');

//sheet 第二行开始导入
var excelName = './机器人男女信息表.xlsx';
var sheetname = '女';
var image_txt  = './girl_image_url.txt';

var image_content = fs.readFileSync(image_txt, {encoding : 'utf-8'}).split('\n');
var image_len = image_content.length

function getRandNum(n, m){
    return Math.round(Math.random()* (m - n) + n);
}

function posttoapi(obj){
    var data = JSON.stringify(obj);
    var opt = {
        method  :   "POST",
        host    :   "127.0.0.1",
        port    :   3000,
        path    :   '/manager/addUser?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VydHlwZSI6Ik1hbmFnZXIiLCJyZXN1bHRfaWQiOiI1NzA1YzMxNzliMzg5NzMwMWQzZmRjN2IiLCJ1c2VybmFtZSI6InJvb3RNYW5hZ2VyIiwiaWF0IjoxNDY1MzgzNTI5LCJleHAiOjE0NjUzODcxMjl9.jgRdS-RkoGrch4gqOMWn38lw7Y07ocWW8vyf4hzJhyw',
        headers: {  
            "Content-Type": 'application/json'
        }  
    }

    var req = http.request(opt, function(feed){
        if(feed.statusCode == 200){
            var body = '';
            feed.on('data', function(data){
                body += data;
            }).on('end', function(){
                console.log(body);
            });
        }
    });
    req.write(data);
    req.end();
}

(function(excelName){
    var xlsx = require('node-xlsx');
    var list = xlsx.parse(excelName);
    if(list){
        var sheetfoundflag = false;
        list.forEach(function(sheet){
            if(sheet["name"] == sheetname){
                sheetfoundflag = true;

                (function(data){
                    for(var i = 0;i < data.length;i++){
                        if(i && data[i].length){
                            console.log(data[i]);
                            var randnum = getRandNum(0, image_len - 1);
                            posttoapi(
                                    {
                                        "gender"      : (data[i][0] == '男' ? 'M' : 'W'),
                                        "nickname"    : data[i][1],
                                        "singature"   : data[i][2],
                                        "picUrl"      : 'http://image.miusky.com/' + image_content[randnum],
                                        "state"       : "Normal",
                                        "type"        : "robot"
                                    }
                            );
                        }
                    }
                })(sheet.data);
            }
        });
        if(!sheetfoundflag){
            console.log("sheet not found");
        }
    } else {
        console.log('xlsx is null');
    }
})(excelName);

