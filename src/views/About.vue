<template>
  <div class="home">
      <audio v-for="(v, i) in arr" :key="i" :src="v" controls="controls">
        Your browser does not support the audio element.
      </audio>
      <button @click="record">{{txt}}</button>
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
      arr: [],
      txt: '录制',
      recorder: '',
      buffers: '',
      ws: ''
    }
  },
  mounted () {
    let that = this
    this.ws = new WebSocket('wss://zhengpeng.xyz:8888')
    // this.ws.onopen = () => {
    //   this.ws.send('clear')
    // }
    this.ws.addEventListener('open', function () {
      console.log('23423423423423')
    });
    this.ws.onmessage = (msg) => {
      that.arr.push(msg.data)
    }
    var promise = navigator.mediaDevices.getUserMedia({audio:true,vedio:true});
    console.log('promise',promise)
    promise.then(function(stream){
        // that.recorder=new MediaRecorder(stream);//new MediaStreamRecorder(stream);
        // that.recorder.mimeType = 'audio/ogg'; // audio/webm or audio/ogg or audio/wav
        that.recorder=new MediaRecorder(stream);
        console.log('stream',stream)
        console.log('that.recorder',that.recorder)
    that.recorder.ondataavailable=function(e){
            console.log('e',e)
            that.buffers=e.data;
        }
    that.recorder.onstop=function(){
            // var url=URL.createObjectURL(that.buffers);
            console.log(that.buffers);
            // downloadButton.click();
              let a = new FileReader();
              a.onload = function (e) {
                let name = Math.floor(Math.random(0,1)*100000)
                that.dataURLtoFile(e.target.result, name,that)
              }
              a.readAsDataURL(that.buffers);
            that.buffers=null;
        };
    }).catch(function(error){
        console.log('error',error);
     });
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
    record () {
      if (this.txt === '录制') {
        this.txt = '发送'
        console.log(this.txt)
        console.log('this.recorder',this.recorder)
        this.recorder.start()
      } else {
        this.txt = '录制'
        this.recorder.stop()
      }
    }
  },
}
</script>
<style lang="less" scoped>
</style>
