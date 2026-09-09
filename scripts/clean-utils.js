const fs = require('fs');

// 1. Clean semantic-similarity-engine.ts
let s = fs.readFileSync('packages/extension/utils/semantic-similarity-engine.ts', 'utf-8');
const sReplacements = [
  [/1\. 尝试从缓存获取数据/g, '1. Attempt to fetch from cache'],
  [/2\. 从网络获取数据/g, '2. Fetch data over network'],
  [/3\. 获取数据并存储到缓存/g, '3. Fetch data and persist to cache'],
  [/如果获取失败，清理可能不完整的缓存条目/g, 'Purge incomplete cache entry on error'],
  [/确保offscreen document存在/g, 'Ensure offscreen document is initialized'],
  [/方式1: Chrome extension URL \(推荐，生产环境最可靠\)/g, 'Strategy 1: Chrome extension URL (recommended for production)'],
  [/更新 Worker 统计信息/g, 'Update Worker performance metrics'],
  [/检查 event\.error 是否存在/g, 'Check if event.error exists'],
  [/带进度回调的初始化方法/g, 'Initialization with progress callback'],
  [/带进度回调的内部初始化方法/g, 'Internal initialization with progress callback'],
  [/进度报告辅助函数/g, 'Progress reporting helper'],
  [/检测环境并决定使用哪种模式/g, 'Detect execution context and select mode'],
  [/🛠️ 防止死循环：如果已经在 offscreen document 中，强制使用直接 Worker 模式/g, 'Avoid recursion: force direct Worker mode when inside offscreen document'],
  [/使用offscreen模式 - 委托给offscreen document，它会处理自己的进度/g, 'Offscreen mode: delegate to offscreen document'],
  [/发送初始化消息到offscreen document/g, 'Send initialization message to offscreen document'],
  [/确保配置对象被正确序列化，显式设置所有属性/g, 'Ensure configuration is properly serialized'],
  [/强制转换为布尔值/g, 'Cast to boolean'],
  [/使用 JSON 序列化确保数据完整性/g, 'Ensure serialization integrity'],
  [/使用直接Worker模式 - 这里我们可以提供真实的进度跟踪/g, 'Direct Worker mode: provide live progress tracking'],
  [/创建一个更详细的错误对象/g, 'Create detailed error payload'],
  [/使用offscreen模式/g, 'Use offscreen mode'],
  [/使用原始配置，不强制修改 useLocalFiles/g, 'Use original config without mutation'],
  [/使用直接Worker模式/g, 'Use direct Worker mode'],
  [/检查路径是否存在/g, 'Verify target path exists'],
  [/对于WXT，public目录下的资源在运行时位于根路径/g, 'For WXT, public directory assets reside at runtime root'],
  [/直接使用模型标识符，transformers\.js 会自动添加 \/models\/ 前缀/g, 'Use model identifier directly; transformers.js prepends /models/'],
  [/对于不需要token_type_ids的模型，在tokenizer配置中明确设置/g, 'Explicitly configure tokenizer for models not requiring token_type_ids'],
  [/尝试初始化 SIMD 加速/g, 'Attempt SIMD acceleration initialization'],
  [/直接Worker模式的初始化，支持进度回调/g, 'Direct Worker initialization with progress callback'],
  [/使用 transformers\.js 2\.17\+ 的进度回调功能/g, 'Use transformers.js progress callback'],
  [/如果进度回调不支持，回退到标准方式/g, 'Fallback to standard initialization if progress is unsupported'],
  [/更有代表性的预热文本，包含不同长度和语言/g, 'Representative warm-up prompts covering varying token lengths'],
  [/短文本/g, 'Short prompt'],
  [/'你好',/g, "'Hello',"],
  [/中等长度文本/g, 'Medium length prompt'],
  [/'你好世界，这是一个测试。',/g, "'Hello world, this is an embedding tensor verification test.',"],
  [/长文本/g, 'Long prompt'],
  [/'这是一个包含多个句子的较长文本。它有助于为各种文本长度预热模型。',/g, "'This is a multi-sentence prompt designed to initialize and warm up local embedding tensors across diverse query lengths.',"],
  [/渐进式预热：先单个，再批量/g, 'Progressive warm-up: single query then batch'],
  [/保留预热结果，不清空缓存/g, 'Retain warm-up cache'],
  [/对于单个文本，尝试使用缓存/g, 'Attempt cache lookup for single text'],
  [/对于不需要token_type_ids的模型，明确设置return_token_type_ids为false/g, 'Set return_token_type_ids to false when unneeded'],
  [/更新性能统计/g, 'Update performance telemetry'],
  [/缓存结果/g, 'Cache inference results'],
  [/对于批量文本，直接处理（批量处理通常不重复）/g, 'Process batch texts directly'],
  [/优化：直接使用 Float32Array，避免不必要的转换/g, 'Optimization: use Float32Array directly'],
  [/使用内存池获取 embedding 数组/g, 'Acquire embedding array from buffer pool'],
  [/如果使用offscreen模式，委托给offscreen document/g, 'Delegate to offscreen document when in offscreen mode'],
  [/验证响应数据/g, 'Validate response data'],
  [/验证转换后的数据/g, 'Validate converted data'],
  [/先检查缓存/g, 'Check cache first'],
  [/如果所有都在缓存中，直接返回/g, 'Return directly if all entries are cached'],
  [/只请求未缓存的文本/g, 'Only request uncached items'],
  [/将结果放回对应位置并缓存/g, 'Insert results into corresponding positions and cache'],
  [/使用真正的批处理推理/g, 'Execute batch inference'],
  [/直接模式的原有逻辑/g, 'Direct execution logic'],
  [/使用 SIMD 优化的矩阵计算（如果可用）/g, 'Use SIMD-accelerated matrix operations when available'],
  [/JavaScript 回退版本/g, 'JavaScript fallback implementation'],
  [/使用 SIMD 优化版本（如果可用）/g, 'Use SIMD-optimized version if available'],
  [/SIMD 版本是异步的，但为了保持接口兼容性，我们需要同步版本/g, 'SIMD version is async; keeping sync fallback for compatibility'],
  [/这里我们回退到 JavaScript 版本，或者可以考虑重构为异步/g, 'Fallback to JS version or async implementation'],
  [/新增：异步 SIMD 优化的余弦相似度/g, 'Async SIMD-optimized cosine similarity'],
  [/throw new Error\('输入必须是字符串'\);/g, "throw new Error('Input must be a string');"],
  [/throw new Error\('输入文本不能为空'\);/g, "throw new Error('Input text cannot be empty');"],
  [/console\.warn\('输入文本可能过长，将由分词器截断。'\);/g, "console.warn('Input text may be truncated by tokenizer.');"],
  [/新增：获取 Worker 统计信息/g, 'Get Worker telemetry statistics'],
  [/新增：清理 Worker 缓冲区/g, 'Clear Worker buffers'],
  [/新增：清理所有缓存/g, 'Clear all caches'],
  [/新增：获取内存使用情况/g, 'Get memory usage telemetry'],
  [/清理 Worker 缓冲区/g, 'Clear Worker buffers'],
  [/清理 SIMD 引擎/g, 'Teardown SIMD engine']
];
for (const [r, rep] of sReplacements) {
  s = s.replace(r, rep);
}
fs.writeFileSync('packages/extension/utils/semantic-similarity-engine.ts', s, 'utf-8');

// 2. Clean vector-database.ts
let v = fs.readFileSync('packages/extension/utils/vector-database.ts', 'utf-8');
v = v.replace('// 1. 计算文档映射的大小', '// 1. Compute document map size')
     .replace('// 2. 计算向量数据的大小', '// 2. Compute vector data size')
     .replace('// 3. 估算索引结构的大小', '// 3. Estimate index structure size')
     .replace('// 返回一个基于文档数量的估算值', '// Return document-count-based estimate')
     .replace('totalSize = this.documents.size * 1024; // 每个文档估算1KB', 'totalSize = this.documents.size * 1024; // Estimate ~1KB per document')
     .replace('// 私有辅助方法', '// Private helper utilities');
fs.writeFileSync('packages/extension/utils/vector-database.ts', v, 'utf-8');

// 3. Clean output-sanitizer.ts
let o = fs.readFileSync('packages/extension/utils/output-sanitizer.ts', 'utf-8');
const oReplacements = [
  [/Output Sanitizer - 输出脱敏和限长工具/g, 'Output Sanitizer - redaction and size limit utilities'],
  [/提供对 JavaScript 执行结果的安全处理：/g, 'Provides security processing for script execution outputs:'],
  [/1\. 敏感信息脱敏（cookie\/token\/password 等）/g, '1. Sensitive credential redaction (cookie/token/password)'],
  [/2\. 输出长度限制（默认 50KB）/g, '2. Output length constraint (default 50KB)'],
  [/3\. 深度对象序列化/g, '3. Deep object serialization'],
  [/敏感 key 标识符（会被脱敏）/g, 'Sensitive key identifiers targeted for redaction'],
  [/参考 mcp-tools\.js 的敏感 key 列表/g, 'Standard sensitive key definitions'],
  [/补充 mcp-tools\.js 中的敏感 key/g, 'Additional credential keys'],
  [/对任意值进行脱敏和限长处理/g, 'Sanitize and constrain output values'],
  [/对字符串进行敏感信息脱敏/g, 'Redact sensitive credential patterns from string'],
  [/参考 mcp-tools\.js 的脱敏逻辑，增加 Base64\/Hex\/cookie-query 识别/g, 'Redaction pattern matching with Base64/Hex/cookie detection'],
  [/1\. 整体字符串检测（mcp-tools\.js 风格）/g, '1. Full string pattern detection'],
  [/Cookie\/query string 形态检测（包含 = 和 ; 或 &）/g, 'Cookie/query string pattern detection'],
  [/检测 cookie 字符串/g, 'Detect cookie string'],
  [/检测 query string \(key=value&key2=value2 形态\)/g, 'Detect query string format'],
  [/Base64 编码数据检测（20\+ 字符的 Base64 字符串）/g, 'Base64 encoded data detection (20+ chars)'],
  [/Hex credential 检测（32\+ 字符的纯十六进制）/g, 'Hex credential detection (32+ chars)'],
  [/3\. JWT \(三段式\)/g, '3. JWT token (three-part)'],
  [/4\. URL query 参数中的敏感值/g, '4. Sensitive URL query parameters'],
  [/5\. Header-like 键值对/g, '5. Header key-value pairs'],
  [/6\. 内嵌的 Base64 数据（在混合内容中）/g, '6. Embedded Base64 tokens'],
  [/7\. 内嵌的长 Hex 字符串（可能是 API key、hash 等）/g, '7. Embedded long hex credentials'],
  [/检测字符串是否像 query string \(key=value&key2=value2\)/g, 'Check if string resembles query string'],
  [/检测字符串是否像 cookie 字符串 \(key=value; key2=value2\)/g, 'Check if string resembles cookie string'],
  [/二分查找合适的截断点/g, 'Binary search for truncation boundary']
];
for (const [r, rep] of oReplacements) {
  o = o.replace(r, rep);
}
fs.writeFileSync('packages/extension/utils/output-sanitizer.ts', o, 'utf-8');

console.log('Cleaned utils files successfully.');
