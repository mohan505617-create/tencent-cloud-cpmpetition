import React, { useState } from 'react';
import { Layout, Button, List, Typography, Input, Popconfirm, Space } from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  FileTextOutlined,
  MenuOutlined,
  CloseOutlined,
  DragOutlined
} from '@ant-design/icons';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const { Sider } = Layout;
const { Text } = Typography;
const { Search } = Input;

// 可拖拽的笔记项组件
const SortableNoteItem = ({ note, activeNote, onSelectNote, onDeleteNote, formatDate }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <List.Item
      ref={setNodeRef}
      style={style}
      className={`note-item ${activeNote?.id === note.id ? 'active' : ''} ${isDragging ? 'dragging' : ''}`}
      onClick={() => onSelectNote(note)}
    >
      <div className="note-item-content">
        <div className="note-header">
          <div className="note-drag-handle" {...attributes} {...listeners}>
            <DragOutlined />
          </div>
          <FileTextOutlined className="note-icon" />
          <Text strong className="note-title">
            {note.title}
          </Text>
          <Popconfirm
            title="确定要删除这个笔记吗？"
            onConfirm={(e) => {
              e.stopPropagation();
              onDeleteNote(note.id);
            }}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              size="small"
              className="delete-btn"
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        </div>
        
        <Text className="note-preview">
          {note.content.replace(/[#*`]/g, '').substring(0, 50)}...
        </Text>
        
        <Text className="note-date">
          {formatDate(note.updatedAt)}
        </Text>
      </div>
    </List.Item>
  );
};

const Sidebar = ({ notes, activeNote, onSelectNote, onAddNote, onDeleteNote, onReorderNotes, isMobile }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsed, setCollapsed] = useState(isMobile);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredNotes = notes.filter(note => {
    if (!note || typeof note !== 'object') return false;
    const title = note.title || '';
    const content = note.content || '';
    const query = searchQuery.toLowerCase();
    
    return title.toLowerCase().includes(query) || 
           content.toLowerCase().includes(query);
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = notes.findIndex(note => note.id === active.id);
      const newIndex = notes.findIndex(note => note.id === over.id);
      
      if (onReorderNotes) {
        onReorderNotes(oldIndex, newIndex);
      }
    }
  };

  return (
    <>
      {isMobile && (
        <Button
          className="mobile-menu-toggle"
          icon={collapsed ? <MenuOutlined /> : <CloseOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          type="primary"
        />
      )}
      
      <Sider
        width={300}
        className={`sidebar ${isMobile ? 'mobile-sidebar' : ''}`}
        collapsed={isMobile ? collapsed : false}
        collapsedWidth={isMobile ? 0 : 80}
        trigger={null}
      >
        <div className="sidebar-content">
          <div className="sidebar-header">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onAddNote}
              className="add-note-btn"
              block
            >
              新建笔记
            </Button>
            
            <Search
              placeholder="搜索笔记..."
              allowClear
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              prefix={<SearchOutlined />}
            />
          </div>
          
          <div className="notes-list">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredNotes.map(note => note.id)}
                strategy={verticalListSortingStrategy}
              >
                <List
                  dataSource={filteredNotes}
                  renderItem={(note) => (
                    <SortableNoteItem
                      key={note.id}
                      note={note}
                      activeNote={activeNote}
                      onSelectNote={onSelectNote}
                      onDeleteNote={onDeleteNote}
                      formatDate={formatDate}
                    />
                  )}
                />
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </Sider>
    </>
  );
};

export default Sidebar;