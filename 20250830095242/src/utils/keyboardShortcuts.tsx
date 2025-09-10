// 键盘快捷键系统
import { useEffect, useCallback, useRef } from 'react';

// 快捷键配置接口
export interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  description?: string;
  category?: string;
  preventDefault?: boolean;
  stopPropagation?: boolean;
}

// 快捷键处理器类型
export type ShortcutHandler = (event: KeyboardEvent) => void | boolean;

// 快捷键管理器
export class KeyboardShortcutManager {
  private shortcuts = new Map<string, { config: ShortcutConfig; handler: ShortcutHandler }>();
  private isEnabled = true;
  private activeElement: HTMLElement | null = null;

  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.enable();
  }

  // 注册快捷键
  register(config: ShortcutConfig, handler: ShortcutHandler): () => void {
    const key = this.generateKey(config);
    this.shortcuts.set(key, { config, handler });

    // 返回取消注册函数
    return () => {
      this.shortcuts.delete(key);
    };
  }

  // 批量注册快捷键
  registerMultiple(shortcuts: Array<{ config: ShortcutConfig; handler: ShortcutHandler }>): () => void {
    const unregisterFunctions = shortcuts.map(({ config, handler }) => 
      this.register(config, handler)
    );

    return () => {
      unregisterFunctions.forEach(fn => fn());
    };
  }

  // 取消注册快捷键
  unregister(config: ShortcutConfig): void {
    const key = this.generateKey(config);
    this.shortcuts.delete(key);
  }

  // 启用快捷键系统
  enable(): void {
    if (!this.isEnabled) {
      document.addEventListener('keydown', this.handleKeyDown, true);
      this.isEnabled = true;
    }
  }

  // 禁用快捷键系统
  disable(): void {
    if (this.isEnabled) {
      document.removeEventListener('keydown', this.handleKeyDown, true);
      this.isEnabled = false;
    }
  }

  // 设置活动元素（用于上下文相关的快捷键）
  setActiveElement(element: HTMLElement | null): void {
    this.activeElement = element;
  }

  // 获取所有注册的快捷键
  getShortcuts(): Array<{ key: string; config: ShortcutConfig }> {
    return Array.from(this.shortcuts.entries()).map(([key, { config }]) => ({
      key,
      config,
    }));
  }

  // 获取快捷键帮助信息
  getHelpText(): string {
    const shortcuts = this.getShortcuts();
    const categories = new Map<string, Array<{ key: string; config: ShortcutConfig }>>();

    // 按类别分组
    shortcuts.forEach(shortcut => {
      const category = shortcut.config.category || '通用';
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)!.push(shortcut);
    });

    // 生成帮助文本
    let helpText = '键盘快捷键:\n\n';
    for (const [category, items] of categories) {
      helpText += `${category}:\n`;
      items.forEach(({ config }) => {
        const keyText = this.formatKeyText(config);
        helpText += `  ${keyText} - ${config.description || '无描述'}\n`;
      });
      helpText += '\n';
    }

    return helpText;
  }

  // 检查快捷键是否冲突
  hasConflict(config: ShortcutConfig): boolean {
    const key = this.generateKey(config);
    return this.shortcuts.has(key);
  }

  // 私有方法：处理键盘事件
  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.isEnabled) return;

    // 检查是否在输入元素中
    const target = event.target as HTMLElement;
    if (this.isInputElement(target)) {
      return;
    }

    const key = this.generateKeyFromEvent(event);
    const shortcut = this.shortcuts.get(key);

    if (shortcut) {
      const { config, handler } = shortcut;

      // 检查上下文
      if (this.activeElement && !this.activeElement.contains(target)) {
        return;
      }

      if (config.preventDefault !== false) {
        event.preventDefault();
      }

      if (config.stopPropagation !== false) {
        event.stopPropagation();
      }

      // 执行处理器
      const result = handler(event);
      
      // 如果处理器返回false，则不阻止默认行为
      if (result === false) {
        // 恢复默认行为
      }
    }
  }

  // 私有方法：生成快捷键标识
  private generateKey(config: ShortcutConfig): string {
    const parts: string[] = [];
    
    if (config.ctrl) parts.push('ctrl');
    if (config.alt) parts.push('alt');
    if (config.shift) parts.push('shift');
    if (config.meta) parts.push('meta');
    
    parts.push(config.key.toLowerCase());
    
    return parts.join('+');
  }

  // 私有方法：从事件生成快捷键标识
  private generateKeyFromEvent(event: KeyboardEvent): string {
    const parts: string[] = [];
    
    if (event.ctrlKey) parts.push('ctrl');
    if (event.altKey) parts.push('alt');
    if (event.shiftKey) parts.push('shift');
    if (event.metaKey) parts.push('meta');
    
    parts.push(event.key.toLowerCase());
    
    return parts.join('+');
  }

  // 私有方法：格式化快捷键文本
  private formatKeyText(config: ShortcutConfig): string {
    const parts: string[] = [];
    
    if (config.ctrl) parts.push('Ctrl');
    if (config.alt) parts.push('Alt');
    if (config.shift) parts.push('Shift');
    if (config.meta) parts.push('Cmd');
    
    parts.push(config.key.toUpperCase());
    
    return parts.join(' + ');
  }

  // 私有方法：检查是否为输入元素
  private isInputElement(element: HTMLElement): boolean {
    const tagName = element.tagName.toLowerCase();
    const inputTypes = ['input', 'textarea', 'select'];
    
    if (inputTypes.includes(tagName)) {
      return true;
    }

    // 检查contenteditable
    if (element.contentEditable === 'true') {
      return true;
    }

    return false;
  }
}

// 全局快捷键管理器实例
export const globalShortcutManager = new KeyboardShortcutManager();

// React Hook：使用快捷键
export function useKeyboardShortcut(
  config: ShortcutConfig,
  handler: ShortcutHandler,
  deps: React.DependencyList = []
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const wrappedHandler = (event: KeyboardEvent) => {
      return handlerRef.current(event);
    };

    const unregister = globalShortcutManager.register(config, wrappedHandler);
    return unregister;
  }, [config.key, config.ctrl, config.alt, config.shift, config.meta, ...deps]);
}

// React Hook：使用多个快捷键
export function useKeyboardShortcuts(
  shortcuts: Array<{ config: ShortcutConfig; handler: ShortcutHandler }>,
  deps: React.DependencyList = []
): void {
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  useEffect(() => {
    const wrappedShortcuts = shortcutsRef.current.map(({ config, handler }) => ({
      config,
      handler: (event: KeyboardEvent) => handler(event),
    }));

    const unregister = globalShortcutManager.registerMultiple(wrappedShortcuts);
    return unregister;
  }, deps);
}

// React Hook：快捷键上下文
export function useShortcutContext(elementRef: React.RefObject<HTMLElement>): void {
  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      const handleFocus = () => {
        globalShortcutManager.setActiveElement(element);
      };

      const handleBlur = () => {
        globalShortcutManager.setActiveElement(null);
      };

      element.addEventListener('focus', handleFocus);
      element.addEventListener('blur', handleBlur);

      return () => {
        element.removeEventListener('focus', handleFocus);
        element.removeEventListener('blur', handleBlur);
      };
    }
  }, [elementRef]);
}

// 预定义的常用快捷键配置
export const CommonShortcuts = {
  // 文件操作
  NEW: { key: 'n', ctrl: true, description: '新建', category: '文件' },
  OPEN: { key: 'o', ctrl: true, description: '打开', category: '文件' },
  SAVE: { key: 's', ctrl: true, description: '保存', category: '文件' },
  SAVE_AS: { key: 's', ctrl: true, shift: true, description: '另存为', category: '文件' },
  
  // 编辑操作
  UNDO: { key: 'z', ctrl: true, description: '撤销', category: '编辑' },
  REDO: { key: 'y', ctrl: true, description: '重做', category: '编辑' },
  CUT: { key: 'x', ctrl: true, description: '剪切', category: '编辑' },
  COPY: { key: 'c', ctrl: true, description: '复制', category: '编辑' },
  PASTE: { key: 'v', ctrl: true, description: '粘贴', category: '编辑' },
  SELECT_ALL: { key: 'a', ctrl: true, description: '全选', category: '编辑' },
  
  // 查找操作
  FIND: { key: 'f', ctrl: true, description: '查找', category: '查找' },
  FIND_NEXT: { key: 'g', ctrl: true, description: '查找下一个', category: '查找' },
  FIND_PREVIOUS: { key: 'g', ctrl: true, shift: true, description: '查找上一个', category: '查找' },
  REPLACE: { key: 'h', ctrl: true, description: '替换', category: '查找' },
  
  // 导航操作
  GO_BACK: { key: 'ArrowLeft', alt: true, description: '后退', category: '导航' },
  GO_FORWARD: { key: 'ArrowRight', alt: true, description: '前进', category: '导航' },
  GO_HOME: { key: 'Home', ctrl: true, description: '首页', category: '导航' },
  
  // 视图操作
  ZOOM_IN: { key: '=', ctrl: true, description: '放大', category: '视图' },
  ZOOM_OUT: { key: '-', ctrl: true, description: '缩小', category: '视图' },
  ZOOM_RESET: { key: '0', ctrl: true, description: '重置缩放', category: '视图' },
  TOGGLE_FULLSCREEN: { key: 'F11', description: '全屏切换', category: '视图' },
  
  // 应用操作
  REFRESH: { key: 'F5', description: '刷新', category: '应用' },
  HELP: { key: 'F1', description: '帮助', category: '应用' },
  SETTINGS: { key: ',', ctrl: true, description: '设置', category: '应用' },
  
  // 特殊键
  ESCAPE: { key: 'Escape', description: '取消/关闭', category: '特殊' },
  ENTER: { key: 'Enter', description: '确认', category: '特殊' },
  DELETE: { key: 'Delete', description: '删除', category: '特殊' },
  BACKSPACE: { key: 'Backspace', description: '退格', category: '特殊' },
};

// 快捷键帮助组件
export const ShortcutHelp: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  useKeyboardShortcut(CommonShortcuts.ESCAPE, onClose);

  if (!visible) return null;

  const shortcuts = globalShortcutManager.getShortcuts();
  const categories = new Map<string, Array<{ key: string; config: ShortcutConfig }>>();

  // 按类别分组
  shortcuts.forEach(shortcut => {
    const category = shortcut.config.category || '通用';
    if (!categories.has(category)) {
      categories.set(category, []);
    }
    categories.get(category)!.push(shortcut);
  });

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '600px',
          maxHeight: '80vh',
          overflow: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginTop: 0 }}>键盘快捷键</h2>
        
        {Array.from(categories.entries()).map(([category, items]) => (
          <div key={category} style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '12px', color: '#666' }}>{category}</h3>
            <div style={{ display: 'grid', gap: '8px' }}>
              {items.map(({ config }) => (
                <div
                  key={globalShortcutManager['generateKey'](config)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '4px 0',
                  }}
                >
                  <span>{config.description || '无描述'}</span>
                  <kbd
                    style={{
                      background: '#f5f5f5',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      padding: '2px 8px',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                    }}
                  >
                    {globalShortcutManager['formatKeyText'](config)}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div style={{ textAlign: 'right', marginTop: '24px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              background: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            关闭 (ESC)
          </button>
        </div>
      </div>
    </div>
  );
};

// 快捷键提示组件
export const ShortcutTooltip: React.FC<{
  shortcut: ShortcutConfig;
  children: React.ReactNode;
}> = ({ shortcut, children }) => {
  const keyText = globalShortcutManager['formatKeyText'](shortcut);
  
  return (
    <div
      title={`快捷键: ${keyText}`}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {children}
      <span
        style={{
          position: 'absolute',
          bottom: '-20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '11px',
          whiteSpace: 'nowrap',
          opacity: 0,
          transition: 'opacity 0.2s',
          pointerEvents: 'none',
        }}
        className="shortcut-tooltip"
      >
        {keyText}
      </span>
    </div>
  );
};

export default KeyboardShortcutManager;