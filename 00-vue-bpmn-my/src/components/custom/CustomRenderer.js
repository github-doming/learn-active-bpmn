// 引入默认的renderer
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

// 最高优先级
const HIGH_PRIORITY = 1500;
export default class CustomRenderer extends BaseRenderer {
  constructor(eventBus, bpmnRenderer) {
    super(eventBus, HIGH_PRIORITY);
    this.bpmnRenderer = bpmnRenderer;
  }

  canRender(element) {
    console.log(element);
    return !element.labelTarget;
  }

  drawShape(parentNode, element) {
    if ('bpmn:Task' === element.type) {
      element.width = 60;
      element.height = 48;
      return this.bpmnRenderer.drawShape(parentNode, element);
    }
    return this.bpmnRenderer.drawShape(parentNode, element);
  }

  getShapePath(shape) {
    return this.bpmnRenderer.getShapePath(shape);
  }

}
CustomRenderer.$inject = ['eventBus', 'bpmnRenderer'];
