import React, { useMemo } from 'react';
import { Card, List, Typography, Button, Tag } from 'antd';
import { CloseOutlined, BulbOutlined } from '@ant-design/icons';
import { Note } from '../types/index';

const { Title, Text } = Typography;

interface AIRecommendationsProps {
  currentNote: Note;
  allNotes: Note[];
  onNoteSelect: (note: Note) => void;
  onClose?: () => void;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  currentNote,
  allNotes = [],
  onNoteSelect,
  onClose
}) => {
  // 智能推荐算法
  const recommendations = useMemo(() => {
    if (!currentNote || !Array.isArray(allNotes)) return [];

    const safeNotes = allNotes.filter(note => 
      note && 
      note.id !== currentNote.id && 
      note.title && 
      note.content
    );

    // 基于标签的推荐
    const tagRecommendations = safeNotes.filter(note => {
      if (!currentNote.tags || !note.tags) return false;
      return currentNote.tags.some(tag => note.tags.includes(tag));
    });

    // 基于内容关键词的推荐
    const currentWords = currentNote.content.toLowerCase().split(/\s+/);
    const contentRecommendations = safeNotes.filter(note => {
      const noteWords = note.content.toLowerCase().split(/\s+/);
      const commonWords = currentWords.filter(word => 
        word.length > 3 && noteWords.includes(word)
      );
      return commonWords.length > 0;
    });

    // 基于标题相似性的推荐
    const titleRecommendations = safeNotes.filter(note => {
      const currentTitleWords = currentNote.title.toLowerCase().split(/\s+/);
      const noteTitleWords = note.title.toLowerCase().split(/\s+/);
      return currentTitleWords.some(word => 
        word.length > 2 && noteTitleWords.includes(word)
      );
    });

    // 合并并去重
    const allRecommendations = [
      ...tagRecommendations,
      ...contentRecommendations,
      ...titleRecommendations
    ];

    const uniqueRecommendations = allRecommendations.filter((note, index, self) =>
      index === self.findIndex(n => n.id === note.id)
    );

    return uniqueRecommendations.slice(0, 5); // 限制推荐数量
  }, [currentNote, allNotes]);

  const getRecommendationReason = (note: Note) => {
    if (!currentNote) return '相关推荐';
    
    // 检查标签匹配
    if (currentNote.tags && note.tags) {
      const commonTags = currentNote.tags.filter(tag => note.tags.includes(tag));
      if (commonTags.length > 0) {
        return `共同标签: ${commonTags.join(', ')}`;
      }
    }

    // 检查标题相似性
    const currentTitleWords = currentNote.title.toLowerCase().split(/\s+/);
    const noteTitleWords = note.title.toLowerCase().split(/\s+/);
    const commonTitleWords = currentTitleWords.filter(word => 
      word.length > 2 && noteTitleWords.includes(word)
    );
    if (commonTitleWords.length > 0) {
      return '标题相关';
    }

    return '内容相关';
  };

  return (
    <Card
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BulbOutlined style={{ color: '#faad14' }} />
            <Title level={4} style={{ margin: 0 }}>AI 推荐</Title>
          </div>
          {onClose && (
            <Button 
              type="text" 
              icon={<CloseOutlined />} 
              onClick={onClose}
              size="small"
            />
          )}
        </div>
      }
      style={{
        position: 'fixed',
        top: '80px',
        left: '20px',
        width: '350px',
        maxHeight: '500px',
        zIndex: 1000,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}
      styles={{
        body: { padding: '16px', maxHeight: '400px', overflow: 'auto' }
      }}
    >
      {recommendations.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px',
          color: '#999'
        }}>
          <BulbOutlined style={{ fontSize: '24px', marginBottom: '8px' }} />
          <div>暂无相关推荐</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            创建更多笔记后会有智能推荐
          </Text>
        </div>
      ) : (
        <List
          size="small"
          dataSource={recommendations}
          renderItem={(note) => (
            <List.Item
              style={{ 
                cursor: 'pointer',
                padding: '8px 0',
                borderBottom: '1px solid #f0f0f0'
              }}
              onClick={() => onNoteSelect(note)}
            >
              <div style={{ width: '100%' }}>
                <div style={{ 
                  fontWeight: 500,
                  marginBottom: '4px',
                  color: '#1890ff'
                }}>
                  {note.title}
                </div>
                <div style={{ 
                  fontSize: '12px',
                  color: '#666',
                  marginBottom: '4px'
                }}>
                  {note.content.substring(0, 60)}...
                </div>
                <Tag color="blue">
                  {getRecommendationReason(note)}
                </Tag>
              </div>
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default AIRecommendations;