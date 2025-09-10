import React, { useState } from 'react';
import { 
  Layout, 
  Button, 
  Input, 
  Space, 
  Dropdown, 
  Tag, 
  Tooltip,
  Modal
} from 'antd';
import {
  PlusOutlined,
  MoreOutlined,
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  TagOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Note } from '../types/index';

const { Sider } = Layout;
const { Search } = Input;

interface SidebarProps {
  notes: Note[];
  activeNote: Note | null;
  onSelectNote: (note: Note) => void;
  onAddNote: () => void;
  onDeleteNote: (id: string) => void;

  isMobile: boolean;
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  notes,
  activeNote,
  onSelectNote,
  onAddNote,
  onDeleteNote,
  isMobile,
  collapsed
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 过滤笔记
  const filteredNotes = notes.filter(note => {
    const matchesSearch = !searchTerm || 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 ||
      selectedTags.every(tag => note.tags?.includes(tag));

    return matchesSearch && matchesTags;
  });

  // 获取所有标签
  const allTags = Array.from(
    new Set(notes.flatMap(note => note.tags || []))
  ).sort();

  // 处理笔记删除
  const handleDeleteNote = (noteId: string, noteTitle: string) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除笔记 "${noteTitle}" 吗？此操作不可恢复。`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        onDeleteNote(noteId);
        console.log('笔记已删除');
      }
    });
  };

  // 笔记操作菜单
  const getNoteActionMenu = (note: Note): MenuProps => ({
    items: [
      {
        key: 'edit',
        icon: <EditOutlined />,
        label: '编辑',
        onClick: () => onSelectNote(note)
      },
      {
        key: 'delete',
        icon: <DeleteOutlined />,
        label: '删除',
        danger: true,
        onClick: () => handleDeleteNote(note.id, note.title)
      }
    ]
  });

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return '今天';
    } else if (diffDays === 1) {
      return '昨天';
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // 获取笔记预览文本
  const getNotePreview = (content: string) => {
    return content
      .replace(/#+\s/g, '') // 移除markdown标题符号
      .replace(/\*\*([^*]+)\*\*/g, '$1') // 移除粗体标记
      .replace(/\*([^*]+)\*/g, '$1') // 移除斜体标记
      .replace(/\[\[([^\]]+)\]\]/g, '$1') // 移除wiki链接标记
      .substring(0, 100) + (content.length > 100 ? '...' : '');
  };

  return (
    <Sider
      width={280}
      collapsed={collapsed}
      collapsedWidth={isMobile ? 0 : 80}
      className="bg-white dark:bg-dark-bg-primary border-r border-gray-200 dark:border-dark-border-primary shadow-lg dark:shadow-xl"
      style={{
        position: isMobile ? 'fixed' : 'relative',
        height: '100vh',
        zIndex: isMobile ? 1000 : 'auto',
        left: collapsed && isMobile ? -280 : 0,
        transition: 'left 0.3s ease',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div className="p-5 border-b border-gray-200 dark:border-dark-border-primary bg-white dark:bg-dark-bg-primary">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAddNote}
          block
          size="large"
          className="fade-in"
          style={{
            height: '44px',
            borderRadius: '8px',
            fontWeight: 500
          }}
        >
          {collapsed ? '' : '新建笔记'}
        </Button>
      </div>

      {!collapsed && (
        <>
          <div className="p-4 border-b border-gray-200 dark:border-dark-border-primary bg-white dark:bg-dark-bg-primary">
            <Search
              placeholder="搜索笔记..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
            />
          </div>

          {/* 标签过滤 */}
          {allTags.length > 0 && (
            <div className="p-5 border-b border-gray-200 dark:border-dark-border-primary bg-white dark:bg-dark-bg-primary">
              <div className="flex items-center gap-2 mb-3 font-medium text-gray-800 dark:text-dark-text-primary">
                <TagOutlined /> 标签过滤
              </div>
              <div 
                className="stagger-fade-in"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginBottom: '12px'
                }}
              >
                {allTags.map(tag => (
                  <Tag.CheckableTag
                    key={tag}
                    checked={selectedTags.includes(tag)}
                    className="hover-lift"
                    onChange={(checked) => {
                      if (checked) {
                        setSelectedTags([...selectedTags, tag]);
                      } else {
                        setSelectedTags(selectedTags.filter(t => t !== tag));
                      }
                    }}
                  >
                    #{tag}
                  </Tag.CheckableTag>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <Button
                  type="link"
                  size="small"
                  onClick={() => setSelectedTags([])}
                >
                  清除过滤
                </Button>
              )}
            </div>
          )}
        </>
      )}

      <div 
        className="note-list-container flex-1 overflow-y-auto overflow-x-hidden p-2 bg-white dark:bg-dark-bg-primary"
        style={{
          height: 'calc(100vh - 350px)', // 增加更多空间，确保底部内容可见
          minHeight: '300px', // 调整最小高度
          maxHeight: 'calc(100vh - 350px)', // 添加最大高度限制
          scrollBehavior: 'smooth', // 平滑滚动
          WebkitOverflowScrolling: 'touch', // iOS 滚动优化
          // 自定义滚动条样式
          scrollbarWidth: 'thin',
          scrollbarColor: '#007bff #f8f9fa'
        }}
      >
        {filteredNotes.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px',
            color: '#999999',
            textAlign: 'center'
          }}>
            {collapsed ? (
              <FileTextOutlined style={{ fontSize: 24, color: '#ccc' }} />
            ) : (
              <div>
                <FileTextOutlined style={{ fontSize: 48, color: '#ccc' }} />
                <p>暂无笔记</p>
                <Button type="link" onClick={onAddNote}>
                  创建第一个笔记
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ paddingBottom: '20px' }} className="stagger-fade-in">
            {filteredNotes.map((note, index) => (
            <div
              key={`note-${note.id}-${index}`}
              className={`note-item p-3 mb-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                activeNote?.id === note.id 
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400 shadow-md dark:shadow-lg' 
                  : 'bg-white dark:bg-dark-bg-secondary border-gray-200 dark:border-dark-border-primary shadow-sm hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary hover:border-green-500 dark:hover:border-green-400'
              }`}
              onClick={() => onSelectNote(note)}
              style={{
                minHeight: '120px', // 确保每个笔记项有足够的高度
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              {collapsed ? (
                <Tooltip title={note.title} placement="right">
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '40px',
                    color: '#333333'
                  }}>
                    <FileTextOutlined />
                  </div>
                </Tooltip>
              ) : (
                <>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '8px'
                    }}>
                      <h4 className="m-0 text-sm font-medium text-gray-800 dark:text-dark-text-primary leading-relaxed flex-1 mr-2">
                        {note.title}
                      </h4>
                      <Dropdown
                        menu={getNoteActionMenu(note)}
                        trigger={['click']}
                        placement="bottomRight"
                      >
                        <Button
                          type="text"
                          icon={<MoreOutlined />}
                          size="small"
                          style={{
                            opacity: 0,
                            transition: 'opacity 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = '1';
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Dropdown>
                    </div>
                    
                    <p className="m-0 mb-3 text-xs text-gray-600 dark:text-dark-text-secondary leading-relaxed line-clamp-2 overflow-hidden">
                      {getNotePreview(note.content)}
                    </p>
                  </div>
                  
                  <div style={{ 
                    marginTop: 'auto',
                    paddingTop: '8px'
                  }}>
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-dark-text-secondary mb-2">
                      <Space size="small">
                        <CalendarOutlined />
                        <span>{formatDate(note.updatedAt)}</span>
                      </Space>
                    </div>
                    
                    {note.tags && note.tags.length > 0 && (
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '4px',
                        marginTop: '4px'
                      }}>
                        {note.tags.slice(0, 3).map(tag => (
                          <Tag key={tag} color="blue" size="small">
                            #{tag}
                          </Tag>
                        ))}
                        {note.tags.length > 3 && (
                          <Tag size="small">+{note.tags.length - 3}</Tag>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            ))}
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-dark-border-primary text-center bg-gray-50 dark:bg-dark-bg-secondary">
          <div className="text-xs text-gray-600 dark:text-dark-text-secondary">
            共 {notes.length} 个笔记
          </div>
        </div>
      )}
    </Sider>
  );
};

export default Sidebar;