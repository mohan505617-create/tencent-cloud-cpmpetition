interface OfflineAction {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  timestamp: number;
  data: any;
}

class OfflineManager {
  private static instance: OfflineManager;
  private pendingActions: OfflineAction[] = [];
  private isOnline: boolean = navigator.onLine;

  private constructor() {
    this.initializeOfflineSupport();
    this.loadPendingActions();
  }

  public static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager();
    }
    return OfflineManager.instance;
  }

  private initializeOfflineSupport() {
    // 注册Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // 监听网络状态变化
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncPendingActions();
      this.showNetworkStatus('已连接到网络');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.showNetworkStatus('离线模式 - 数据将在重新连接时同步');
    });
  }

  private showNetworkStatus(message: string) {
    // 显示网络状态通知
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('知识管理器', {
        body: message,
        icon: '/icon-192x192.png'
      });
    }
  }

  public addPendingAction(action: Omit<OfflineAction, 'id' | 'timestamp'>) {
    const pendingAction: OfflineAction = {
      ...action,
      id: Date.now().toString(),
      timestamp: Date.now()
    };

    this.pendingActions.push(pendingAction);
    this.savePendingActions();

    if (this.isOnline) {
      this.syncPendingActions();
    }
  }

  private savePendingActions() {
    localStorage.setItem('offline-pending-actions', JSON.stringify(this.pendingActions));
  }

  private loadPendingActions() {
    const saved = localStorage.getItem('offline-pending-actions');
    if (saved) {
      this.pendingActions = JSON.parse(saved);
    }
  }

  private async syncPendingActions() {
    if (!this.isOnline || this.pendingActions.length === 0) {
      return;
    }

    const actionsToSync = [...this.pendingActions];
    this.pendingActions = [];
    this.savePendingActions();

    try {
      // 这里可以实现与服务器的同步逻辑
      // 目前我们只是清除待处理的操作
      console.log('Syncing actions:', actionsToSync);
      
      // 模拟同步延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Actions synced successfully');
    } catch (error) {
      console.error('Sync failed:', error);
      // 如果同步失败，重新添加到待处理列表
      this.pendingActions.unshift(...actionsToSync);
      this.savePendingActions();
    }
  }

  public isOffline(): boolean {
    return !this.isOnline;
  }

  public getPendingActionsCount(): number {
    return this.pendingActions.length;
  }

  public requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted');
        }
      });
    }
  }

  // 缓存管理
  public async cacheNote(note: any) {
    if ('caches' in window) {
      const cache = await caches.open('notes-cache');
      const response = new Response(JSON.stringify(note));
      await cache.put(`/note/${note.id}`, response);
    }
  }

  public async getCachedNote(noteId: string) {
    if ('caches' in window) {
      const cache = await caches.open('notes-cache');
      const response = await cache.match(`/note/${noteId}`);
      if (response) {
        return await response.json();
      }
    }
    return null;
  }

  // 数据压缩和优化
  public compressData(data: any): string {
    // 简单的数据压缩（实际项目中可以使用更高效的压缩算法）
    return JSON.stringify(data);
  }

  public decompressData(compressedData: string): any {
    return JSON.parse(compressedData);
  }
}

export default OfflineManager;