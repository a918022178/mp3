const tencentcloud = require("tencentcloud-sdk-nodejs");
// 导入对应产品模块的client models。
const AaiClient = tencentcloud.aai.v20180522.Client;
const models = tencentcloud.aai.v20180522.Models;
const Credential = tencentcloud.common.Credential;
const ClientProfile = tencentcloud.common.ClientProfile;
const HttpProfile = tencentcloud.common.HttpProfile;
let cred = new Credential('AKIDnOlsjKaohKkwta6JK7ew1sTpysWuGvZw', 'IMAi0iDTVIvJSMzNWP2QYQ2OV7XjiT1K');
// 实例化一个http选项，可选的，没有特殊需求可以跳过。
let httpProfile = new HttpProfile();
httpProfile.reqMethod = "POST";
httpProfile.reqTimeout = 30;
httpProfile.endpoint = "aai.tencentcloudapi.com";
// 实例化一个client选项，可选的，没有特殊需求可以跳过。
let clientProfile = new ClientProfile();
clientProfile.signMethod = "HmacSHA256";
clientProfile.httpProfile = httpProfile;
// 实例化要请求产品(以cvm为例)的client对象。clientProfile可选。
let client = new AaiClient(cred, "ap-chengdu", clientProfile);
// 实例化一个请求对象,并填充参数
let req = new models.SentenceRecognitionRequest();
function a (url,wss) {
    console.log('url',url)
    let params = {"ProjectId":"0","SubServiceType":"2","EngSerViceType":"8k","SourceType":"0","VoiceFormat":"mp3","UsrAudioKey":"123123"}
    params.Url = url 
    params = JSON.stringify(params)
    req.from_json_string(params);
    client.SentenceRecognition(req, function(errMsg, res) {
        if (errMsg) {
            console.log(errMsg);
            return;
        }
        // let res = JSON.parse(res.to_json_string())
        console.log('txt',res.Result);
        wss.clients.forEach(function each(client) {
            client.send(res.Result);
        });
    })
}
module.exports.a = a
