import React, { useState, useEffect, useMemo } from 'react';
import { Layout, App as AntApp, FloatButton } from 'antd';
import { PlusOutlined, HomeOutlined, BulbOutlined, ShareAltOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar.tsx';
import Preview from '../components/Preview.tsx';
import SimpleKnowledgeGraph from '../components/SimpleKnowledgeGraph.tsx';
import AIRecommendations from '../components/AIRecommendations';
import QuickCapture from '../components/QuickCapture';
import { Note, BackLink } from '../types/index';
// 已移除多语言支持
import '../styles/KnowledgeManager.css';

const { Content } = Layout;

const KnowledgeManager: React.FC = () => {
  const location = useLocation();
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [backlinks, setBacklinks] = useState<BackLink[]>([]);
  const [showGraph, setShowGraph] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showQuickCapture, setShowQuickCapture] = useState(false);

  // 处理来自全局搜索的导航状态
  useEffect(() => {
    const state = location.state as any;
    if (state?.selectedNoteId && notes.length > 0) {
      const targetNote = notes.find(note => note.id === state.selectedNoteId);
      if (targetNote) {
        setActiveNote(targetNote);
        // 清除导航状态，避免重复触发
        window.history.replaceState({}, '', location.pathname);
      }
    }
  }, [location.state, notes]);

  // 初始化数据
  useEffect(() => {
    const savedNotes = localStorage.getItem('knowledge-notes');
    
    if (savedNotes) {
      try {
        const parsedNotes: Note[] = JSON.parse(savedNotes);
        const validNotes = parsedNotes.filter(note => 
          note && typeof note === 'object' && 
          typeof note.id === 'string' &&
          typeof note.title === 'string' &&
          typeof note.content === 'string'
        );
        setNotes(validNotes);
        setActiveNote(validNotes[0] || null);
      } catch (error) {
        console.error('Failed to parse saved notes:', error);
        initializeDefaultNotes();
      }
    } else {
      initializeDefaultNotes();
    }

    // 监听创建新笔记事件
    const handleCreateNewNote = () => {
      createNote();
    };

    window.addEventListener('createNewNote', handleCreateNewNote);
    
    return () => {
      window.removeEventListener('createNewNote', handleCreateNewNote);
    };
  }, []);

  const initializeDefaultNotes = () => {
    const defaultNotes: Note[] = [
      {
        id: '1',
        title: '欢迎使用知识管理系统',
        content: `# 欢迎使用知识管理系统

这是EduAI Hub的知识管理模块，帮助您：

## 主要功能

### 📝 笔记管理
- 创建、编辑和删除笔记
- 支持 Markdown 格式
- 实时预览功能

### 🔗 双向链接
使用 \`[[笔记标题]]\` 语法创建笔记间的链接

### 📊 知识图谱
可视化展示笔记间的关联关系

开始您的知识管理之旅吧！`,
        tags: ['欢迎', '指南'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    setNotes(defaultNotes);
    setActiveNote(defaultNotes[0]);
    localStorage.setItem('knowledge-notes', JSON.stringify(defaultNotes));
  };

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: '新笔记',
      content: '# 新笔记\n\n开始编写您的内容...',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    setActiveNote(newNote);
    localStorage.setItem('knowledge-notes', JSON.stringify(updatedNotes));
  };

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    
    if (activeNote?.id === noteId) {
      setActiveNote(null);
    }
    
    localStorage.setItem('knowledge-notes', JSON.stringify(updatedNotes));
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    const updatedNotes = notes.map(note => 
      note.id === id 
        ? { ...note, ...updates, updatedAt: new Date().toISOString() }
        : note
    );
    
    setNotes(updatedNotes);
    
    if (activeNote?.id === id) {
      setActiveNote({ ...activeNote, ...updates, updatedAt: new Date().toISOString() });
    }
    
    localStorage.setItem('knowledge-notes', JSON.stringify(updatedNotes));
  };

  const handleWikiLinkClick = (title: string) => {
    let targetNote = notes.find(note => note.title === title);
    
    if (!targetNote) {
      const newNote: Note = {
        id: Date.now().toString(),
        title: title,
        content: `# ${title}\n\n这是一个新创建的笔记。`,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      setActiveNote(newNote);
      localStorage.setItem('knowledge-notes', JSON.stringify(updatedNotes));
    } else {
      setActiveNote(targetNote);
    }
  };

  const handleQuickCapture = (noteData: { title: string; content: string; tags: string[] }) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: noteData.title || noteData.content.split('\n')[0].substring(0, 50) || '快速笔记',
      content: noteData.content,
      tags: noteData.tags.length > 0 ? noteData.tags : ['快速捕获'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    setActiveNote(newNote);
    localStorage.setItem('knowledge-notes', JSON.stringify(updatedNotes));
    setShowQuickCapture(false);
  };

  return (
    <AntApp>
      <div className="knowledge-manager-container fade-in">
        <div className="knowledge-content">
          <Sidebar
            notes={notes}
            activeNote={activeNote}
            onSelectNote={setActiveNote}
            onAddNote={createNote}
            onDeleteNote={deleteNote}
            collapsed={sidebarCollapsed}
            isMobile={false}
          />
          <div style={{ 
            position: 'relative',
            flex: 1,
            backgroundColor: '#f0f4f8'
          }}>
            {showGraph && (
              <div style={{ position: 'absolute', top: 0, right: 0, zIndex: 1000 }}>
                <SimpleKnowledgeGraph
                  notes={notes}
                  activeNote={activeNote}
                  onClose={() => setShowGraph(false)}
                />
              </div>
            )}
            <Preview
              note={activeNote}
              notes={notes}
              backlinks={[]}
              onUpdateNote={updateNote}
              onWikiLinkClick={handleWikiLinkClick}
            />
            {showAI && activeNote && (
              <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 1000 }}>
                <AIRecommendations
                  currentNote={activeNote}
                  allNotes={notes}
                  onNoteSelect={setActiveNote}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <FloatButton.Group
        trigger="hover"
        type="primary"
        style={{ right: 24, bottom: 24 }}
        icon={<PlusOutlined />}
      >
        <FloatButton
          icon={<PlusOutlined />}
          tooltip="快速记录"
          onClick={() => setShowQuickCapture(true)}
        />
        <FloatButton
          icon={<BulbOutlined />}
          tooltip="AI建议"
          onClick={() => setShowAI(!showAI)}
        />
        <FloatButton
          icon={<ShareAltOutlined />}
          tooltip="知识图谱"
          onClick={() => setShowGraph(!showGraph)}
        />
      </FloatButton.Group>

      <QuickCapture
        visible={showQuickCapture}
        onSave={handleQuickCapture}
        onClose={() => setShowQuickCapture(false)}
      />
    </AntApp>
  );
};

export default KnowledgeManager;