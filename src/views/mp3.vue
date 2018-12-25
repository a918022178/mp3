<template>
  <div class="home">
      <div v-for="(v, i) in arr" :key="i">
          <audio :src="v" controls="controls">
            Your browser does not support the audio element.
        </audio>
        <span v-if="showArr[i]">{{TxtArr[i]}}</span>
        <button v-else @click="show(i)">转文字</button>
      </div>
      <button @click="record">{{txt}}</button>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import COS from 'cos-js-sdk-v5'
import Recorder from 'recorder-js'
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
// import mixins from './abc'
export default {
  name: 'home',
  data () {
    return {
      TxtArr:[],
      showArr:[],
      arr: [],
      txt: '录制',
      recorder: '',
      ws: '',
      type: 'url'
    }
  },
//   mixins: [mixins],
  mounted () {
    let that = this
    this.ws = new WebSocket('wss://zhengpeng.xyz:8888')
    this.ws.addEventListener('open', function () {
    //   that.ws.send(that.a)
    });
    this.ws.onmessage = (msg) => {
        console.log('msg',msg)
        console.log('type',this.type)
        let res = msg.data
        if (this.type === 'url') {
            that.arr.push(res)
        }else{
            that.TxtArr.push(res)
        }
    }
    //
    const audioContext =  new (window.AudioContext || window.webkitAudioContext)();
 
    that.recorder = new Recorder(audioContext, {
        // An array of 255 Numbers
        // You can use this to visualize the audio stream
        // If you use react, check out react-wave-stream
        onAnalysed: data => {
            // console.log(data)
        },
    });
    navigator.mediaDevices.getUserMedia({audio: true})
    .then(stream => {
        console.log(stream)
        that.recorder.init(stream)
    })
    .catch(err => console.log('Uh oh... unable to get stream...', err));
    },
  components: {
    // HelloWorld
  },
  methods: {
    show (i) {
        this.type = 'txt'
        this.$set(this.showArr, i, true)
        this.ws.send(JSON.stringify({type: 1,url:this.arr[i]}))
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
            // console.log(progressData);
            callback()
          },
        }, function(err, data) {
          console.log(err,data);
        //   that.ws.send('https://'+data.Location)
          that.ws.send(JSON.stringify({"url":'https://'+data.Location}))
        });
    },
    record () {
        this.type = 'url'
        let that = this
      if (this.txt === '录制') {
        this.txt = '发送'
        this.recorder.start()
      } else {
        this.txt = '录制'
        that.recorder.stop()
            .then(({blob, buffer}) => {
                console.log(blob, buffer)
                let a = new FileReader();
                a.onload = function (e) {
                    // console.log(e)
                    let name = Math.floor(Math.random(0,1)*100000)+'.wav'
                    that.dataURLtoFile(e.target.result, name,that)
                }
                a.readAsDataURL(blob);
                // buffer is an AudioBuffer
            })
      }
    }
  },
}
</script>
<style lang="less" scoped>
</style>
