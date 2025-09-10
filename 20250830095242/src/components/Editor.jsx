import React, { useState, useEffect } from 'react';
import { Input, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title } = Typography;

const Editor = ({ note, onUpdateNote }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (note) {
      onUpdateNote(note.id, { title: newTitle });
    }
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (note) {
      onUpdateNote(note.id, { content: newContent });
    }
  };

  if (!note) {
    return (
      <div className="editor-empty">
        <EditOutlined className="empty-icon" />
        <Title level={4} className="empty-title">选择一个笔记开始编辑</Title>
        <p className="empty-description">
          从左侧选择一个笔记，或者创建一个新的笔记来开始编写。
        </p>
      </div>
    );
  }

  return (
    <div className="editor">
      <div className="editor-header">
        <Input
          value={title}
          onChange={handleTitleChange}
          placeholder="笔记标题..."
          className="title-input"
          variant="borderless"
        />
      </div>
      
      <div className="editor-body">
        <TextArea
          value={content}
          onChange={handleContentChange}
          placeholder="开始编写您的笔记... 支持 Markdown 语法"
          className="content-textarea"
          variant="borderless"
          autoSize={{ minRows: 20 }}
        />
      </div>
    </div>
  );
};

export default Editor;