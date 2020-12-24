// 引入默认的renderer
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {customElements,customConfig} from "../util/util";
import {
  append as svgAppend,
  create as svgCreate,
} from 'tiny-svg'
// 最高优先级
const HIGH_PRIORITY = 1500;

export default class CustomRenderer extends BaseRenderer{
  constructor(eventBus,bpmnRenderer) {
    super(eventBus,HIGH_PRIORITY);
    this.bpmnRenderer = bpmnRenderer;
  }
  canRender(element){
    return !element.labelTarget;
  }
  drawShape(parentNode,element){
    // 核心函数就是绘制shape
    const type = element.type;
    console.log(type);
    if (customElements.includes(type)){
      const {url,attr} = customConfig[type];
      // 在这里创建了一个image
      const customIcon = svgCreate('image',{
        ...attr,
        href:url
      });
      element['width'] = attr.width;
      element['height'] = attr.height;
      svgAppend(parentNode,customIcon);
      return  customIcon;
    }

    return this.bpmnRenderer.drawShape(parentNode,element);
  }
  getShapePath(shape){
    return this.bpmnRenderer.getShapePath(shape);
  }

}
CustomRenderer.$inject = ['eventBus', 'bpmnRenderer'];

