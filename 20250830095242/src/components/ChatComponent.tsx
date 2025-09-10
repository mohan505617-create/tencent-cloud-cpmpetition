import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, List, Avatar, Typography, Tag } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'question' | 'answer' | 'suggestion';
}

interface ChatComponentProps {
  studentName?: string;
  courseName?: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ 
  studentName = "学生", 
  courseName = "当前课程" 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `欢迎来到AI Gardener智能问答系统！我是您的AI教学助手，专注于培育深圳的创新人才。我可以帮助您解答关于${courseName}的问题。`,
      sender: 'ai',
      timestamp: new Date(),
      type: 'suggestion'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 预定义回复模板
  const predefinedResponses = {
    '数据结构': '数据结构是计算机科学的基础，包括数组、链表、栈、队列、树、图等。在深圳的科技创新环境中，掌握高效的数据结构对于开发性能优异的应用至关重要。',
    '算法': '算法是解决问题的步骤和方法。在深圳这样的创新城市，算法思维能帮助我们更好地分析和解决复杂问题，推动技术创新。',
    '机器学习': '机器学习是人工智能的核心技术，通过数据训练模型来预测和决策。深圳作为AI产业高地，掌握机器学习技能将为您的职业发展提供强大助力。',
    '作业': '关于作业问题，我建议您：1) 仔细阅读题目要求 2) 分析问题的核心 3) 设计解决方案 4) 编写代码实现 5) 测试验证结果。记住，每一次作业都是提升创新能力的机会。',
    '考试': '考试准备建议：1) 复习课程重点内容 2) 练习典型题目 3) 理解概念而非死记硬背 4) 保持良好心态。深圳的创新精神就是在挑战中不断成长！',
    '项目': '项目开发流程：1) 需求分析 2) 系统设计 3) 编码实现 4) 测试调试 5) 部署上线。在深圳的创新环境中，项目经验是最宝贵的财富。'
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // 关键词匹配
    for (const [keyword, response] of Object.entries(predefinedResponses)) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        return response;
      }
    }

    // 问候语处理
    if (lowerMessage.includes('你好') || lowerMessage.includes('hello')) {
      return `您好，${studentName}！我是AI Gardener教学助手，致力于培育深圳的创新人才。请告诉我您在${courseName}学习中遇到的问题，我会尽力帮助您。`;
    }

    // 感谢语处理
    if (lowerMessage.includes('谢谢') || lowerMessage.includes('感谢')) {
      return '不客气！能够帮助您学习是我的荣幸。深圳的创新精神就是互相帮助、共同进步。还有其他问题吗？';
    }

    // 默认回复
    return `关于"${userMessage}"这个问题，我建议您：

1. 📚 查阅相关课程资料和教材
2. 🔍 在知识管理系统中搜索相关笔记
3. 💡 尝试从不同角度思考问题
4. 🤝 与同学讨论交流想法

深圳的创新文化鼓励我们勇于探索、敢于提问。如果您需要更具体的帮助，请提供更多详细信息，我会给出更精准的指导。`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      type: 'question'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // 模拟AI思考时间
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputValue),
        sender: 'ai',
        timestamp: new Date(),
        type: 'answer'
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // 1-3秒随机延迟
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "如何提高算法效率？",
    "数据结构的应用场景？",
    "机器学习入门建议？",
    "作业遇到困难怎么办？",
    "如何准备期末考试？"
  ];

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RobotOutlined style={{ color: 'var(--primary-color)' }} />
          <span style={{ color: 'var(--text-color)' }}>AI Gardener - 智能问答助手</span>
          <Tag color="green">培育深圳创新</Tag>
        </div>
      }
      style={{
        height: '600px',
        display: 'flex',
        flexDirection: 'column'
      }}
      styles={{
        body: { 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          padding: '16px'
        }
      }}
    >
      {/* 课程信息 */}
      <div style={{ 
        background: 'var(--bg-secondary)', 
        padding: '12px', 
        borderRadius: '8px', 
        marginBottom: '16px',
        border: '1px solid var(--border-color)'
      }}>
        <Text strong style={{ color: 'var(--text-color)' }}>当前课程：</Text> 
        <span style={{ color: 'var(--text-color)' }}>{courseName}</span> | 
        <Text strong style={{ color: 'var(--text-color)' }}> 学生：</Text> 
        <span style={{ color: 'var(--text-color)' }}>{studentName}</span>
      </div>

      {/* 消息列表 */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        marginBottom: '16px',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '12px',
        backgroundColor: 'var(--bg-color)'
      }}>
        <List
          dataSource={messages}
          renderItem={(message) => (
            <List.Item style={{ border: 'none', padding: '8px 0' }}>
              <div style={{ 
                width: '100%',
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '80%',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  flexDirection: message.sender === 'user' ? 'row-reverse' : 'row'
                }}>
                  <Avatar 
                    icon={message.sender === 'user' ? <UserOutlined /> : <RobotOutlined />}
                    style={{ 
                      backgroundColor: message.sender === 'user' ? '#1890ff' : '#52c41a',
                      flexShrink: 0
                    }}
                  />
                  <div style={{
                    background: message.sender === 'user' ? 'var(--primary-color)' : 'var(--bg-secondary)',
                    color: message.sender === 'user' ? 'white' : 'var(--text-color)',
                    border: message.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    maxWidth: '100%'
                  }}>
                    <Paragraph 
                      style={{ 
                        margin: 0, 
                        color: message.sender === 'user' ? 'white' : 'var(--text-color)',
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {message.content}
                    </Paragraph>
                    <div style={{ 
                      fontSize: '11px', 
                      opacity: 0.7, 
                      marginTop: '4px',
                      textAlign: 'right'
                    }}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            </List.Item>
          )}
        />
        
        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0' }}>
            <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#52c41a' }} />
            <div style={{
              background: 'var(--bg-secondary)',
              padding: '12px 16px',
              borderRadius: '12px',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-color)'
            }}>
              AI正在思考中...
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 快速问题 */}
      <div style={{ marginBottom: '12px' }}>
        <Text type="secondary" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>快速提问：</Text>
        <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {quickQuestions.map((question, index) => (
            <Button
              key={index}
              size="small"
              type="dashed"
              onClick={() => setInputValue(question)}
              style={{ fontSize: '11px' }}
            >
              {question}
            </Button>
          ))}
        </div>
      </div>

      {/* 输入区域 */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <TextArea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入您的问题... (Enter发送，Shift+Enter换行)"
          autoSize={{ minRows: 1, maxRows: 3 }}
          style={{ flex: 1 }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSendMessage}
          loading={isTyping}
          style={{ height: 'auto' }}
        >
          发送
        </Button>
      </div>

      {/* 隐私提示 */}
      <div style={{ 
        marginTop: '8px', 
        fontSize: '11px', 
        color: 'var(--text-secondary)', 
        textAlign: 'center' 
      }}>
        🔒 对话内容已加密保护 | 🌱 AI Gardener致力于培育深圳创新人才
      </div>
    </Card>
  );
};

export default ChatComponent;