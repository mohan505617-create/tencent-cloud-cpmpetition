import React, { useState, useMemo } from 'react';
import { Card, Tag, Space, Input, Button, Divider } from 'antd';
import { TagOutlined, ClearOutlined } from '@ant-design/icons';
import { Note } from '../types';

interface TagManagerProps {
  notes: Note[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  onFilteredNotesChange: (notes: Note[]) => void;
}

const TagManager: React.FC<TagManagerProps> = ({ 
  notes, 
  selectedTags, 
  onTagsChange,
  onFilteredNotesChange 
}) => {
  const [searchTag, setSearchTag] = useState('');

  // 提取所有标签
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach(note => {
      // 从内容中提取 #标签
      const contentTags = extractTagsFromContent(note.content);
      contentTags.forEach(tag => tagSet.add(tag));
      
      // 从note.tags中提取
      note.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [notes]);

  // 从内容中提取标签
  const extractTagsFromContent = (content: string): string[] => {
    const tagRegex = /#(\w+)/g;
    const matches = content.match(tagRegex);
    return matches ? matches.map(match => match.slice(1)) : [];
  };

  // 获取标签使用次数
  const getTagCount = (tag: string): number => {
    return notes.filter(note => {
      const contentTags = extractTagsFromContent(note.content);
      const noteTags = note.tags || [];
      return contentTags.includes(tag) || noteTags.includes(tag);
    }).length;
  };

  // 过滤标签
  const filteredTags = useMemo(() => {
    return allTags.filter(tag => 
      tag.toLowerCase().includes(searchTag.toLowerCase())
    );
  }, [allTags, searchTag]);

  // 根据选中的标签过滤笔记
  const filteredNotes = useMemo(() => {
    if (selectedTags.length === 0) return notes;
    
    return notes.filter(note => {
      const contentTags = extractTagsFromContent(note.content);
      const noteTags = note.tags || [];
      const allNoteTags = [...contentTags, ...noteTags];
      
      return selectedTags.every(selectedTag => 
        allNoteTags.includes(selectedTag)
      );
    });
  }, [notes, selectedTags]);

  // 更新过滤后的笔记
  React.useEffect(() => {
    onFilteredNotesChange(filteredNotes);
  }, [filteredNotes, onFilteredNotesChange]);

  const handleTagClick = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    onTagsChange(newSelectedTags);
  };

  const clearAllTags = () => {
    onTagsChange([]);
  };

  return (
    <Card 
      title={
        <Space>
          <TagOutlined />
          标签管理
          {selectedTags.length > 0 && (
            <Tag color="blue">{filteredNotes.length} 个匹配笔记</Tag>
          )}
        </Space>
      }
      size="small"
      extra={
        selectedTags.length > 0 && (
          <Button 
            size="small" 
            icon={<ClearOutlined />} 
            onClick={clearAllTags}
          >
            清除筛选
          </Button>
        )
      }
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input
          placeholder="搜索标签..."
          value={searchTag}
          onChange={(e) => setSearchTag(e.target.value)}
          size="small"
        />
        
        {selectedTags.length > 0 && (
          <>
            <div style={{ fontSize: '12px', color: '#666' }}>已选择的标签：</div>
            <div>
              {selectedTags.map(tag => (
                <Tag
                  key={tag}
                  color="blue"
                  closable
                  onClose={() => handleTagClick(tag)}
                  style={{ marginBottom: '4px' }}
                >
                  #{tag}
                </Tag>
              ))}
            </div>
            <Divider style={{ margin: '8px 0' }} />
          </>
        )}
        
        <div style={{ fontSize: '12px', color: '#666' }}>
          所有标签 ({filteredTags.length}):
        </div>
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {filteredTags.map(tag => (
            <Tag
              key={tag}
              color={selectedTags.includes(tag) ? 'blue' : 'default'}
              onClick={() => handleTagClick(tag)}
              style={{ 
                cursor: 'pointer', 
                marginBottom: '4px',
                opacity: selectedTags.includes(tag) ? 1 : 0.7
              }}
            >
              #{tag} ({getTagCount(tag)})
            </Tag>
          ))}
        </div>
      </Space>
    </Card>
  );
};

export default TagManager;