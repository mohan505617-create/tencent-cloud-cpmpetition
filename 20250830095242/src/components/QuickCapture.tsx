import React, { useState, useEffect } from 'react'
import { Modal, Input, Button, Tag, message } from 'antd'
import { SaveOutlined, PlusOutlined } from '@ant-design/icons'

const { TextArea } = Input

interface QuickCaptureProps {
  visible: boolean;
  onClose: () => void;
  onSave: (noteData: { title: string; content: string; tags: string[] }) => void;
}

const QuickCapture: React.FC<QuickCaptureProps> = ({ visible, onClose, onSave }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    if (visible) {
      // 重置表单
      setTitle('')
      setContent('')
      setSelectedTags([])
      setNewTag('')
    }
  }, [visible])

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      message.warning('请填写标题和内容')
      return
    }

    onSave({
      title: title.trim(),
      content: content.trim(),
      tags: selectedTags
    })

    message.success('笔记保存成功！')
  }

  const handleAddTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      setSelectedTags([...selectedTags, newTag.trim()])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove))
  }

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PlusOutlined style={{ color: '#007bff' }} />
          <span style={{ color: '#333333' }}>快速记录</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button
          key="save"
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSave}
        >
          保存
        </Button>
      ]}
      width={600}
      style={{
        backgroundColor: '#ffffff'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* 标题输入 */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: 500, 
            color: '#333333', 
            marginBottom: '8px' 
          }}>
            标题
          </label>
          <Input
            placeholder="输入笔记标题..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            size="large"
            autoFocus
            style={{
              backgroundColor: '#ffffff',
              color: '#333333',
              borderColor: '#e0e6ed'
            }}
          />
        </div>

        {/* 内容输入 */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: 500, 
            color: '#333333', 
            marginBottom: '8px' 
          }}>
            内容
          </label>
          <TextArea
            placeholder="记录你的想法..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            size="large"
            style={{
              backgroundColor: '#ffffff',
              color: '#333333',
              borderColor: '#e0e6ed'
            }}
          />
        </div>

        {/* 标签管理 */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: 500, 
            color: '#333333', 
            marginBottom: '8px' 
          }}>
            标签
          </label>
          
          {/* 已选标签 */}
          <div style={{ marginBottom: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {selectedTags.map(tag => (
              <Tag
                key={tag}
                closable
                onClose={() => handleRemoveTag(tag)}
                color="blue"
              >
                {tag}
              </Tag>
            ))}
          </div>

          {/* 添加新标签 */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <Input
              placeholder="添加标签..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onPressEnter={handleAddTag}
              style={{
                flex: 1,
                backgroundColor: '#ffffff',
                color: '#333333',
                borderColor: '#e0e6ed'
              }}
            />
            <Button onClick={handleAddTag} disabled={!newTag.trim()}>
              添加
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default QuickCapture