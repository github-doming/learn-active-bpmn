<template>

	<div class="containers">
		<div class="loading" v-if="loading">
			Loading...
		</div>
		<template v-else>
			<div class="canvas" ref="canvas"></div>
			<div id="js-properties-panel" class="panel"></div>
		</template>

	</div>
</template>

<script>
  import axios from 'axios'
  import BpmnModeler from 'bpmn-js/lib/Modeler'
  import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
  import {bpmnXml} from "@/mock/bpmnXml";

  export default {
    name: "axios",
    data() {
      return {
        // bpmn建模器
        bpmnModeler: null,
        container: null,
        canvas: null,
        loading: true,
        xmlUrl: '',
        defaultBpmnXml: bpmnXml
      }
    },
    mounted() {
      this.init();
    },
    methods: {
      async init() {
        this.loading = true;
        this.xmlUrl = await this.getBpmnUrl();
        console.log(this.xmlUrl);
        this.loading = false;
        this.$nextTick(() => this.initBpmn());
      },
      getBpmnUrl() {
        return new Promise(resolve => {
          setTimeout(() => {
            const url = '模拟网络请求的一个地址';
            resolve(url);
          }, 1000)
        });
      },
      initBpmn() { // 获取到属性ref为“canvas”的dom节点
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
            propertiesProviderModule
          ]
        });

        this.createNewDiagram()
      },
      async createNewDiagram() {
        let bpmnXml = '';
        if (this.xmlUrl === '') { // 若是后台没有数据则使用默认的一个xml
          bpmnXml = this.defaultBpmnXml;
          this.transformCanvas(bpmnXml)
        } else {
          axios({
            method: 'get',
            timeout: 2000,
            url: this.xmlUrl,
            headers: {'Content-Type': 'multipart/form-data'}
          }).then(res => {
            console.log(res);
            bpmnXml = res['data'];
            this.transformCanvas(bpmnXml);
          }, err => {
            console.log(err);
            bpmnXml = this.defaultBpmnXml;
            this.transformCanvas(bpmnXml)
          });

        }
      },

      transformCanvas(bpmnXml) {
        this.bpmnModeler.importXML(bpmnXml, err => {
          if (err) {
            console.err(err);
          } else {
            this.success();
          }
        });
        // 让图能自适应屏幕
        this.bpmnModeler.get('canvas').zoom('fit-viewport');
      },
      success() {
        console.log("创建成功");
      },
    }
    ,
  }
</script>

<style scoped>
	.loading {
		font-size: 26px;
	}
	.containers {
		background-color: #ffffff;
		width: 100%;
		height: calc(100vh - 52px);
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
