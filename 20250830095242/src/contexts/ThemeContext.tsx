import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';

interface 主题上下文类型 {
  是否深色模式: boolean;
  当前主题: 'light' | 'dark' | 'auto';
  主色调: string;
  字体大小: number;
  切换主题: () => void;
  设置主题: (主题: 'light' | 'dark' | 'auto') => void;
  设置主色调: (颜色: string) => void;
  设置字体大小: (大小: number) => void;
}

const 主题上下文 = createContext<主题上下文类型 | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(主题上下文);
  if (!context) {
    throw new Error('使用主题必须在主题提供者内使用');
  }
  return context;
};

interface 主题提供者属性 {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<主题提供者属性> = ({ children }) => {
  const [当前主题, 设置当前主题] = useState<'light' | 'dark' | 'auto'>('light');
  const [主色调, 设置主色调状态] = useState('#1890ff');
  const [字体大小, 设置字体大小状态] = useState(14);
  const [是否深色模式, 设置是否深色模式] = useState(false);

  // 从本地存储加载设置
  useEffect(() => {
    const 保存的设置 = localStorage.getItem('user-settings');
    if (保存的设置) {
      try {
        const 设置 = JSON.parse(保存的设置);
        if (设置.theme) 设置当前主题(设置.theme);
        if (设置.primaryColor) 设置主色调状态(设置.primaryColor);
        if (设置.fontSize) 设置字体大小状态(设置.fontSize);
      } catch (错误) {
        console.error('加载主题设置失败:', 错误);
      }
    }
  }, []);

  // 应用主题设置
  useEffect(() => {
    应用主题设置();
  }, [当前主题, 主色调, 字体大小]);

  // 监听系统主题变化（用于auto模式）
  useEffect(() => {
    if (当前主题 === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        console.log('系统主题变化:', e.matches ? '深色' : '浅色');
        设置是否深色模式(e.matches);
        updateDocumentTheme(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      
      // 立即检测当前系统主题
      const currentSystemTheme = mediaQuery.matches;
      console.log('当前系统主题:', currentSystemTheme ? '深色' : '浅色');
      设置是否深色模式(currentSystemTheme);
      updateDocumentTheme(currentSystemTheme ? 'dark' : 'light');
      
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      设置是否深色模式(当前主题 === 'dark');
      updateDocumentTheme(当前主题);
    }
  }, [当前主题]);

  const updateDocumentTheme = (themeMode: 'light' | 'dark') => {
    // 使用Tailwind的dark类而不是data-theme属性
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const 应用主题设置 = () => {
    // 应用主题模式
    if (当前主题 === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      console.log('自动模式检测到系统主题:', prefersDark ? '深色' : '浅色');
      updateDocumentTheme(prefersDark ? 'dark' : 'light');
      设置是否深色模式(prefersDark);
    } else {
      console.log('手动设置主题:', 当前主题);
      updateDocumentTheme(当前主题);
      设置是否深色模式(当前主题 === 'dark');
    }
    
    // 应用主色调
    document.documentElement.style.setProperty('--accent-primary', 主色调);
    
    // 应用字体大小
    document.documentElement.style.setProperty('--font-size-base', `${字体大小}px`);
    
    // 移除之前的字体大小类
    document.body.classList.remove('font-size-small', 'font-size-medium', 'font-size-large', 'font-size-xlarge');
    
    // 添加对应的字体大小类
    const fontSizeMap: { [key: number]: string } = {
      12: 'font-size-small',
      14: 'font-size-medium',
      16: 'font-size-large', 
      18: 'font-size-xlarge'
    };
    const fontSizeClass = fontSizeMap[字体大小] || 'font-size-medium';
    document.body.classList.add(fontSizeClass);
  };

  const 切换主题 = () => {
    const newTheme = 当前主题 === 'light' ? 'dark' : 'light';
    设置主题(newTheme);
  };

  const 设置主题 = (主题: 'light' | 'dark' | 'auto') => {
    设置当前主题(主题);
    
    // 保存到localStorage
    const currentSettings = JSON.parse(localStorage.getItem('user-settings') || '{}');
    const newSettings = { ...currentSettings, theme: 主题 };
    localStorage.setItem('user-settings', JSON.stringify(newSettings));
  };

  const 设置主色调 = (颜色: string) => {
    设置主色调状态(颜色);
    
    // 保存到localStorage
    const currentSettings = JSON.parse(localStorage.getItem('user-settings') || '{}');
    const newSettings = { ...currentSettings, primaryColor: 颜色 };
    localStorage.setItem('user-settings', JSON.stringify(newSettings));
  };

  const 设置字体大小 = (大小: number) => {
    设置字体大小状态(大小);
    
    // 保存到localStorage
    const currentSettings = JSON.parse(localStorage.getItem('user-settings') || '{}');
    const newSettings = { ...currentSettings, fontSize: 大小 };
    localStorage.setItem('user-settings', JSON.stringify(newSettings));
  };

  // 动态Ant Design主题配置
  const antdThemeConfig = {
    algorithm: 是否深色模式 ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: 主色调,
      fontSize: 字体大小,
      borderRadius: 8,
      // 根据主题模式动态设置颜色
      ...(是否深色模式 ? {
        colorBgContainer: '#1a1a1a',
        colorBgElevated: '#2d2d2d',
        colorBgLayout: '#1a1a1a',
        colorText: '#f0f0f0',
        colorTextSecondary: '#b8b8b8',
        colorBorder: '#404040',
        colorBorderSecondary: '#2d2d2d',
      } : {
        colorBgContainer: '#ffffff',
        colorBgElevated: '#ffffff',
        colorBgLayout: '#f0f4f8',
        colorText: '#1a1a1a',
        colorTextSecondary: '#666666',
        colorBorder: '#e0e6ed',
        colorBorderSecondary: '#f0f4f8',
      })
    },
  };

  return (
    <主题上下文.Provider value={{ 
      是否深色模式, 
      当前主题, 
      主色调, 
      字体大小,
      切换主题, 
      设置主题, 
      设置主色调, 
      设置字体大小 
    }}>
      <ConfigProvider theme={antdThemeConfig}>
        {children}
      </ConfigProvider>
    </主题上下文.Provider>
  );
};