<template>

	<div class="containers">
		<div class="loading" v-if="loading">
			Loading...
		</div>
		<template v-else>
			<div class="canvas" ref="canvas"></div>
			<div id="js-properties-panel" class="panel"></div>
		</template>
		<ul class="buttons">
			<li>
				<a ref="saveDiagram" href="javascript:" title="保存为bpmn">保存为bpmn</a>
			</li>
			<li>
				<a ref="saveSvg" href="javascript:" title="保存为svg">保存为svg</a>
			</li>
		</ul>

	</div>
</template>

<script>
  import axios from 'axios'
  import BpmnModeler from 'bpmn-js/lib/Modeler'
  import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
  import {bpmnXml} from "@/mock/bpmnXml";

  export default {
    name: "save",
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
        this.addBpmnListener()
        // this.addBpmnListener2();
      },
      addBpmnListener() {
        const that = this;
        // 获取a标签dom节点
        const downloadLink = this.$refs.saveDiagram;
        const downloadSvgLink = this.$refs.saveSvg;
        this.bpmnModeler.on('commandStack.changed', function () {
          that.saveSVG(function(err, svg) {
            that.setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg)
          });
          that.saveDiagram(function(err, xml) {
            that.setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml)
          });
        })
			},
      // 下载为SVG格式,done是个函数，调用的时候传入的
      saveSVG(done) {
        // 把传入的done再传给bpmn原型的saveSVG函数调用
        this.bpmnModeler.saveSVG(done)
      },
      // 下载为bpmn格式,done是个函数，调用的时候传入的
      saveDiagram(done) {
        // 把传入的done再传给bpmn原型的saveXML函数调用
        this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
          done(err, xml)
        })
      },
      // 当图发生改变的时候会调用这个函数，这个data就是图的xml
      setEncoded(link, name, data) {
        // 把xml转换为URI，下载要用到的
        const encodedData = encodeURIComponent(data);
        // 下载图的具体操作,改变a的属性，className令a标签可点击，href令能下载，download是下载的文件的名字
        console.log(link, name, data);
        let xmlFile = new File([data], 'test.bpmn');
        console.log(xmlFile);
        if (data) {
          link.className = 'active';
          link.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData;
          link.download = name;
        }
      },


      addBpmnListener2() {
        const that = this;
        // 给图绑定事件，当图有发生改变就会触发这个事件
        this.bpmnModeler.on('commandStack.changed', function () {
          that.saveDiagram2(function(err, xml) {
            console.log('这里获取到的就是最新的xml信息',xml)
          })
        })
      },
      saveDiagram2(done) {
        // 把传入的done再传给bpmn原型的saveXML函数调用
        this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
          done(err, xml)
        })
      }

    }
    ,
  }
</script>

<style scoped>
	.loading {
		font-size: 26px;
	}
	.containers{
		background-color: #ffffff;
		width: 100%;
		height: calc(100vh - 52px);
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
	.buttons {
		position: absolute;
		left: 20px;
		bottom: 20px;
	}
	.buttons li {
		display: inline-block;
		margin: 5px;
	}
	.buttons li a {
		color: #999;
		background: #eee;
		cursor: not-allowed;
		padding: 8px;
		border: 1px solid #ccc;
		text-decoration: none;
	}
	.buttons li a.active {
		color: #333;
		background: #fff;
		cursor: pointer;
	}
</style>
