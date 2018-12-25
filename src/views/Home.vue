<template>
  <div class="home">
    <audio-recorder
        :attempts="300"
        :time="2"
        :before-recording="a"
        :after-recording="callback"
        :before-upload="a"
        :successful-upload="a"
        :failed-upload="a"/>
      <!-- <audio controls>
      <source v-for="(v, i) in arr" :key="i" :src="v">
      您的浏览器不支持 audio 元素。
      </audio> -->
      <audio v-for="(v, i) in arr" :key="i" :src="v" controls="controls">
        Your browser does not support the audio element.
      </audio>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import COS from 'cos-js-sdk-v5'
  var Bucket ='1-1256914858';
  var Region = 'ap-chengdu';
  var cos = new COS({
    getAuthorization: function (options,callback) { 
        var authorization = COS.getAuthorization({
            SecretId: 'AKIDnOlsjKaohKkwta6JK7ew1sTpysWuGvZw', //这是密钥ID
            SecretKey: 'IMAi0iDTVIvJSMzNWP2QYQ2OV7XjiT1K',
            Method: options.Method,
            Key: options.Key,
            Query: options.Query,
            Headers: options.Headers,
            Expires: 60,
            })
        callback(authorization);
      }
  });
export default {
  name: 'home',
  data () {
    return {
      arr: []
    }
  },
  mounted () {
    let that = this
    // console.log(WebSocket)
    this.ws = new WebSocket('wss://zhengpeng.xyz:8888')
    // console.log(this.ws)
    // this.ws.onopen = () => {
    //   this.ws.send('clear')
    // }
    this.ws.addEventListener('open', function () {
      console.log('23423423423423')
      // console.log(that.a)
      // that.ws.send(that.a)
    });
    this.ws.onmessage = (msg) => {
      // console.log(msg)
      that.arr.push(msg.data)
    }
  },
  components: {
    // HelloWorld
  },
  methods: {
    callback (e) {
      let that = this
      // console.log(e);
      let a = new FileReader();
      a.onload = function (e) {
        let name = Math.floor(Math.random(0,1)*100000)
        that.dataURLtoFile(e.target.result, name,that)
      }
      a.readAsDataURL(e.blob);
    },
    dataURLtoFile(dataurl, filename, that) {//将base64转换为文件
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        // return new File([u8arr], filename, {type:mime});
        // console.log(new File([u8arr], filename, {type:mime}))
        let file = new File([u8arr], filename, {type:mime})
        cos.putObject({
          Bucket: Bucket,
          Region: Region,
          Key: 'mp3/'+file.name,
          Body: file,
          onProgress: function (progressData,callback) {
            console.log(progressData);
            callback()
          },
        }, function(err, data) {
          console.log(err,data);
          that.ws.send('https://'+data.Location)
          // that.arr.push(data.Location)
        });
    },
    a (e) {
      console.log('aaaaaa',e);
    }
  },
}
</script>
<style lang="less" scoped>
.home{
  /deep/ .ar-records{
    display: none;
  }
  /deep/ .ar-player{
    display: none;
  }
}
</style>
