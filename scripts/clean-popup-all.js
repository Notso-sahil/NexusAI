const fs = require('fs');
const path = require('path');

const map = {
  // Common node names
  "'触发器'": "'Trigger'",
  "'点击'": "'Click'",
  "'填充'": "'Fill'",
  "'导航'": "'Navigate'",
  "'等待'": "'Wait'",
  "'提取'": "'Extract'",
  "'脚本'": "'Script'",
  "'条件'": "'Condition'",
  "'循环'": "'Loop'",
  "'断言'": "'Assert'",
  "'键盘'": "'Key Press'",
  "'拖拽'": "'Drag'",
  "'双击'": "'Double Click'",
  "'打开标签'": "'Open Tab'",
  "'切换标签'": "'Switch Tab'",
  "'关闭标签'": "'Close Tab'",
  "'延迟'": "'Delay'",
  "'滚动'": "'Scroll'",

  // Property labels
  '>节点属性<': '>Node Properties<',
  'title="删除节点"': 'title="Delete Node"',
  '>节点名称<': '>Node Name<',
  'placeholder="输入节点名称"': 'placeholder="Enter node label"',
  '>通用设置<': '>General Settings<',
  '>超时 (ms)<': '>Timeout (ms)<',
  'placeholder="默认使用全局超时"': 'placeholder="Inherit global timeout"',
  '>失败时截图<': '>Screenshot on failure<',
  '>⚠️ 配置错误<': '>⚠️ Configuration Errors<',
  '选择一个节点<br />查看和编辑属性': 'Select a node<br />to configure properties',
  "prompt('请输入新子流ID')": "prompt('Enter new subflow identifier:')",
  "'需填写保存变量名'": "'Variable name required'",
  "'需提供 selector 或 js'": "'Selector or JS expression required'",

  // Edge panel & key-value
  'title="删除边"': 'title="Delete Edge"',
  '>未选择边<': '>No edge selected<',
  'placeholder="变量名"': 'placeholder="Variable name"',
  'placeholder="结果路径（如 data.items[0].id）"': 'placeholder="Path (e.g. data.items[0].id)"',
  '>删<': '>Del<',
  '>添加映射<': '>Add Mapping<',

  // Schedule dialog
  '>定时执行<': '>Schedule Execution<',
  '>启用定时<': '>Enable Schedule<',
  '>类型<': '>Type<',
  '>每隔 N 分钟<': '>Interval (every N min)<',
  '>每天固定时间<': '>Daily (fixed time)<',
  '>只执行一次<': '>Once<',
  '>间隔(分钟)<': '>Interval (minutes)<',
  '>时间(HH:mm)<': '>Time (HH:mm)<',
  'placeholder="例如 09:30"': 'placeholder="e.g. 09:30"',
  '>时间(ISO)<': '>Time (ISO)<',
  'placeholder="例如 2025-10-05T10:00:00"': 'placeholder="e.g. 2026-10-05T10:00:00"',
  '>参数(JSON)<': '>Arguments (JSON)<',
  '>已有计划<': '>Existing Schedules<',
  '>每 ${s.when} 分钟`': '>Every ${s.when} min`',
  '>每天 ${s.when}`': '>Daily at ${s.when}`',
  '>一次 ${s.when}`': '>Once at ${s.when}`',

  // Element marker management
  '>元素标注管理<': '>Element Marker Registry<',
  '>当前页面<': '>Current Page<',
  '>已标注元素<': '>Registered Markers<',
  '>新增标注<': '>Add Marker<',
  'placeholder="名称，如 登录按钮"': 'placeholder="Marker name, e.g. Login Button"',
  '>路径前缀<': '>URL Prefix<',
  '>精确匹配<': '>Exact URL<',
  '>域名<': '>Host<',
  'placeholder="CSS 选择器"': 'placeholder="CSS Selector"',
  '>清空<': '>Reset<',
  '>验证<': '>Validate<',
  '>编辑<': '>Edit<',
  '>删除<': '>Delete<',

  // Local model page
  'title="返回首页"': 'title="Back"',
  '>返回<': '>Back<',
  '>本地模型<': '>Local Models<',

  // Properties forms
  '>URL 地址<': '>Target URL<',
  '>URL 地址（可选）<': '>Target URL (Optional)<',
  '>新窗口<': '>New Window<',
  '>元素选择器（可选）<': '>Element Selector (Optional)<',
  'placeholder="为空则截取可视区或全页"': 'placeholder="Leave blank to capture viewport"',
  '>全页截图<': '>Full Page Screenshot<',
  '>保存为变量<': '>Save to Variable<',
  '>保存为变量（可选）<': '>Save as Variable (Optional)<',
  'placeholder="变量名，例如 shot"': 'placeholder="Variable name, e.g. screenshotData"',
  '>代码<': '>Code<',
  '>执行环境<': '>Execution Context<',
  '>执行时机<': '>Execution Timing<',
  '>结果字段映射<': '>Result Field Mappings<',
  '>模式<': '>Mode<',
  '>滚动到元素<': '>Scroll to Element<',
  '>窗口偏移<': '>Window Offset<',
  '>容器偏移<': '>Container Offset<',
  'title="目标元素"': 'title="Target Element"',
  '>偏移 X<': '>Offset X<',
  '>偏移 Y<': '>Offset Y<',
  'title="容器选择器"': 'title="Container Selector"',
  '<small>容器需支持 scrollTo(top,left)</small>': '<small>Container element must support scrollTo(top, left)</small>',
  '>属性名<': '>Attribute Name<',
  'placeholder="如 value/src/disabled 等"': 'placeholder="e.g. value/src/disabled"',
  '>属性值（留空并勾选删除则移除）<': '>Attribute Value (check remove to delete)<',
  'placeholder="属性值"': 'placeholder="Attribute value"',
  '>删除属性<': '>Remove Attribute<',
  '>按 URL 包含匹配（优先）<': '>Match by URL Contains (Primary)<',
  'placeholder="frame URL 包含的字符串"': 'placeholder="Frame URL substring"',
  '>按索引匹配（从 0 起，仅子 frame）<': '>Match by Frame Index (0-indexed)<',
  'placeholder="索引数字"': 'placeholder="Index number"',
  '>同源/可注入 frame 可用；留空则回到顶级页面<': '>Accessible frames only; blank for top page<',
  '>Tab ID（可选）<': '>Tab ID (Optional)<',
  'placeholder="数字"': 'placeholder="Number"',
  '>URL 包含（可选）<': '>URL Contains (Optional)<',
  'placeholder="子串匹配"': 'placeholder="Substring match"',
  '>标题包含（可选）<': '>Title Contains (Optional)<',
  '>需提供 tabId 或 URL/标题包含<': '>Requires Tab ID or URL/title substring<',
  '>启用触发器<': '>Enable Trigger<',
  '>描述（可选）<': '>Description (Optional)<',
  'placeholder="说明此触发器的用途"': 'placeholder="Describe trigger intent"',
  '>触发方式<': '>Trigger Modes<',
  '>手动<': '>Manual<',
  '>访问 URL<': '>Navigate URL<',
  '>右键菜单<': '>Context Menu<',
  '>快捷键<': '>Keyboard Shortcut<',
  '>DOM 变化<': '>DOM Mutation<',
  '>定时<': '>Schedule<',
  '>访问 URL 匹配<': '>URL Matching Filter<',
  '>前缀 URL<': '>URL Prefix<',
  '>域名包含<': '>Domain Contains<',
  '>路径前缀<': '>Path Prefix<',
  'placeholder="例如 https://example.com/app"': 'placeholder="e.g. https://example.com/app"',
  '>+ 添加匹配<': '>+ Add Filter<',
  '>标题<': '>Title<',
  'placeholder="菜单标题"': 'placeholder="Menu title"',
  '>作用范围<': '>Scope<',
  '>命令键（需预先在 manifest commands 中声明）<': '>Command Identifier (declare in manifest)<',
  'placeholder="例如 run_quick_trigger_1"': 'placeholder="e.g. run_quick_trigger_1"',
  '>提示：Chrome 扩展快捷键需要在 manifest 里固定声明，无法运行时动态添加。<': '>Note: Shortcuts must be declared in extension manifest.<',
  '>选择器<': '>Selector<',
  '>出现时触发<': '>Trigger when element mounts<',
  '>仅触发一次<': '>Trigger once only<',
  '>去抖(ms)<': '>Debounce (ms)<',
  '>间隔(分钟)<': '>Interval (minutes)<',
  '>每天(HH:mm)<': '>Daily (HH:mm)<',
  '>一次(ISO时间)<': '>Once (ISO timestamp)<',
  'placeholder="5 或 09:00 或 2025-01-01T10:00:00"': 'placeholder="5 or 09:00 or 2026-01-01T10:00:00"',
  '>+ 添加定时<': '>+ Add Schedule<',
  '>说明：': '>Note: ',
  '触发器会在保存工作流时同步到后台触发表（URL/右键/快捷键/DOM）和计划任务（间隔/每天/一次）。': 'Triggers synchronize with runtime tables when saving the workflow.',
  "title: '运行工作流'": "title: 'Execute Workflow'",
  '>事件类型<': '>Event Type<',
  'placeholder="如 input/change/mouseover"': 'placeholder="e.g. input/change/mouseover"',
  '>冒泡<': '>Bubbles<',
  '>可取消<': '>Cancelable<',
  '>等待条件 (JSON)<': '>Wait Condition (JSON)<',
  '>条件 (JSON)<': '>Condition Expression (JSON)<',
  '>子流 ID<': '>Subflow ID<',
  'placeholder="选择或新建子流"': 'placeholder="Select or create subflow"',
  '>新建子流<': '>New Subflow<',
  '>最大迭代次数（可选）<': '>Max Iterations (Optional)<',
  "title || '选择器'": "title || 'Selector'",
  '>从页面选择<': '>Pick from Page<',
  'placeholder="选择器值"': 'placeholder="Selector value"',
  '>+ 添加选择器<': '>+ Add Selector<',
};

function walk(dir) {
  let results = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) results.push(...walk(full));
    else if (/\.(vue|ts|css|html)$/.test(f)) results.push(full);
  }
  return results;
}

const files = walk('packages/extension/entrypoints/popup');
let modified = 0;

for (const f of files) {
  let content = fs.readFileSync(f, 'utf-8');
  let changed = false;

  for (const [k, v] of Object.entries(map)) {
    if (content.includes(k)) {
      content = content.split(k).join(v);
      changed = true;
    }
  }

  // Remove Chinese comments
  const lines = content.split('\n');
  const han = /[\u4e00-\u9fa5]/;
  const newLines = lines.map(line => {
    if (han.test(line)) {
      // Check if it's a comment
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('<!--')) {
        changed = true;
        return '';
      }
    }
    return line;
  });

  if (changed) {
    fs.writeFileSync(f, newLines.join('\n'), 'utf-8');
    modified++;
  }
}

console.log('Modified files in popup:', modified);
