<template>
    <iframe height="100%" width="100%" :src="src" id="myFrame" name="targetframe" allowTransparency="true" scrolling="yes" frameborder="0">
    </iframe>
</template>

<script>

var url = require("../../../../lib/url")

export default {

  data: () => ({
    src: url.url + "/swagger-ui.html"
  }),

  methods: {
    // a computed getter
    getHeight: function(){
      var iframe = document.getElementById("myFrame");

      var height;

      try {
        height = iframe.contentWindow.document.body.scrollHeight;
      } catch (error) {
        height = 4000;
      }

      console.log(height)

      // `this` points to the vm instance
      return height + 'px';
    }
  }

};

</script>
