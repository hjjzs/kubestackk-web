<template>
  <div class="console" id="terminal">
  </div>
</template>


<script setup lang="ts">
import { Terminal } from "xterm"
import { FitAddon } from 'xterm-addon-fit'
// import { AttachAddon } from 'xterm-addon-attach'
import "xterm/css/xterm.css";
import {onMounted} from 'vue'
import useStore from '../stores'
import {useRoute} from 'vue-router'
  
const {user} = useStore()
const route = useRoute()

function connect_ws(){
  const ws_proxy_host = "127.0.0.1"
  const ws_proxy_port = ":9696"
  var term = new Terminal({
    // rendererType: "canvas",
    // cols: 400,
    lineHeight: 1,
    convertEol: true, //启用时，光标将设置为下一行的开头
    scrollback: 1000, //终端中的回滚量
    disableStdin: false, //是否应禁用输入。
    cursorStyle: "block", //光标样式
    cursorBlink: true, //光标闪烁
    theme: {
      foreground: "#7e9192", //字体
      background: "#002833", //背景色
      cursor: "help", //设置光标
    }
  })

  var htmlel = document.getElementById('terminal')
  const fitAddon = new FitAddon();
  term.loadAddon(fitAddon);
  // fitAddon.activate(term)
  term.open(htmlel as HTMLElement);
  
  setTimeout(()=>{
    fitAddon.fit()
    console.log('fit')
  }, 60)

  window.addEventListener("resize", function () {
    fitAddon.fit();
    // 把web终端的尺寸term.rows和term.cols发给服务端, 通知sshd调整输出宽度
    // var msg =  '{type: "resize", rows: '+ term.rows+ ', cols: '+ term.cols + '}'
    // console.log(term.cols, term.rows)
    // var b = new Blob([msg])
    // ws.send(b)
  })


  term.onData( data => {
    var blob2 = new Blob([data]);
    // console.log("i", blob2)
    ws.send(blob2)
  })
  const url = 'ws://' + ws_proxy_host + ws_proxy_port +'/apis/subresources.kubevirt.io/v1/namespaces/' + route.query.namespace + '/virtualmachineinstances/' + route.query.name + '/console?token=' + user.token
  
  var ws = new WebSocket(url);
  
  ws.onopen=function(){
    //  oUl.innerHTML+="<li>客户端已连接</li>";
    console.log("conneting")
  }
  ws.onmessage=function(evt){
    // console.log("evtData",evt.data)
    
    var blob = evt.data;
    // console.log(blob)
    //通过FileReader读取数据
    var reader = new FileReader();

    //以下这两种方式我都可以解析出来，因为Blob对象的数据可以按文本或二进制的格式进行读取
    reader.readAsBinaryString(blob);
    // reader.readAsText(blob, 'utf8');

    reader.onload = function(){
      var receive_data = this.result;//这个就是解析出来的数据
      // console.log('o', receive_data)
      term.write(receive_data as string)
    }

  }
  ws.onclose=function(evt){
    console.log(evt)
    // oUl.innerHTML+="<li>客户端已断开连接</li>";
  };
  ws.onerror=function(evt){
      // oUl.innerHTML+="<li>"+evt.data+"</li>";
      console.log(evt)

  };
};

onMounted(()=>{
   
    connect_ws()

})

</script>


<style lang="scss">
.console{
  height: 100%;
}
        
</style>
