import React, { createContext, useContext, ReactNode } from 'react';

interface 语言上下文类型 {
  语言: string;
  翻译: (键: string) => string;
}

const 语言上下文 = createContext<语言上下文类型 | undefined>(undefined);

interface 语言提供者属性 {
  children: ReactNode;
}

// 中文翻译字典
const 翻译字典: Record<string, string> = {
  'welcome': '欢迎',
  'dashboard': '仪表板',
  'knowledge': '知识管理',
  'research': '研究助手',
  'teaching': '教学助手',
  'profile': '个人资料',
  'settings': '设置',
  'search': '搜索',
  'save': '保存',
  'cancel': '取消',
  'edit': '编辑',
  'delete': '删除',
  'add': '添加',
  'loading': '加载中...',
  'error': '错误',
  'success': '成功'
};

export const 语言提供者: React.FC<语言提供者属性> = ({ children }) => {
  const 翻译 = (键: string): string => {
    return 翻译字典[键] || 键;
  };

  return (
    <语言上下文.Provider value={{ 语言: 'zh-CN', 翻译 }}>
      {children}
    </语言上下文.Provider>
  );
};

export const 使用语言 = () => {
  const context = useContext(语言上下文);
  if (context === undefined) {
    throw new Error('使用语言必须在语言提供者内使用');
  }
  return context;
};

export const 使用翻译 = () => {
  const { 翻译 } = 使用语言();
  return 翻译;
};