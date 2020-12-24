<template>
	<div class="containers">
		<div class="canvas" ref="canvas"></div>
		<div id="js-properties-panel" class="panel"></div>
	</div>
</template>

<script>
  // 引入相关的依赖
  import BpmnModeler from 'bpmn-js/lib/Modeler';
  import {bpmnXml} from '../mock/bpmnXml'
  import customModule from './custom'
  import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'

  export default {
    name: "custom-renderer",
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
        this.bpmnModeler = new BpmnModeler({
          container: canvas,
          //添加控制板
          propertiesPanel: {
            parent: '#js-properties-panel'
          },
          additionalModules: [
            // 左边工具栏以及节点
            propertiesProviderModule,
            // 自定义的节点
            customModule
          ],
        });
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
      success() {
        console.log("custom-renderer 创建成功");
      }
    }
  }
</script>

<style scoped>
	.containers {
		position: absolute;
		background-color: #ffffff;
		width: 100%;
		height: 100%;
	}

	.canvas {
		width: 100%;
		height: 100%;
	}

	.panel {
		position: absolute;
		right: 0;
		top: 0;
		width: 300px;
	}
</style>
