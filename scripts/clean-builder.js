const fs = require('fs');
const file = 'packages/extension/entrypoints/builder/App.vue';
let c = fs.readFileSync(file, 'utf-8');

const replacements = [
  [/已应用回退建议：提升/g, 'Applied fallback recommendation: promoted'],
  [/优先级/g, 'priority'],
  [/>撤销</g, '>Undo<'],
  [/工作流可视化编排/g, 'Visual Workflow Studio'],
  [/title="导出 JSON"/g, 'title="Export JSON"'],
  [/>\s*导出\s*</g, '>Export<'],
  [/title="导入 JSON"/g, 'title="Import JSON"'],
  [/>\s*导入\s*</g, '>Import<'],
  [/title="重命名工作流"/g, 'title="Rename Workflow"'],
  [/title="管理触发器"/g, 'title="Manage Triggers"'],
  [/title="从选中节点回放"/g, 'title="Replay from Selected Node"'],
  [/>\s*从选中运行\s*</g, '>Run Selected<'],
  [/title="从头回放整流"/g, 'title="Replay Entire Workflow"'],
  [/>\s*运行\s*</g, '>Run<'],
  [/>\s*保存\s*</g, '>Save<'],
  [/title="撤销 \(⌘\/Ctrl\+Z\)"/g, 'title="Undo (⌘/Ctrl+Z)"'],
  [/title="重做 \(⌘\/Ctrl\+Shift\+Z\)"/g, 'title="Redo (⌘/Ctrl+Shift+Z)"'],
  [/title="自动排版"/g, 'title="Auto Layout"'],
  [/title="自适应视图"/g, 'title="Fit to Screen"'],
  [/<div class="title">重命名工作流<\/div>/g, '<div class="title">Rename Workflow</div>'],
  [/<label>名称<\/label>/g, '<label>Name</label>'],
  [/placeholder="工作流名称"/g, 'placeholder="Workflow Name"'],
  [/<label>描述<\/label>/g, '<label>Description</label>'],
  [/placeholder="可选描述"/g, 'placeholder="Optional description"'],
  [/const title = ref\('工作流编辑器'\);/g, "const title = ref('Workflow Studio');"],
  [/title\.value = `编辑：\$\{/g, 'title.value = `Edit: ${'],
  [/工作流 "\$\{q\.flowId\}" 未找到，已创建新工作流/g, 'Workflow "${q.flowId}" not found; initialized new workflow'],
  [/加载工作流失败：/g, 'Failed to load workflow: '],
  [/初始化一个空的工作流/g, 'Initialize empty workflow'],
  [/name: '新建工作流',/g, "name: 'Untitled Workflow',"],
  [/title\.value = '新建工作流';/g, "title.value = 'New Workflow';"],
  [/保存 Flow 到 V3 RPC/g, 'Persist flow to V3 RPC'],
  [/保存成功返回 FlowV3，失败返回 null/g, 'Returns FlowV3 on success, null on error'],
  [/保存失败：/g, 'Failed to save workflow: '],
  [/将 V2 schedule 配置转换为 cron 表达式/g, 'Convert V2 schedule to cron expression'],
  [/cron 表达式或 null（如果无法转换）/g, 'cron expression or null if non-convertible'],
  [/\/\/ V3 cron 不支持 'once' 一次性定时/g, "// V3 cron does not support 'once' triggers"],
  [/从 trigger 节点配置同步触发器到 V3 存储/g, 'Synchronize trigger node configs to V3 storage'],
  [/V2 schedules 会转换为 V3 cron triggers/g, 'V2 schedules are mapped to V3 cron triggers'],
  [/V3 暂不支持一次性定时（once），已跳过/g, 'V3 does not support once triggers; skipped'],
  [/无法转换为 cron（type=\$\{scheduleType\}），已跳过/g, 'Unable to convert to cron (type=${scheduleType}); skipped'],
  [/导出失败：/g, 'Failed to export workflow: '],
  [/导入失败：未找到工作流数据/g, 'Failed to import: No workflow data found'],
  [/导入失败：/g, 'Failed to import workflow: '],
  [/运行失败：/g, 'Failed to execute workflow: '],
  [/saveState\.value === 'saving' \? '保存中…' : saveState\.value === 'saved' \? '已保存' : ''/g, "saveState.value === 'saving' ? 'Saving…' : saveState.value === 'saved' ? 'Saved' : ''"]
];

for (const [r, rep] of replacements) {
  c = c.replace(r, rep);
}

fs.writeFileSync(file, c, 'utf-8');
console.log('Cleaned builder/App.vue');
