<template>
	<div class="containers">
		<div class="canvas" ref="canvas"></div>
	</div>

</template>

<script>
  import BpmnModeler from 'bpmn-js/lib/Modeler';
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
        this.bpmnModeler.importXML(bpmnXml, (err) => {
          if (err) {
            console.log(err);
          } else {
            // 这里是成功之后的回调, 可以在这里做一系列事情
            this.success();
          }
        })
      },
      success() {
        console.log("创建成功");
        // this.addModelerListener();
        // this.addModelerListener2();
        this.addModelerListener3();
        this.addEventBusListener3();
      },
      addModelerListener3() {
        // 监听 modeler
        const bpmnJs = this.bpmnModeler;
        const that = this;
        const events = ['shape.added', 'shape.move.end', 'shape.removed']
        events.forEach(function (event) {
          that.bpmnModeler.on(event, e => {
            let elementRegistry = bpmnJs.get('elementRegistry');
            let shape = e.element ? elementRegistry.get(e.element.id) : e.shape;
            console.log(shape);
            if (event === 'shape.added') {
              console.log('新增了shape')
            } else if (event === 'shape.move.end') {
              console.log('移动了shape')
            } else if (event === 'shape.removed') {
              console.log('删除了shape')
            }
          })
        })
      },
      addEventBusListener3() {
        // 监听 element
        let that = this;
        const eventBus = this.bpmnModeler.get('eventBus');
        const eventTypes = ['element.click', 'element.changed'];
        eventTypes.forEach(function (eventType) {
          eventBus.on(eventType, function (e) {
            console.log(eventType);
            if (!e || e.element.type === 'bpmn:Process') {
              console.log("ROOT");
              return;
            }
            if (eventType === 'element.changed') {
              that.elementChanged(eventType, e)
            } else if (eventType === 'element.click') {
              console.log('点击了element')
            }
          })
        })
      },
      elementChanged(eventType, e) {
        let shape = this.getShape(e.element.id);
        if (!shape) {
          // 若是shape为null则表示删除, 无论是shape还是connect删除都调用此处
          console.log('无效的shape')
          // 由于上面已经用 shape.removed 检测了shape的删除, 因此这里只判断是否是线
          if (this.isSequenceFlow(shape.type)) {
            console.log('删除了线')
          }
        }
        if (!this.isInvalid(shape.type)) {
          if (this.isSequenceFlow(shape.type)) {
            console.log('改变了线')
          }
        }
      },
      getShape(id) {
        let elementRegistry = this.bpmnModeler.get('elementRegistry');
        return elementRegistry.get(id);
      },
      isInvalid(param) {
        // 判断是否是无效的值
        return param === null || param === undefined || param === '';
      },
      isSequenceFlow(type) {
        // 判断是否是线
        return type === 'bpmn:SequenceFlow'
      },


      addModelerListener2() {
        // 需要使用eventBus
        const eventBus = this.bpmnModeler.get('eventBus');
        // 需要监听的事件集合
        const eventTypes = ['element.click', 'element.changed'];
        eventTypes.forEach(eventType => eventBus.on(eventType, e => {
          if (!e || e.element.type === 'bpmn:Process') {
            console.log("ROOT");
            return;
          }
          let elementRegistry = this.bpmnModeler.get('elementRegistry');
          let shape = elementRegistry.get(e.element.id);
          console.log(shape);
          console.log(e.element.id);
          console.log(JSON.stringify(shape) === JSON.stringify(e.element))


        }))
      },


      addModelerListener() {
        const bpmnJs = this.bpmnModeler;
        const that = this;
        // 这里我是用了一个forEach给modeler上添加要绑定的事件
        const events = ['shape.added', 'shape.move.end', 'shape.removed', 'connect.end', 'connect.move'];
        events.forEach(function (event) {
          that.bpmnModeler.on(event, e => {
            console.log(event, e);
            let elementRegistry = bpmnJs.get('elementRegistry');
            let shape = e.element ? elementRegistry.get(e.element.id) : e.shape;
            console.log(shape)
          })
        })
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
