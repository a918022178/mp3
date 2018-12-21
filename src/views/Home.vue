<template>
  <div class="home">
    <audio-recorder
        upload-url="https://1-1256914858.cos.ap-chengdu.myqcloud.com"
        :attempts="3"
        :time="2"
        :before-recording="callback"
        :after-recording="callback"
        :before-upload="a"
        :successful-upload="a"
        @aa="a"
        :failed-upload="a"/>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  data () {
    return {}
  },
  components: {
    // HelloWorld
  },
  methods: {
    callback (e) {
      console.log(e);
    },
    a () {}
  },
}
</script>
