import React, { useState } from 'react';
import { Card, Button, Space, Alert, List, Tag, Typography, Row, Col, Select, message, Progress } from 'antd';
import { 
  ClearOutlined, 
  SwapOutlined, 
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  DatabaseOutlined
} from '@ant-design/icons';
import Papa from 'papaparse';

const { Title, Text } = Typography;
const { Option } = Select;

interface CollectedData {
  id: string;
  type: 'url' | 'text' | 'file';
  source: string;
  content: string;
  timestamp: Date;
  size: number;
}

interface ProcessedData {
  id: string;
  originalId: string;
  processType: string;
  content: string;
  metadata: {
    originalSize: number;
    processedSize: number;
    processingTime: number;
    duplicatesRemoved?: number;
    conversionType?: string;
  };
  timestamp: Date;
}

interface DataProcessingProps {
  collectedData: CollectedData[];
  onDataProcessed: (data: ProcessedData[]) => void;
  processedData: ProcessedData[];
}

const DataProcessing: React.FC<DataProcessingProps> = ({ 
  collectedData, 
  onDataProcessed, 
  processedData 
}) => {
  const [selectedDataId, setSelectedDataId] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [conversionType, setConversionType] = useState<string>('csv-to-json');

  // 数据清理 - 移除重复项
  const handleDataCleaning = async (dataId: string) => {
    const targetData = collectedData.find(d => d.id === dataId);
    if (!targetData) {
      message.error('未找到目标数据');
      return;
    }

    setProcessing(true);
    const startTime = Date.now();

    try {
      // 模拟处理延迟
      await new Promise(resolve => setTimeout(resolve, 1500));

      let content = targetData.content;
      let duplicatesRemoved = 0;

      // 简单的重复行移除逻辑
      const lines = content.split('\n');
      const uniqueLines = [...new Set(lines)];
      duplicatesRemoved = lines.length - uniqueLines.length;
      const cleanedContent = uniqueLines.join('\n');

      const processedItem: ProcessedData = {
        id: Date.now().toString(),
        originalId: dataId,
        processType: '数据清理',
        content: cleanedContent,
        metadata: {
          originalSize: content.length,
          processedSize: cleanedContent.length,
          processingTime: Date.now() - startTime,
          duplicatesRemoved
        },
        timestamp: new Date()
      };

      onDataProcessed([...processedData, processedItem]);
      message.success(`数据清理完成！移除了 ${duplicatesRemoved} 个重复项`);
    } catch (error) {
      message.error('数据清理失败');
    } finally {
      setProcessing(false);
    }
  };

  // 数据转换
  const handleDataConversion = async (dataId: string, conversionType: string) => {
    const targetData = collectedData.find(d => d.id === dataId);
    if (!targetData) {
      message.error('未找到目标数据');
      return;
    }

    setProcessing(true);
    const startTime = Date.now();

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      let convertedContent = '';
      let conversionSuccess = true;

      switch (conversionType) {
        case 'csv-to-json':
          try {
            const parsed = Papa.parse(targetData.content, { header: true });
            convertedContent = JSON.stringify(parsed.data, null, 2);
          } catch (e) {
            // 如果不是有效CSV，创建示例JSON
            convertedContent = JSON.stringify({
              data: targetData.content.split('\n').map((line, index) => ({
                id: index + 1,
                content: line.trim()
              })).filter(item => item.content)
            }, null, 2);
          }
          break;

        case 'json-to-csv':
          try {
            const jsonData = JSON.parse(targetData.content);
            if (Array.isArray(jsonData)) {
              convertedContent = Papa.unparse(jsonData);
            } else {
              convertedContent = Papa.unparse([jsonData]);
            }
          } catch (e) {
            message.error('无效的JSON格式');
            conversionSuccess = false;
          }
          break;

        case 'text-to-structured':
          const lines = targetData.content.split('\n').filter(line => line.trim());
          const structuredData = {
            totalLines: lines.length,
            wordCount: targetData.content.split(/\s+/).length,
            lines: lines.map((line, index) => ({
              lineNumber: index + 1,
              content: line.trim(),
              wordCount: line.trim().split(/\s+/).length
            }))
          };
          convertedContent = JSON.stringify(structuredData, null, 2);
          break;

        default:
          message.error('不支持的转换类型');
          conversionSuccess = false;
      }

      if (conversionSuccess) {
        const processedItem: ProcessedData = {
          id: Date.now().toString(),
          originalId: dataId,
          processType: '数据转换',
          content: convertedContent,
          metadata: {
            originalSize: targetData.content.length,
            processedSize: convertedContent.length,
            processingTime: Date.now() - startTime,
            conversionType
          },
          timestamp: new Date()
        };

        onDataProcessed([...processedData, processedItem]);
        message.success(`数据转换完成！(${conversionType})`);
      }
    } catch (error) {
      message.error('数据转换失败');
    } finally {
      setProcessing(false);
    }
  };

  // 删除处理结果
  const handleDeleteProcessed = (id: string) => {
    const updatedData = processedData.filter(item => item.id !== id);
    onDataProcessed(updatedData);
    message.success('处理结果删除成功！');
  };

  // 导出处理结果
  const handleExportProcessed = (data: ProcessedData) => {
    const blob = new Blob([data.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `processed_${data.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Title level={4}>⚙️ 数据处理</Title>

      {collectedData.length === 0 ? (
        <Alert
          message="暂无可处理的数据"
          description="请先在数据收集模块收集数据"
          type="warning"
          showIcon
        />
      ) : (
        <Row gutter={[16, 16]}>
          {/* 数据清理 */}
          <Col xs={24} lg={12}>
            <Card title={<><ClearOutlined /> 数据清理</>} size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Select
                  placeholder="选择要清理的数据"
                  style={{ width: '100%' }}
                  value={selectedDataId}
                  onChange={setSelectedDataId}
                >
                  {collectedData.map(data => (
                    <Option key={data.id} value={data.id}>
                      <Tag color={data.type === 'url' ? 'blue' : data.type === 'text' ? 'green' : 'orange'}>
                        {data.type.toUpperCase()}
                      </Tag>
                      {data.source}
                    </Option>
                  ))}
                </Select>
                
                <Button
                  type="primary"
                  icon={<ClearOutlined />}
                  loading={processing}
                  disabled={!selectedDataId}
                  onClick={() => handleDataCleaning(selectedDataId)}
                  block
                >
                  移除重复项
                </Button>
                
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  自动检测并移除重复的行或记录
                </Text>
              </Space>
            </Card>
          </Col>

          {/* 数据转换 */}
          <Col xs={24} lg={12}>
            <Card title={<><SwapOutlined /> 数据转换</>} size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Select
                  placeholder="选择要转换的数据"
                  style={{ width: '100%' }}
                  value={selectedDataId}
                  onChange={setSelectedDataId}
                >
                  {collectedData.map(data => (
                    <Option key={data.id} value={data.id}>
                      <Tag color={data.type === 'url' ? 'blue' : data.type === 'text' ? 'green' : 'orange'}>
                        {data.type.toUpperCase()}
                      </Tag>
                      {data.source}
                    </Option>
                  ))}
                </Select>

                <Select
                  value={conversionType}
                  onChange={setConversionType}
                  style={{ width: '100%' }}
                >
                  <Option value="csv-to-json">CSV → JSON</Option>
                  <Option value="json-to-csv">JSON → CSV</Option>
                  <Option value="text-to-structured">文本 → 结构化数据</Option>
                </Select>
                
                <Button
                  type="primary"
                  icon={<SwapOutlined />}
                  loading={processing}
                  disabled={!selectedDataId}
                  onClick={() => handleDataConversion(selectedDataId, conversionType)}
                  block
                >
                  开始转换
                </Button>
                
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  支持多种格式间的相互转换
                </Text>
              </Space>
            </Card>
          </Col>
        </Row>
      )}

      {/* 处理进度 */}
      {processing && (
        <Card style={{ marginTop: 16 }} size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text>正在处理数据...</Text>
            <Progress percent={66} status="active" />
          </Space>
        </Card>
      )}

      {/* 处理结果列表 */}
      {processedData.length > 0 && (
        <Card 
          title={`🔧 处理结果 (${processedData.length}项)`} 
          style={{ marginTop: 16 }}
          size="small"
        >
          <List
            dataSource={processedData}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button 
                    type="link" 
                    icon={<FileTextOutlined />} 
                    onClick={() => handleExportProcessed(item)}
                    size="small"
                  >
                    导出
                  </Button>,
                  <Button 
                    type="link" 
                    danger 
                    icon={<ClearOutlined />} 
                    onClick={() => handleDeleteProcessed(item.id)}
                    size="small"
                  >
                    删除
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
                  }
                  title={
                    <Space>
                      <Tag color="success">{item.processType}</Tag>
                      <Text strong>
                        {collectedData.find(d => d.id === item.originalId)?.source || '未知来源'}
                      </Text>
                    </Space>
                  }
                  description={
                    <div>
                      <Text type="secondary">
                        {item.content.length > 80 
                          ? `${item.content.substring(0, 80)}...` 
                          : item.content
                        }
                      </Text>
                      <br />
                      <Space split={<span>|</span>} style={{ fontSize: '12px', color: '#999' }}>
                        <span>原始: {item.metadata.originalSize}B</span>
                        <span>处理后: {item.metadata.processedSize}B</span>
                        <span>耗时: {item.metadata.processingTime}ms</span>
                        {item.metadata.duplicatesRemoved !== undefined && (
                          <span>移除重复: {item.metadata.duplicatesRemoved}项</span>
                        )}
                        {item.metadata.conversionType && (
                          <span>转换: {item.metadata.conversionType}</span>
                        )}
                      </Space>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      )}
    </div>
  );
};

export default DataProcessing;