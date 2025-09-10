import React, { useState } from 'react';
import { Button, Modal, Card, Space, Tag } from 'antd';
import { BulbOutlined, ReloadOutlined } from '@ant-design/icons';
import { Note } from '../types/index';

interface InspirationSuggestion {
  type: 'connection' | 'question' | 'idea';
  title: string;
  description: string;
  relatedNotes?: Note[];
}

interface InspireButtonProps {
  notes: Note[];
  onSelectNote: (note: Note) => void;
}

const InspireButton: React.FC<InspireButtonProps> = ({
  notes,
  onSelectNote
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [suggestions, setSuggestions] = useState<InspirationSuggestion[]>([]);

  const generateSuggestions = (): InspirationSuggestion[] => {
    const newSuggestions: InspirationSuggestion[] = [];
    
    if (notes.length === 0) {
      return [{
        type: 'idea',
        title: '开始您的知识之旅',
        description: '创建您的第一个笔记，记录一个有趣的想法或学到的知识。',
      }];
    }

    // 连接建议
    if (notes.length >= 2) {
      const randomNotes = notes.sort(() => 0.5 - Math.random()).slice(0, 2);
      newSuggestions.push({
        type: 'connection',
        title: `连接 "${randomNotes[0].title}" 和 "${randomNotes[1].title}"`,
        description: '这两个笔记之间可能存在有趣的联系，尝试找出它们的共同点或互补之处。',
        relatedNotes: randomNotes
      });
    }

    // 问题建议
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    const questions = [
      `如果将 "${randomNote.title}" 应用到不同的领域会怎样？`,
      `"${randomNote.title}" 的反面观点是什么？`,
      `如何改进或扩展 "${randomNote.title}" 中的想法？`,
      `"${randomNote.title}" 与当前趋势有什么关系？`
    ];
    
    newSuggestions.push({
      type: 'question',
      title: '思考问题',
      description: questions[Math.floor(Math.random() * questions.length)],
      relatedNotes: [randomNote]
    });

    // 创意建议
    const ideaPrompts = [
      '记录今天学到的一个新概念',
      '写下一个未解决的问题',
      '总结最近的一次经历',
      '列出想要学习的技能',
      '描述一个理想的项目',
      '记录一个有趣的观察'
    ];
    
    newSuggestions.push({
      type: 'idea',
      title: '新想法',
      description: ideaPrompts[Math.floor(Math.random() * ideaPrompts.length)]
    });

    return newSuggestions;
  };

  const handleInspire = () => {
    const newSuggestions = generateSuggestions();
    setSuggestions(newSuggestions);
    setIsModalVisible(true);
  };

  const handleRefresh = () => {
    const newSuggestions = generateSuggestions();
    setSuggestions(newSuggestions);
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'connection': return '🔗';
      case 'question': return '❓';
      case 'idea': return '💡';
      default: return '✨';
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'connection': return '#1890ff';
      case 'question': return '#52c41a';
      case 'idea': return '#faad14';
      default: return '#d9d9d9';
    }
  };

  return (
    <>
      <Button
        type="primary"
        icon={<BulbOutlined />}
        onClick={handleInspire}
        className="bg-gradient-to-r from-purple-500 to-pink-500 border-0 hover:from-purple-600 hover:to-pink-600"
      >
        启发我
      </Button>

      <Modal
        title={
          <div className="flex items-center justify-between">
            <span>💡 创意启发</span>
            <Button
              type="text"
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              size="small"
            >
              刷新建议
            </Button>
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {suggestions.map((suggestion, index) => (
            <Card
              key={index}
              size="small"
              className="hover:shadow-md transition-shadow cursor-pointer"
              style={{ borderColor: getSuggestionColor(suggestion.type) }}
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{getSuggestionIcon(suggestion.type)}</span>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 mb-2">
                    {suggestion.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-3">
                    {suggestion.description}
                  </p>
                  {suggestion.relatedNotes && (
                    <div className="flex flex-wrap gap-1">
                      {suggestion.relatedNotes.map(note => (
                        <Tag
                          key={note.id}
                          color="blue"
                          className="cursor-pointer"
                          onClick={() => {
                            onSelectNote(note);
                            setIsModalVisible(false);
                          }}
                        >
                          {note.title}
                        </Tag>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </Space>
      </Modal>
    </>
  );
};

export default InspireButton;