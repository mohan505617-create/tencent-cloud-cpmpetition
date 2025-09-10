const fs = require('fs');
const path = require('path');

// 创建项目文件清单
const projectFiles = {
  'README.md': '项目说明文档',
  'PROJECT_STRUCTURE.md': '项目结构说明',
  'package.json': '项目配置和依赖',
  'package-lock.json': '依赖锁定文件',
  'tsconfig.json': 'TypeScript配置',
  'tsconfig.node.json': 'Node.js TypeScript配置',
  'vite.config.ts': 'Vite构建配置',
  'tailwind.config.js': 'Tailwind CSS配置',
  'postcss.config.js': 'PostCSS配置',
  'index.html': 'HTML模板',
  'src/main.tsx': '应用入口文件',
  'src/MainApp.tsx': '主应用组件',
  'src/App.tsx': '原始应用组件',
  'src/App.css': '应用样式',
  'src/index.css': '全局样式',
  'src/components/Header.tsx': '头部组件',
  'src/components/Sidebar.tsx': '侧边栏组件',
  'src/components/Footer.tsx': '页脚组件',
  'src/components/Preview.tsx': 'Markdown预览组件',
  'src/components/QuickCapture.tsx': '快速笔记组件',
  'src/components/SearchBar.tsx': '搜索栏组件',
  'src/components/InspireButton.tsx': '启发按钮组件',
  'src/components/AIRecommendations.tsx': 'AI推荐组件',
  'src/components/KnowledgeGraph.tsx': '知识图谱组件',
  'src/components/SimpleKnowledgeGraph.tsx': '简化知识图谱',
  'src/pages/Welcome.tsx': '欢迎页面',
  'src/pages/Dashboard.tsx': '仪表板页面',
  'src/pages/DocumentList.tsx': '文档列表页面',
  'src/pages/DocumentViewer.tsx': '文档查看器',
  'src/pages/Categories.tsx': '分类管理页面',
  'src/pages/Search.tsx': '搜索页面',
  'src/pages/Settings.tsx': '设置页面',
  'src/store/knowledgeStore.ts': '状态管理',
  'src/utils/exportUtils.ts': '导出工具',
  'src/utils/offlineManager.ts': '离线管理器',
  'src/types/index.ts': '类型定义'
};

console.log('🎓 香港城市大学个人学术档案管理系统');
console.log('📦 项目文件清单\n');

let totalFiles = 0;
let existingFiles = 0;

Object.entries(projectFiles).forEach(([filePath, description]) => {
  totalFiles++;
  const fullPath = path.join(__dirname, filePath);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    existingFiles++;
    console.log(`✅ ${filePath.padEnd(40)} - ${description}`);
  } else {
    console.log(`❌ ${filePath.padEnd(40)} - ${description} (缺失)`);
  }
});

console.log(`\n📊 统计信息:`);
console.log(`   总文件数: ${totalFiles}`);
console.log(`   已存在: ${existingFiles}`);
console.log(`   缺失: ${totalFiles - existingFiles}`);
console.log(`   完成度: ${Math.round((existingFiles / totalFiles) * 100)}%`);

console.log('\n🚀 快速开始:');
console.log('   1. npm install     # 安装依赖');
console.log('   2. npm run dev     # 启动开发服务器');
console.log('   3. 访问 http://localhost:5173');

console.log('\n🎯 主要功能:');
console.log('   📝 智能笔记管理 - Markdown支持，实时预览');
console.log('   🔗 知识关联网络 - 双向链接，知识图谱');
console.log('   🔍 智能搜索检索 - 全文搜索，语义匹配');
console.log('   📊 学习进度跟踪 - 数据统计，进度分析');
console.log('   🎨 个性化体验 - 主题切换，响应式设计');

console.log('\n🏫 香港城市大学特色:');
console.log('   🎓 专为城大学生设计的学术档案管理');
console.log('   🌟 融入城大品牌元素和校园文化');
console.log('   📚 支持课程学习、学术研究、项目管理');
console.log('   💡 AI驱动的智能推荐和学习建议');

if (existingFiles === totalFiles) {
  console.log('\n🎉 项目文件完整，可以开始使用！');
} else {
  console.log('\n⚠️  部分文件缺失，请检查项目完整性');
}

console.log('\n📁 项目目录结构:');
console.log('cityu-knowledge-system/');
console.log('├── README.md                    # 详细使用说明');
console.log('├── PROJECT_STRUCTURE.md         # 项目结构文档');
console.log('├── package.json                 # 依赖配置');
console.log('├── src/');
console.log('│   ├── components/              # 可复用组件');
console.log('│   ├── pages/                   # 页面组件');
console.log('│   ├── store/                   # 状态管理');
console.log('│   ├── utils/                   # 工具函数');
console.log('│   └── types/                   # 类型定义');
console.log('└── 配置文件...');

console.log('\n🔧 技术栈:');
console.log('   ⚛️  React 18 + TypeScript');
console.log('   🎨 Ant Design + Tailwind CSS');
console.log('   ⚡ Vite + 现代化构建工具');
console.log('   🗃️  Zustand 状态管理');
console.log('   🔍 智能搜索 + AI推荐');
console.log('   📱 PWA + 离线支持');