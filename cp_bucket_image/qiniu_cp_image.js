var cpCmdStr = './qshell batchcopy miusky miusky-official SrcDestKeyMapFile';
var fs = require('fs');
var cpCmd = exec(cpCmdStr);
var cpinfo = [];

cpCmd.stdout.on('data', function(data){
    console.log(data);

    if(-1 != data.indexOf('Input')){
        var Captcha = data.split(' ')[2];
        var len = Captcha.length;
        var CaptchaProStr = '';

        for(var i = 5;i <= 10;i++){
            CaptchaProStr += Captcha[i];
        }
        console.log("get the Captcha " + CaptchaProStr);

        cpCmd.stdin.write(CaptchaProStr, 'utf-8', function(){
            console.log("try write the Captcha ", CaptchaProStr);
        });
        cpCmd.stdin.end();
    }
});
cpCmd.stderr.on('data', function(data){
});
