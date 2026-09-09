const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'source-repo', 'packages', 'shared', 'src');
const dstDir = path.join(__dirname, '..', 'packages', 'shared', 'src');

// 1. Direct copy files
const directFiles = [
  'agent-types.ts',
  'labels.ts',
  'node-spec-registry.ts',
  'node-spec.ts',
  'rr-graph.ts',
  'step-types.ts',
  'tools.ts',
  'types.ts',
];

for (const file of directFiles) {
  const src = path.join(srcDir, file);
  const dst = path.join(dstDir, file);
  fs.copyFileSync(src, dst);
  console.log(`Copied ${file}`);
}

// 2. Constants
const constantsContent = `export const DEFAULT_SERVER_PORT = 12307;
export const HOST_NAME = 'com.nexusai.browserhost';
`;
fs.writeFileSync(path.join(dstDir, 'constants.ts'), constantsContent, 'utf8');
console.log('Created constants.ts');

// 3. node-specs-builtin.ts with English labels
let nodeSpecs = fs.readFileSync(path.join(srcDir, 'node-specs-builtin.ts'), 'utf8');

const translations = [
  ["label: '导航'", "label: 'Navigate'"],
  ["help: '目标地址，支持变量模板 {var}'", "help: 'Target URL with template variable support {var}'"],
  ["errs.push('URL 必填')", "errs.push('URL is required')"],
  ["label: '点击'", "label: 'Click'"],
  ["label: '目标'", "label: 'Target'"],
  ["help: '选择或输入元素选择器'", "help: 'Element selector or target locator'"],
  ["label: '执行前'", "label: 'Pre-execution'"],
  ["label: '滚动到可见'", "label: 'Scroll Into View'"],
  ["label: '等待选择器'", "label: 'Wait For Selector'"],
  ["label: '执行后'", "label: 'Post-execution'"],
  ["label: '等待导航完成'", "label: 'Wait For Navigation'"],
  ["label: '等待网络空闲'", "label: 'Wait For Network Idle'"],
  ["label: '双击'", "label: 'Double Click'"],
  ["label: '填充'", "label: 'Fill Input'"],
  ["label: '值'", "label: 'Value'"],
  ["label: '按键'", "label: 'Key Press'"],
  ["label: '按键值'", "label: 'Key'"],
  ["label: '滚动'", "label: 'Scroll'"],
  ["label: '水平滚动量'", "label: 'Delta X'"],
  ["label: '垂直滚动量'", "label: 'Delta Y'"],
  ["label: '悬停'", "label: 'Hover'"],
  ["label: '偏移'", "label: 'Offset'"],
  ["label: '拖拽'", "label: 'Drag & Drop'"],
  ["label: '起点'", "label: 'Start'"],
  ["label: '终点'", "label: 'End'"],
  ["label: '路径坐标'", "label: 'Path Coordinates'"],
  ["label: '点'", "label: 'Point'"],
  ["label: '等待'", "label: 'Wait'"],
  ["label: '条件(JSON)'", "label: 'Condition (JSON)'"],
  ["help: '如 {\"sleep\":1000} 或 {\"text\":\"Hello\",\"appear\":true}'", "help: 'e.g. {\"sleep\":1000} or {\"text\":\"Hello\",\"appear\":true}'"],
  ["label: '断言'", "label: 'Assert'"],
  ["label: '断言(JSON)'", "label: 'Assertion (JSON)'"],
  ["help: '如 {\"exists\":\"#id\"} / {\"visible\":\".btn\"}'", "help: 'e.g. {\"exists\":\"#id\"} or {\"visible\":\".btn\"}'"],
  ["label: '失败策略'", "label: 'Failure Strategy'"],
  ["{ label: '停止', value: 'stop' }", "{ label: 'Stop', value: 'stop' }"],
  ["{ label: '警告', value: 'warn' }", "{ label: 'Warn', value: 'warn' }"],
  ["{ label: '重试', value: 'retry' }", "{ label: 'Retry', value: 'retry' }"],
  ["label: '方法'", "label: 'Method'"],
  ["{ key: 'headers', label: '请求头(JSON)', type: 'json' }", "{ key: 'headers', label: 'Headers (JSON)', type: 'json' }"],
  ["{ key: 'body', label: '请求体(JSON)', type: 'json' }", "{ key: 'body', label: 'Body (JSON)', type: 'json' }"],
  ["{ key: 'formData', label: '表单(JSON)', type: 'json' }", "{ key: 'formData', label: 'FormData (JSON)', type: 'json' }"],
  ["{ key: 'saveAs', label: '保存为变量', type: 'string' }", "{ key: 'saveAs', label: 'Save As Variable', type: 'string' }"],
  ["{ key: 'assign', label: '映射(JSON)', type: 'json' }", "{ key: 'assign', label: 'Assign (JSON)', type: 'json' }"],
  ["display: { label: '提取', iconClass: 'icon-extract', category: 'Tools' }", "display: { label: 'Extract', iconClass: 'icon-extract', category: 'Tools' }"],
  ["{ key: 'selector', label: '选择器', type: 'string', widget: 'selector' }", "{ key: 'selector', label: 'Selector', type: 'string', widget: 'selector' }"],
  ["label: '属性'", "label: 'Attribute'"],
  ["{ label: '文本(text)', value: 'text' }", "{ label: 'Text (text)', value: 'text' }"],
  ["{ label: '文本(textContent)', value: 'textContent' }", "{ label: 'Text (textContent)', value: 'textContent' }"],
  ["{ label: '自定义属性名', value: 'attr' }", "{ label: 'Custom Attribute Name', value: 'attr' }"],
  ["help: '在页面中执行并返回值'", "help: 'Execute in page context and return value'"],
  ["{ key: 'js', label: '自定义JS', type: 'string', help: '在页面中执行并返回值' }", "{ key: 'js', label: 'Custom JS', type: 'string', help: 'Execute in page context and return value' }"],
  ["{ key: 'saveAs', label: '保存变量', type: 'string', required: true }", "{ key: 'saveAs', label: 'Save Variable', type: 'string', required: true }"],
  ["display: { label: '截图', iconClass: 'icon-screenshot', category: 'Tools' }", "display: { label: 'Screenshot', iconClass: 'icon-screenshot', category: 'Tools' }"],
  ["{ key: 'selector', label: '目标选择器', type: 'string' }", "{ key: 'selector', label: 'Target Selector', type: 'string' }"],
  ["{ key: 'fullPage', label: '整页截图', type: 'boolean', default: false }", "{ key: 'fullPage', label: 'Full Page Screenshot', type: 'boolean', default: false }"],
  ["{ key: 'saveAs', label: '保存变量', type: 'string' }", "{ key: 'saveAs', label: 'Save Variable', type: 'string' }"],
  ["display: { label: '触发事件', iconClass: 'icon-trigger', category: 'Tools' }", "display: { label: 'Trigger Event', iconClass: 'icon-trigger', category: 'Tools' }"],
  ["{ key: 'event', label: '事件类型', type: 'string', required: true }", "{ key: 'event', label: 'Event Type', type: 'string', required: true }"],
  ["{ key: 'bubbles', label: '冒泡', type: 'boolean', default: true }", "{ key: 'bubbles', label: 'Bubbles', type: 'boolean', default: true }"],
  ["{ key: 'cancelable', label: '可取消', type: 'boolean', default: false }", "{ key: 'cancelable', label: 'Cancelable', type: 'boolean', default: false }"],
  ["display: { label: '设置属性', iconClass: 'icon-attr', category: 'Tools' }", "display: { label: 'Set Attribute', iconClass: 'icon-attr', category: 'Tools' }"],
  ["{ key: 'name', label: '属性名', type: 'string', required: true }", "{ key: 'name', label: 'Attribute Name', type: 'string', required: true }"],
  ["{ key: 'value', label: '属性值', type: 'string' }", "{ key: 'value', label: 'Attribute Value', type: 'string' }"],
  ["{ key: 'remove', label: '移除属性', type: 'boolean', default: false }", "{ key: 'remove', label: 'Remove Attribute', type: 'boolean', default: false }"],
  ["display: { label: '循环元素', iconClass: 'icon-loop', category: 'Tools' }", "display: { label: 'Loop Elements', iconClass: 'icon-loop', category: 'Tools' }"],
  ["{ key: 'selector', label: '选择器', type: 'string', required: true }", "{ key: 'selector', label: 'Selector', type: 'string', required: true }"],
  ["{ key: 'saveAs', label: '列表变量名', type: 'string', default: 'elements' }", "{ key: 'saveAs', label: 'List Variable Name', type: 'string', default: 'elements' }"],
  ["{ key: 'itemVar', label: '项变量名', type: 'string', default: 'item' }", "{ key: 'itemVar', label: 'Item Variable Name', type: 'string', default: 'item' }"],
  ["{ key: 'subflowId', label: '子流程ID', type: 'string', required: true }", "{ key: 'subflowId', label: 'Subflow ID', type: 'string', required: true }"],
  ["display: { label: '切换Frame', iconClass: 'icon-frame', category: 'Tools' }", "display: { label: 'Switch Frame', iconClass: 'icon-frame', category: 'Tools' }"],
  ["label: 'frame定位'", "label: 'Frame Locator'"],
  ["{ key: 'index', label: '索引', type: 'number' }", "{ key: 'index', label: 'Index', type: 'number' }"],
  ["{ key: 'urlContains', label: 'URL包含', type: 'string' }", "{ key: 'urlContains', label: 'URL Contains', type: 'string' }"],
  ["display: { label: '下载处理', iconClass: 'icon-download', category: 'Tools' }", "display: { label: 'Handle Download', iconClass: 'icon-download', category: 'Tools' }"],
  ["{ key: 'filenameContains', label: '文件名包含', type: 'string' }", "{ key: 'filenameContains', label: 'Filename Contains', type: 'string' }"],
  ["{ key: 'waitForComplete', label: '等待完成', type: 'boolean', default: true }", "{ key: 'waitForComplete', label: 'Wait For Complete', type: 'boolean', default: true }"],
  ["{ key: 'timeoutMs', label: '超时(ms)', type: 'number', default: 60000 }", "{ key: 'timeoutMs', label: 'Timeout (ms)', type: 'number', default: 60000 }"],
  ["display: { label: '脚本', iconClass: 'icon-script', category: 'Tools' }", "display: { label: 'Script', iconClass: 'icon-script', category: 'Tools' }"],
  ["label: '执行上下文'", "label: 'Execution Context'"],
  ["{ key: 'code', label: '脚本代码', type: 'string', widget: 'code', required: true }", "{ key: 'code', label: 'Script Code', type: 'string', widget: 'code', required: true }"],
  ["label: '执行时机'", "label: 'Execution Timing'"],
  ["display: { label: '打开标签', iconClass: 'icon-openTab', category: 'Tabs' }", "display: { label: 'Open Tab', iconClass: 'icon-openTab', category: 'Tabs' }"],
  ["{ key: 'newWindow', label: '新窗口', type: 'boolean', default: false }", "{ key: 'newWindow', label: 'New Window', type: 'boolean', default: false }"],
  ["display: { label: '执行子流程', iconClass: 'icon-exec', category: 'Flow' }", "display: { label: 'Execute Subflow', iconClass: 'icon-exec', category: 'Flow' }"],
  ["{ key: 'flowId', label: '流程ID', type: 'string', required: true }", "{ key: 'flowId', label: 'Flow ID', type: 'string', required: true }"],
  ["{ key: 'inline', label: '内联执行', type: 'boolean', default: false }", "{ key: 'inline', label: 'Inline Execution', type: 'boolean', default: false }"],
  ["{ key: 'args', label: '参数(JSON)', type: 'json' }", "{ key: 'args', label: 'Arguments (JSON)', type: 'json' }"],
  ["display: { label: '切换标签', iconClass: 'icon-switchTab', category: 'Tabs' }", "display: { label: 'Switch Tab', iconClass: 'icon-switchTab', category: 'Tabs' }"],
  ["{ key: 'titleContains', label: '标题包含', type: 'string' }", "{ key: 'titleContains', label: 'Title Contains', type: 'string' }"],
  ["display: { label: '关闭标签', iconClass: 'icon-closeTab', category: 'Tabs' }", "display: { label: 'Close Tab', iconClass: 'icon-closeTab', category: 'Tabs' }"],
  ["display: { label: '条件', iconClass: 'icon-if', category: 'Logic' }", "display: { label: 'Condition', iconClass: 'icon-if', category: 'Logic' }"],
  ["label: '条件表达式(JSON)'", "label: 'Condition Expression (JSON)'"],
  ["help: '如 {\"expression\":\"vars.a>0\"} 等'", "help: 'e.g. {\"expression\":\"vars.a>0\"}'"],
  ["label: '分支'", "label: 'Branches'"],
  ["{ key: 'name', label: '名称', type: 'string' }", "{ key: 'name', label: 'Name', type: 'string' }"],
  ["{ key: 'expr', label: '表达式', type: 'string' }", "{ key: 'expr', label: 'Expression', type: 'string' }"],
  ["{ key: 'else', label: '启用 else', type: 'boolean', default: true }", "{ key: 'else', label: 'Enable else', type: 'boolean', default: true }"],
  ["display: { label: '循环', iconClass: 'icon-foreach', category: 'Logic' }", "display: { label: 'Foreach Loop', iconClass: 'icon-foreach', category: 'Logic' }"],
  ["{ key: 'listVar', label: '列表变量', type: 'string', required: true }", "{ key: 'listVar', label: 'List Variable', type: 'string', required: true }"],
  ["{ key: 'itemVar', label: '项变量', type: 'string', default: 'item' }", "{ key: 'itemVar', label: 'Item Variable', type: 'string', default: 'item' }"],
  ["label: '并发数'", "label: 'Concurrency'"],
  ["help: '并发执行子流程（浅拷贝变量，不自动合并）'", "help: 'Concurrent subflow execution (shallow-copied variables)'"],
  ["display: { label: '循环', iconClass: 'icon-while', category: 'Logic' }", "display: { label: 'While Loop', iconClass: 'icon-while', category: 'Logic' }"],
  ["{ key: 'condition', label: '条件(JSON)', type: 'json' }", "{ key: 'condition', label: 'Condition (JSON)', type: 'json' }"],
  ["{ key: 'maxIterations', label: '最大次数', type: 'number', default: 100 }", "{ key: 'maxIterations', label: 'Max Iterations', type: 'number', default: 100 }"],
  ["display: { label: '延迟', iconClass: 'icon-delay', category: 'Actions' }", "display: { label: 'Delay', iconClass: 'icon-delay', category: 'Actions' }"],
  ["display: { label: '触发器', iconClass: 'icon-trigger', category: 'Flow' }", "display: { label: 'Trigger', iconClass: 'icon-trigger', category: 'Flow' }"],
  ["{ key: 'enabled', label: '启用', type: 'boolean', default: true }", "{ key: 'enabled', label: 'Enabled', type: 'boolean', default: true }"],
  ["{ key: 'description', label: '描述', type: 'string' }", "{ key: 'description', label: 'Description', type: 'string' }"],
  ["label: '模式'", "label: 'Modes'"],
  ["{ key: 'manual', label: '手动', type: 'boolean', default: true }", "{ key: 'manual', label: 'Manual Trigger', type: 'boolean', default: true }"],
  ["{ key: 'url', label: 'URL 触发', type: 'boolean', default: false }", "{ key: 'url', label: 'URL Trigger', type: 'boolean', default: false }"],
  ["{ key: 'contextMenu', label: '右键菜单', type: 'boolean', default: false }", "{ key: 'contextMenu', label: 'Context Menu', type: 'boolean', default: false }"],
  ["{ key: 'command', label: '快捷键', type: 'boolean', default: false }", "{ key: 'command', label: 'Shortcut Key', type: 'boolean', default: false }"],
  ["{ key: 'dom', label: 'DOM 事件', type: 'boolean', default: false }", "{ key: 'dom', label: 'DOM Event', type: 'boolean', default: false }"],
  ["{ key: 'schedule', label: '定时', type: 'boolean', default: false }", "{ key: 'schedule', label: 'Schedule', type: 'boolean', default: false }"],
  ["label: 'URL 规则'", "label: 'URL Rules'"],
  ["label: '规则列表'", "label: 'Rule List'"],
  ["label: '规则'", "label: 'Rule'"],
  ["label: '类型'", "label: 'Type'"],
  ["{ label: '域名', value: 'domain' }", "{ label: 'Domain', value: 'domain' }"],
  ["{ label: '路径', value: 'path' }", "{ label: 'Path', value: 'path' }"],
  ["label: '右键菜单'", "label: 'Context Menu'"],
  ["{ key: 'title', label: '标题', type: 'string', default: '运行工作流' }", "{ key: 'title', label: 'Title', type: 'string', default: 'Run Workflow' }"],
  ["{ key: 'enabled', label: '启用', type: 'boolean', default: false }", "{ key: 'enabled', label: 'Enabled', type: 'boolean', default: false }"],
  ["label: '快捷键'", "label: 'Shortcut'"],
  ["{ key: 'commandKey', label: '快捷键', type: 'string' }", "{ key: 'commandKey', label: 'Shortcut Key', type: 'string' }"],
  ["label: 'DOM 事件'", "label: 'DOM Event'"],
  ["{ key: 'selector', label: '选择器', type: 'string' }", "{ key: 'selector', label: 'Selector', type: 'string' }"],
  ["{ key: 'appear', label: '出现', type: 'boolean', default: true }", "{ key: 'appear', label: 'Appear', type: 'boolean', default: true }"],
  ["{ key: 'once', label: '一次', type: 'boolean', default: true }", "{ key: 'once', label: 'Once', type: 'boolean', default: true }"],
  ["{ key: 'debounceMs', label: '防抖(ms)', type: 'number', default: 800 }", "{ key: 'debounceMs', label: 'Debounce (ms)', type: 'number', default: 800 }"],
  ["label: '定时'", "label: 'Schedule'"],
  ["label: '计划'", "label: 'Plan'"],
  ["{ label: '一次', value: 'once' }", "{ label: 'Once', value: 'once' }"],
  ["{ label: '间隔', value: 'interval' }", "{ label: 'Interval', value: 'interval' }"],
  ["{ label: '每日', value: 'daily' }", "{ label: 'Daily', value: 'daily' }"],
  ["{ key: 'when', label: '时间(ISO/cron)', type: 'string' }", "{ key: 'when', label: 'Time (ISO/cron)', type: 'string' }"],
];

for (const [from, to] of translations) {
  nodeSpecs = nodeSpecs.replaceAll(from, to);
}

fs.writeFileSync(path.join(dstDir, 'node-specs-builtin.ts'), nodeSpecs, 'utf8');
console.log('Created node-specs-builtin.ts with English labels');

// 4. Update index.ts
const indexContent = `export * from './constants';
export * from './types';
export * from './tools';
export * from './rr-graph';
export * from './step-types';
export * from './labels';
export * from './node-spec';
export * from './node-spec-registry';
export * from './node-specs-builtin';
export * from './agent-types';
export * from './message-types';
export * from './tool-schemas';
`;
fs.writeFileSync(path.join(dstDir, 'index.ts'), indexContent, 'utf8');
console.log('Updated packages/shared/src/index.ts');
