import React, { useState, useEffect } from 'react';
import { Input, AutoComplete, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Note } from '../types/index';

export interface SearchResult {
  note: Note;
  matchType: 'title' | 'content' | 'tag';
  snippet?: string;
}

interface SearchBarProps {
  notes: Note[];
  onSelectNote: (note: Note) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  notes,
  onSelectNote
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    if (searchValue.trim()) {
      const results = performSearch(searchValue);
      const searchOptions = results.map((result, index) => ({
        key: index,
        value: result.note.title,
        label: (
          <div className="search-option" onClick={() => onSelectNote(result.note)}>
            <div className="font-medium">{result.note.title}</div>
            {result.snippet && (
              <div className="text-sm text-gray-500 truncate">{result.snippet}</div>
            )}
            <div className="flex gap-1 mt-1">
              <Tag color={getMatchTypeColor(result.matchType)}>
                {getMatchTypeLabel(result.matchType)}
              </Tag>
              {result.note.tags?.map(tag => (
                <Tag key={tag}>#{tag}</Tag>
              ))}
            </div>
          </div>
        )
      }));
      setOptions(searchOptions);
    } else {
      setOptions([]);
    }
  }, [searchValue, notes, onSelectNote]);

  const performSearch = (query: string): SearchResult[] => {
    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    notes.forEach(note => {
      // 标题匹配
      if (note.title.toLowerCase().includes(lowerQuery)) {
        results.push({
          note,
          matchType: 'title',
          snippet: note.content.substring(0, 100) + '...'
        });
      }
      // 内容匹配
      else if (note.content.toLowerCase().includes(lowerQuery)) {
        const index = note.content.toLowerCase().indexOf(lowerQuery);
        const start = Math.max(0, index - 50);
        const end = Math.min(note.content.length, index + 50);
        const snippet = '...' + note.content.substring(start, end) + '...';
        
        results.push({
          note,
          matchType: 'content',
          snippet
        });
      }
      // 标签匹配
      else if (note.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))) {
        results.push({
          note,
          matchType: 'tag',
          snippet: note.content.substring(0, 100) + '...'
        });
      }
    });

    return results.slice(0, 10); // 限制结果数量
  };

  const getMatchTypeColor = (type: string) => {
    switch (type) {
      case 'title': return 'blue';
      case 'content': return 'green';
      case 'tag': return 'orange';
      default: return 'default';
    }
  };

  const getMatchTypeLabel = (type: string) => {
    switch (type) {
      case 'title': return '标题';
      case 'content': return '内容';
      case 'tag': return '标签';
      default: return '匹配';
    }
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  return (
    <AutoComplete
      style={{ width: 300 }}
      options={options}
      onSearch={handleSearch}
      placeholder="搜索笔记..."
    >
      <Input
        prefix={<SearchOutlined />}
        placeholder="搜索笔记..."
        allowClear
      />
    </AutoComplete>
  );
};

export default SearchBar;