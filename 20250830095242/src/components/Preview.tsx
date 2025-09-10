import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Space, Tag, Typography, Divider } from 'antd';
import { EditOutlined, SaveOutlined, PlusOutlined, CalendarOutlined, FileTextOutlined } from '@ant-design/icons';
import { Note, BackLink } from '../types/index';
import '../styles/KnowledgeManager.css';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface PreviewProps {
  note: Note | null;
  notes: Note[];
  backlinks: BackLink[];
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onWikiLinkClick: (title: string) => void;
}

const Preview: React.FC<PreviewProps> = ({
  note,
  notes,
  backlinks,
  onUpdateNote,
  onWikiLinkClick
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);

  useEffect(() => {
    if (note) {
      setEditTitle(note.title);
      setEditContent(note.content);
      setEditTags(note.tags || []);
    }
  }, [note]);

  const handleSave = () => {
    if (note) {
      onUpdateNote(note.id, {
        title: editTitle,
        content: editContent,
        tags: editTags
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (note) {
      setEditTitle(note.title);
      setEditContent(note.content);
      setEditTags(note.tags || []);
      setIsEditing(false);
    }
  };

  const renderContent = (content: string) => {
    // 简单的Markdown渲染和Wiki链接处理
    let rendered = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/\n/g, '<br/>');

    // 处理Wiki链接
    rendered = rendered.replace(/\[\[([^\]]+)\]\]/g, (_, title) => {
      return `<span class="wiki-link" onclick="handleWikiClick('${title}')" style="color: #1890ff; cursor: pointer; text-decoration: underline;">${title}</span>`;
    });

    return rendered;
  };

  // 全局函数处理Wiki链接点击
  useEffect(() => {
    (window as any).handleWikiClick = (title: string) => {
      onWikiLinkClick(title);
    };
    return () => {
      delete (window as any).handleWikiClick;
    };
  }, [onWikiLinkClick]);

  if (!note) {
    return (
      <div className="preview-container">
        <div className="preview-empty">
          <FileTextOutlined className="preview-empty-icon" />
          <div className="preview-empty-title">欢迎使用知识管理器</div>
          <div className="preview-empty-description">
            选择左侧的笔记开始阅读，或创建新的笔记来记录您的想法和知识
          </div>
          <div className="preview-empty-actions">
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              size="large"
              onClick={() => {
                // 触发创建新笔记的逻辑
                const event = new CustomEvent('createNewNote');
                window.dispatchEvent(event);
              }}
            >
              创建新笔记
            </Button>
          </div>
        </div>
        
        {/* 底部模块 */}
        <div className="bottom-modules">
          <Card className="new-note-card" onClick={() => {
            const event = new CustomEvent('createNewNote');
            window.dispatchEvent(event);
          }}>
            <PlusOutlined className="new-note-card-icon" />
            <div className="new-note-card-title">新建笔记</div>
            <div className="new-note-card-description">开始撰写笔记内容……</div>
          </Card>
          
          <Card className="today-card">
            <div className="today-card-header">
              <CalendarOutlined className="today-card-icon" />
              <div className="today-card-title">今日</div>
            </div>
            <div className="today-card-content">
              {new Date().toLocaleDateString('zh-CN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })}
              <br />
              开始您今天的知识记录之旅
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-container" style={{ 
      height: '100%', 
      padding: '16px',
      backgroundColor: 'var(--bg-secondary)'
    }}>
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {isEditing ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold',
                  backgroundColor: 'var(--bg-color)',
                  color: 'var(--text-color)',
                  borderColor: 'var(--border-color)'
                }}
              />
            ) : (
              <Title level={3} style={{ 
                margin: 0,
                color: 'var(--text-color)'
              }}>{note.title}</Title>
            )}
            <Space>
              {isEditing ? (
                <>
                  <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                    保存
                  </Button>
                  <Button onClick={handleCancel}>取消</Button>
                </>
              ) : (
                <Button type="primary" icon={<EditOutlined />} onClick={() => setIsEditing(true)}>
                  编辑
                </Button>
              )}
            </Space>
          </div>
        }
        style={{ 
          height: '100%',
          backgroundColor: 'var(--bg-color)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid var(--border-color)'
        }}
        bodyStyle={{ 
          height: 'calc(100% - 80px)', 
          overflow: 'auto',
          backgroundColor: 'var(--bg-color)',
          color: 'var(--text-color)'
        }}
      >
        {/* 标签显示 */}
        {(isEditing ? editTags : note.tags)?.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <Space wrap>
              {(isEditing ? editTags : note.tags).map((tag, index) => (
                <Tag key={index} color="blue">#{tag}</Tag>
              ))}
            </Space>
          </div>
        )}

        {/* 内容区域 */}
        {isEditing ? (
          <div>
            <TextArea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={20}
              placeholder="开始编写您的笔记内容..."
              style={{ 
                marginBottom: '16px',
                backgroundColor: 'var(--bg-color)',
                color: 'var(--text-color)',
                borderColor: 'var(--border-color)'
              }}
            />
            <Input
              placeholder="添加标签，用逗号分隔"
              value={editTags.join(', ')}
              onChange={(e) => setEditTags(e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
              style={{
                backgroundColor: 'var(--bg-color)',
                color: 'var(--text-color)',
                borderColor: 'var(--border-color)'
              }}
            />
          </div>
        ) : (
          <div 
            className="note-content"
            dangerouslySetInnerHTML={{ __html: renderContent(note.content) }}
            style={{ 
              lineHeight: '1.8',
              fontSize: '14px',
              minHeight: '300px',
              color: 'var(--text-color)'
            }}
          />
        )}

        {/* 反向链接 */}
        {!isEditing && backlinks.length > 0 && (
          <>
            <Divider />
            <div>
              <Title level={5}>反向链接</Title>
              <Space direction="vertical">
                {backlinks.map((link, index) => (
                  <Button
                    key={index}
                    type="link"
                    onClick={() => {
                      const linkedNote = notes.find(n => n.id === link.fromNoteId);
                      if (linkedNote) {
                        onWikiLinkClick(linkedNote.title);
                      }
                    }}
                  >
                    ← {link.fromTitle}
                  </Button>
                ))}
              </Space>
            </div>
          </>
        )}

        {/* 元数据 */}
        {!isEditing && (
          <div style={{ 
            marginTop: '24px', 
            padding: '12px', 
            background: 'var(--bg-secondary)', 
            borderRadius: '6px',
            border: '1px solid var(--border-color)'
          }}>
            <Text type="secondary" style={{ 
              fontSize: '12px',
              color: 'var(--text-secondary)'
            }}>
              创建时间: {new Date(note.createdAt).toLocaleString('zh-CN')} | 
              更新时间: {new Date(note.updatedAt).toLocaleString('zh-CN')}
            </Text>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Preview;