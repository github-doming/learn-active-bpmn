<template>
	<div class="containers">
		<div class="canvas" ref="canvas"></div>
	</div>

</template>

<script>
  import BpmnModeler  from 'bpmn-js/lib/Modeler';
  import {bpmnXml} from '../mock/bpmnXml'

  export default {
    name: "basic",
    data() {
      return {
        // bpmn建模器
        bpmnModeler: null,
        container: null,
        canvas: null,
      }
    },
    mounted() {
      this.init();
    },

    methods: {
      init() {
        // 获取到属性ref为“canvas”的dom节点
        const canvas = this.$refs.canvas;
        // 建模
        this.bpmnModeler = new BpmnModeler({container: canvas});
        this.createNewDiagram();
      },
      createNewDiagram() {
        // 将字符串转换成图显示出来
        this.bpmnModeler.importXML(bpmnXml, err => {
          if (err) {
            console.log(err);
          } else {
            // 这里是成功之后的回调, 可以在这里做一系列事情
            this.success();
          }
        })
      },
			success(){
        console.log("创建成功");
			}
    }
  }
</script>

<style scoped>
	.containers{
		position: absolute;
		background-color: #ffffff;
		width: 100%;
		height: 100%;
	}
	.canvas{
		width: 100%;
		height: 100%;
	}
	.panel{
		position: absolute;
		right: 0;
		top: 0;
		width: 300px;
	}
</style>
