import React, { useState } from 'react';
import { Card, Input, Button, Space, Alert, List, Tag, Typography, Row, Col, Upload, message } from 'antd';
import { 
  GlobalOutlined, 
  FileTextOutlined, 
  UploadOutlined, 
  DeleteOutlined,
  DownloadOutlined,
  LinkOutlined
} from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface CollectedData {
  id: string;
  type: 'url' | 'text' | 'file';
  source: string;
  content: string;
  timestamp: Date;
  size: number;
}

interface DataCollectionProps {
  onDataCollected: (data: CollectedData[]) => void;
  collectedData: CollectedData[];
}

const DataCollection: React.FC<DataCollectionProps> = ({ onDataCollected, collectedData }) => {
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);

  // 模拟网页抓取
  const handleUrlScrape = async () => {
    if (!urlInput.trim()) {
      message.warning('请输入有效的URL');
      return;
    }

    setLoading(true);
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模拟抓取的数据
      const mockData = {
        title: '示例网页标题',
        content: `这是从 ${urlInput} 抓取的示例内容。包含了网页的主要文本信息，可以用于后续的数据分析和处理。`,
        links: ['https://example1.com', 'https://example2.com'],
        metadata: {
          wordCount: 156,
          paragraphs: 3,
          links: 2
        }
      };

      const newData: CollectedData = {
        id: Date.now().toString(),
        type: 'url',
        source: urlInput,
        content: JSON.stringify(mockData, null, 2),
        timestamp: new Date(),
        size: mockData.content.length
      };

      onDataCollected([...collectedData, newData]);
      setUrlInput('');
      message.success('网页数据抓取成功！');
    } catch (error) {
      message.error('抓取失败，请检查URL是否有效');
    } finally {
      setLoading(false);
    }
  };

  // 添加文本数据
  const handleTextAdd = () => {
    if (!textInput.trim()) {
      message.warning('请输入文本内容');
      return;
    }

    const newData: CollectedData = {
      id: Date.now().toString(),
      type: 'text',
      source: '手动输入',
      content: textInput,
      timestamp: new Date(),
      size: textInput.length
    };

    onDataCollected([...collectedData, newData]);
    setTextInput('');
    message.success('文本数据添加成功！');
  };

  // 文件上传处理
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const newData: CollectedData = {
        id: Date.now().toString(),
        type: 'file',
        source: file.name,
        content: content,
        timestamp: new Date(),
        size: file.size
      };

      onDataCollected([...collectedData, newData]);
      message.success(`文件 ${file.name} 上传成功！`);
    };
    reader.readAsText(file);
    return false; // 阻止默认上传行为
  };

  // 删除数据
  const handleDelete = (id: string) => {
    const updatedData = collectedData.filter(item => item.id !== id);
    onDataCollected(updatedData);
    message.success('数据删除成功！');
  };

  // 导出数据
  const handleExport = (data: CollectedData) => {
    const blob = new Blob([data.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data_${data.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Title level={4}>📥 数据收集</Title>
      
      <Row gutter={[16, 16]}>
        {/* URL抓取 */}
        <Col xs={24} lg={12}>
          <Card title={<><GlobalOutlined /> 网页抓取</>} size="small">
            <Space.Compact style={{ width: '100%' }}>
              <Input
                placeholder="输入网页URL (例如: https://example.com)"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onPressEnter={handleUrlScrape}
              />
              <Button 
                type="primary" 
                loading={loading}
                onClick={handleUrlScrape}
              >
                抓取
              </Button>
            </Space.Compact>
            <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
              支持抓取网页标题、内容、链接等信息
            </div>
          </Card>
        </Col>

        {/* 文本输入 */}
        <Col xs={24} lg={12}>
          <Card title={<><FileTextOutlined /> 文本输入</>} size="small">
            <TextArea
              placeholder="直接输入或粘贴文本数据..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              rows={3}
            />
            <Button 
              type="primary" 
              style={{ marginTop: 8, width: '100%' }}
              onClick={handleTextAdd}
            >
              添加文本
            </Button>
          </Card>
        </Col>

        {/* 文件上传 */}
        <Col xs={24}>
          <Card title={<><UploadOutlined /> 文件上传</>} size="small">
            <Upload
              beforeUpload={handleFileUpload}
              showUploadList={false}
              accept=".txt,.csv,.json"
            >
              <Button icon={<UploadOutlined />}>
                选择文件 (支持 .txt, .csv, .json)
              </Button>
            </Upload>
          </Card>
        </Col>
      </Row>

      {/* 已收集的数据列表 */}
      {collectedData.length > 0 && (
        <Card 
          title={`📊 已收集数据 (${collectedData.length}项)`} 
          style={{ marginTop: 16 }}
          size="small"
        >
          <List
            dataSource={collectedData}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button 
                    type="link" 
                    icon={<DownloadOutlined />} 
                    onClick={() => handleExport(item)}
                    size="small"
                  >
                    导出
                  </Button>,
                  <Button 
                    type="link" 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={() => handleDelete(item.id)}
                    size="small"
                  >
                    删除
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      <Tag color={
                        item.type === 'url' ? 'blue' : 
                        item.type === 'text' ? 'green' : 'orange'
                      }>
                        {item.type.toUpperCase()}
                      </Tag>
                      <Text strong>{item.source}</Text>
                    </Space>
                  }
                  description={
                    <div>
                      <Text type="secondary">
                        {item.content.length > 100 
                          ? `${item.content.substring(0, 100)}...` 
                          : item.content
                        }
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        大小: {item.size} 字节 | 
                        时间: {item.timestamp.toLocaleString()}
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      )}

      {collectedData.length === 0 && (
        <Alert
          message="暂无数据"
          description="请使用上方工具收集数据，支持网页抓取、文本输入和文件上传。"
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}
    </div>
  );
};

export default DataCollection;