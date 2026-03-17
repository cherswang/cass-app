/**
 * @description 静态导入所有 api 模块
 */

import office from './model/office.js';
import system from './model/system.js';
import bpmModule from './model/bpm.js';

const modules = {
  office,
  system,
  ...bpmModule
};

export default modules