import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Layout, App as AntApp, FloatButton, Alert, Card, Empty, message } from 'antd';
import { PlusOutlined, HomeOutlined, BulbOutlined, ShareAltOutlined, ReloadOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingSpinner, { PageLoading, DataSkeleton } from '../components/LoadingSpinner';
import Sidebar from '../components/Sidebar.tsx';
import Preview from '../components/Preview.tsx';
import SimpleKnowledgeGraph from '../components/SimpleKnowledgeGraph.tsx';
import AIRecommendations from '../components/AIRecommendations';
import QuickCapture from '../components/QuickCapture';
import { useApi, usePaginatedApi, useSearchApi } from '../hooks/useApi';
import { useDeviceType, useIsMobile, ResponsiveUtils } from '../utils/responsiveUtils';
import { KnowledgeAPI, OfflineDataManager } from '../services/apiService';
import { Note, BackLink } from '../types/index';
import '../styles/KnowledgeManager.css';

const { Content } = Layout;

const ImprovedKnowledgeManager: React.FC = () => {
  const location = useLocation();
  const deviceType = useDeviceType();
  const isMobile = useIsMobile();
  
  // 本地状态
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [backlinks, setBacklinks] = useState<BackLink[]>([]);
  const [showGraph, setShowGraph] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(isMobile);
  const [showQuickCapture, setShowQuickCapture] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // API Hooks
  const {
    data: notes = [],
    loading: notesLoading,
    error: notesError,
    refresh: refreshNotes
  } = usePaginatedApi<Note>(KnowledgeAPI.getNotes, {
    pageSize: isMobile ? 10 : 20
  });

  const {
    loading: createLoading,
    execute: createNote
  } = useApi(KnowledgeAPI.createNote, {
    onSuccess: (newNote) => {
      message.success('笔记创建成功！');
      refreshNotes();
      setActiveNote(newNote);
    },
    onError: (error) => {
      message.error(`创建失败: ${error.message}`);
      // 离线保存
      if (!isOnline) {
        const offlineNote = {
          id: `offline_${Date.now()}`,
          title: '新笔记',
          content: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: []
        };
        OfflineDataManager.saveData(`note_${offlineNote.id}`, offlineNote);
        message.info('已离线保存，将在网络恢复后同步');
      }
    }
  });

  const {
    loading: updateLoading,
    execute: updateNote
  } = useApi(KnowledgeAPI.updateNote, {
    onSuccess: () => {
      message.success('笔记更新成功！');
      refreshNotes();
    },
    onError: (error) => {
      message.error(`更新失败: ${error.message}`);
    }
  });

  const {
    loading: deleteLoading,
    execute: deleteNote
  } = useApi(KnowledgeAPI.deleteNote, {
    onSuccess: () => {
      message.success('笔记删除成功！');
      refreshNotes();
      setActiveNote(null);
    },
    onError: (error) => {
      message.error(`删除失败: ${error.message}`);
    }
  });

  // 搜索功能
  const {
    data: searchResults,
    loading: searchLoading,
    search,
    clearSearch,
    query: searchQuery
  } = useSearchApi<Note>(KnowledgeAPI.searchNotes);

  // 网络状态监听
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      message.success('网络已连接，正在同步数据...');
      OfflineDataManager.syncData();
      refreshNotes();
    };

    const handleOffline = () => {
      setIsOnline(false);
      message.warning('网络已断开，将在离线模式下工作');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [refreshNotes]);

  // 处理来自全局搜索的导航状态
  useEffect(() => {
    const state = location.state as any;
    if (state?.selectedNoteId && notes.length > 0) {
      const targetNote = (notes as Note[]).find((note: Note) => note.id === state.selectedNoteId);
      if (targetNote) {
        setActiveNote(targetNote);
        window.history.replaceState({}, '', location.pathname);
      }
    }
  }, [location.state, notes]);

  // 响应式布局配置
  const layoutConfig = useMemo(() => {
    return ResponsiveUtils.responsive(
      {
        mobile: {
          sidebarWidth: '100%',
          contentPadding: '8px',
          showSidebarOverlay: true
        },
        tablet: {
          sidebarWidth: '300px',
          contentPadding: '16px',
          showSidebarOverlay: false
        },
        desktop: {
          sidebarWidth: '350px',
          contentPadding: '24px',
          showSidebarOverlay: false
        }
      },
      window.innerWidth,
      {
        sidebarWidth: '300px',
        contentPadding: '16px',
        showSidebarOverlay: false
      }
    );
  }, [deviceType]);

  // 处理笔记操作
  const handleCreateNote = useCallback(async () => {
    try {
      await createNote({
        title: '新笔记',
        content: '',
        tags: []
      });
    } catch (error) {
      console.error('Create note error:', error);
    }
  }, [createNote]);

  const handleUpdateNote = useCallback(async (noteId: string, updates: Partial<Note>) => {
    try {
      await updateNote(noteId, updates);
    } catch (error) {
      console.error('Update note error:', error);
    }
  }, [updateNote]);

  const handleDeleteNote = useCallback(async (noteId: string) => {
    try {
      await deleteNote(noteId);
    } catch (error) {
      console.error('Delete note error:', error);
    }
  }, [deleteNote]);

  // 计算反向链接
  const computedBacklinks = useMemo(() => {
    if (!activeNote) return [];
    
    return (notes as Note[])
      .filter((note: Note) => 
        note.id !== activeNote.id && 
        note.content.includes(`[[${activeNote.title}]]`)
      )
      .map((note: Note) => ({
        fromNoteId: note.id,
        toNoteId: activeNote.id,
        fromTitle: note.title,
        toTitle: activeNote.title
      }));
  }, [activeNote, notes]);

  // 错误重试处理
  const handleRetry = useCallback(() => {
    refreshNotes();
  }, [refreshNotes]);

  // 渲染加载状态
  if (notesLoading && notes.length === 0) {
    return <PageLoading tip="正在加载知识库..." />;
  }

  // 渲染错误状态
  if (notesError && notes.length === 0) {
    return (
      <div style={{ 
        minHeight: '60vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '24px'
      }}>
        <Card style={{ maxWidth: '500px', textAlign: 'center' }}>
          <Alert
            message="加载失败"
            description={notesError.message}
            type="error"
            showIcon
            action={
              <FloatButton
                icon={<ReloadOutlined />}
                onClick={handleRetry}
                type="primary"
              />
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AntApp>
        <Layout style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
          {/* 网络状态提示 */}
          {!isOnline && (
            <Alert
              message="离线模式"
              description="当前处于离线状态，数据将在网络恢复后自动同步"
              type="warning"
              banner
              closable
            />
          )}

          {/* 侧边栏 */}
          <ErrorBoundary fallback={<DataSkeleton rows={5} avatar />}>
            <LoadingSpinner spinning={notesLoading} tip="加载笔记中...">
              <Sidebar
                notes={searchQuery ? (searchResults as Note[]) : (notes as Note[])}
                activeNote={activeNote}
                onNoteSelect={setActiveNote}
                onNoteCreate={handleCreateNote}
                onNoteUpdate={handleUpdateNote}
                onNoteDelete={handleDeleteNote}
                onSearch={search}
                onClearSearch={clearSearch}
                searchQuery={searchQuery}
                searchLoading={searchLoading}
                collapsed={sidebarCollapsed}
                onCollapse={setSidebarCollapsed}
                width={layoutConfig.sidebarWidth}
                overlay={layoutConfig.showSidebarOverlay}
                createLoading={createLoading}
                deviceType={deviceType}
              />
            </LoadingSpinner>
          </ErrorBoundary>

          {/* 主内容区 */}
          <Layout>
            <Content style={{ 
              padding: layoutConfig.contentPadding,
              marginLeft: sidebarCollapsed || isMobile ? 0 : layoutConfig.sidebarWidth,
              transition: 'margin-left 0.3s ease'
            }}>
              <ErrorBoundary>
                {activeNote ? (
                  <LoadingSpinner 
                    spinning={updateLoading || deleteLoading} 
                    tip="处理中..."
                    overlay
                  >
                    <Preview
                      note={activeNote}
                      backlinks={computedBacklinks}
                      onNoteUpdate={handleUpdateNote}
                      onNoteDelete={handleDeleteNote}
                      deviceType={deviceType}
                      readOnly={!isOnline}
                    />
                  </LoadingSpinner>
                ) : (
                  <div style={{ 
                    height: '60vh', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <Empty
                      description={
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {notes.length === 0 ? '暂无笔记，点击创建第一个笔记' : '选择一个笔记开始编辑'}
                        </span>
                      }
                    />
                  </div>
                )}
              </ErrorBoundary>
            </Content>
          </Layout>

          {/* 知识图谱 */}
          {showGraph && (
            <ErrorBoundary>
              <SimpleKnowledgeGraph
                notes={notes}
                activeNote={activeNote}
                onNoteSelect={setActiveNote}
                onClose={() => setShowGraph(false)}
                deviceType={deviceType}
              />
            </ErrorBoundary>
          )}

          {/* AI推荐 */}
          {showAI && (
            <ErrorBoundary>
              <AIRecommendations
                currentNote={activeNote}
                allNotes={notes}
                onClose={() => setShowAI(false)}
                deviceType={deviceType}
              />
            </ErrorBoundary>
          )}

          {/* 快速捕获 */}
          {showQuickCapture && (
            <ErrorBoundary>
              <QuickCapture
                onSave={handleCreateNote}
                onClose={() => setShowQuickCapture(false)}
                deviceType={deviceType}
              />
            </ErrorBoundary>
          )}

          {/* 浮动按钮组 */}
          <FloatButton.Group
            trigger="hover"
            type="primary"
            style={{ right: isMobile ? 16 : 24 }}
            icon={<PlusOutlined />}
          >
            <FloatButton
              icon={<PlusOutlined />}
              tooltip="新建笔记"
              onClick={handleCreateNote}
              loading={createLoading}
            />
            <FloatButton
              icon={<ShareAltOutlined />}
              tooltip="知识图谱"
              onClick={() => setShowGraph(true)}
            />
            <FloatButton
              icon={<BulbOutlined />}
              tooltip="AI推荐"
              onClick={() => setShowAI(true)}
            />
            <FloatButton
              icon={<HomeOutlined />}
              tooltip="快速捕获"
              onClick={() => setShowQuickCapture(true)}
            />
          </FloatButton.Group>
        </Layout>
      </AntApp>
    </ErrorBoundary>
  );
};

export default ImprovedKnowledgeManager;