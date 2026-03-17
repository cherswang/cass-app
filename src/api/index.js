/**
 * @description 静态导入所有 api 模块
 */

import office from './model/office.js';
import system from './model/system.js';
import bpm from './model/bpm.js';

const modules = {
  office,
  system,
  bpm
};

export default modules