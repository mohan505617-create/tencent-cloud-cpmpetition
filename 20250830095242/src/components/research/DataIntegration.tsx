import React, { useState } from 'react';
import { Card, Button, Space, Alert, List, Tag, Typography, Row, Col, Select, Input, message, Modal, Form } from 'antd';
import { 
  LinkOutlined, 
  FileTextOutlined, 
  SendOutlined,
  BulbOutlined,
  RobotOutlined,
  CheckCircleOutlined,
  ExportOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface AnalysisResult {
  id: string;
  dataId: string;
  analysisType: string;
  statistics: any;
  chartData: any;
  insights: string[];
  timestamp: Date;
}

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
}

interface DataIntegrationProps {
  analysisResults: AnalysisResult[];
  existingNotes: Note[];
  onCreateNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  onLinkToNote: (noteId: string, analysisId: string) => void;
}

const DataIntegration: React.FC<DataIntegrationProps> = ({
  analysisResults,
  existingNotes,
  onCreateNote,
  onLinkToNote
}) => {
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string>('');
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [linkModalVisible, setLinkModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  // 生成AI建议
  const generateAISuggestions = (analysis: AnalysisResult) => {
    const suggestions: string[] = [];
    
    // 基于统计数据生成建议
    if (analysis.statistics.mean > analysis.statistics.median) {
      suggestions.push('建议创建关于"数据偏态分布"的笔记，记录异常值处理方法');
    }
    
    if (analysis.statistics.std > analysis.statistics.mean * 0.5) {
      suggestions.push('建议链接到"数据变异性分析"相关笔记，探讨数据分散原因');
    }
    
    // 基于现有笔记生成建议
    const relatedNotes = existingNotes.filter(note => 
      note.title.toLowerCase().includes('数据') || 
      note.title.toLowerCase().includes('分析') ||
      note.title.toLowerCase().includes('统计')
    );
    
    if (relatedNotes.length > 0) {
      suggestions.push(`建议链接到现有笔记：${relatedNotes.slice(0, 2).map(n => n.title).join('、')}`);
    }
    
    // 基于分析类型生成建议
    if (analysis.analysisType.includes('柱状图')) {
      suggestions.push('建议创建"数据可视化最佳实践"笔记，记录图表设计原则');
    }
    
    if (analysis.statistics.count > 100) {
      suggestions.push('建议创建"大数据集处理"笔记，记录处理大量数据的经验');
    }
    
    return suggestions;
  };

  // 生成笔记内容
  const generateNoteContent = (analysis: AnalysisResult): string => {
    const content = `# 数据分析报告

## 分析概述
- **分析类型**: ${analysis.analysisType}
- **分析时间**: ${new Date(analysis.timestamp).toLocaleString()}
- **数据ID**: ${analysis.dataId}

## 统计摘要
- **数据量**: ${analysis.statistics.count}
- **平均值**: ${analysis.statistics.mean?.toFixed(2) || 'N/A'}
- **中位数**: ${analysis.statistics.median?.toFixed(2) || 'N/A'}
- **标准差**: ${analysis.statistics.std?.toFixed(2) || 'N/A'}
- **最小值**: ${analysis.statistics.min?.toFixed(2) || 'N/A'}
- **最大值**: ${analysis.statistics.max?.toFixed(2) || 'N/A'}

## 关键洞察
${analysis.insights.map(insight => `- ${insight}`).join('\n')}

## 数据特征
- **变异系数**: ${((analysis.statistics.std / analysis.statistics.mean) * 100).toFixed(2)}%
- **数据范围**: ${(analysis.statistics.max - analysis.statistics.min).toFixed(2)}
- **分布特征**: ${analysis.statistics.mean > analysis.statistics.median ? '右偏分布' : analysis.statistics.mean < analysis.statistics.median ? '左偏分布' : '对称分布'}

## 后续行动
- [ ] 验证异常值
- [ ] 深入分析数据模式
- [ ] 考虑数据收集方法的改进
- [ ] 与相关研究进行对比

## 相关链接
- 原始数据处理记录
- 相关研究文献
- 类似分析案例

---
*此报告由 EduAI Hub 数字谱系模块自动生成*`;

    return content;
  };

  // 导出为新笔记
  const handleExportAsNote = async (values: any) => {
    const selectedAnalysis = analysisResults.find(a => a.id === selectedAnalysisId);
    if (!selectedAnalysis) return;

    const noteContent = values.customContent || generateNoteContent(selectedAnalysis);
    
    const newNote = {
      title: values.title || `数据分析报告 - ${selectedAnalysis.analysisType}`,
      content: noteContent,
      tags: ['数据分析', '研究', '统计', ...(values.tags || [])],
    };

    onCreateNote(newNote);
    setExportModalVisible(false);
    form.resetFields();
    message.success('分析结果已导出为新笔记！');
  };

  // 链接到现有笔记
  const handleLinkToExisting = (noteId: string) => {
    if (!selectedAnalysisId) return;
    
    onLinkToNote(noteId, selectedAnalysisId);
    setLinkModalVisible(false);
    message.success('分析结果已链接到现有笔记！');
  };

  // 显示AI建议
  const showAISuggestions = (analysisId: string) => {
    const analysis = analysisResults.find(a => a.id === analysisId);
    if (analysis) {
      const suggestions = generateAISuggestions(analysis);
      setAiSuggestions(suggestions);
    }
  };

  return (
    <div>
      <Title level={4}>🔗 数据集成</Title>

      {analysisResults.length === 0 ? (
        <Alert
          message="暂无分析结果"
          description="请先在数据分析模块完成数据分析"
          type="warning"
          showIcon
        />
      ) : (
        <Row gutter={[16, 16]}>
          {/* 集成控制面板 */}
          <Col xs={24} lg={12}>
            <Card title={<><LinkOutlined /> 集成设置</>} size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>选择分析结果：</Text>
                  <Select
                    placeholder="选择要集成的分析结果"
                    style={{ width: '100%', marginTop: 8 }}
                    value={selectedAnalysisId}
                    onChange={(value) => {
                      setSelectedAnalysisId(value);
                      showAISuggestions(value);
                    }}
                  >
                    {analysisResults.map(result => (
                      <Option key={result.id} value={result.id}>
                        <Tag color="blue">{result.analysisType}</Tag>
                        {new Date(result.timestamp).toLocaleDateString()}
                      </Option>
                    ))}
                  </Select>
                </div>

                <Space style={{ width: '100%' }}>
                  <Button
                    type="primary"
                    icon={<ExportOutlined />}
                    disabled={!selectedAnalysisId}
                    onClick={() => setExportModalVisible(true)}
                  >
                    导出为新笔记
                  </Button>
                  <Button
                    icon={<LinkOutlined />}
                    disabled={!selectedAnalysisId || existingNotes.length === 0}
                    onClick={() => setLinkModalVisible(true)}
                  >
                    链接到现有笔记
                  </Button>
                </Space>
              </Space>
            </Card>

            {/* AI建议 */}
            {aiSuggestions.length > 0 && (
              <Card 
                title={<><RobotOutlined /> AI 智能建议</>} 
                style={{ marginTop: 16 }}
                size="small"
              >
                <List
                  dataSource={aiSuggestions}
                  renderItem={(suggestion, index) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<BulbOutlined style={{ color: '#faad14' }} />}
                        description={<Text>{suggestion}</Text>}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            )}
          </Col>

          {/* 预览区域 */}
          <Col xs={24} lg={12}>
            <Card title="📄 内容预览" size="small">
              {selectedAnalysisId ? (
                <div>
                  {(() => {
                    const analysis = analysisResults.find(a => a.id === selectedAnalysisId);
                    if (!analysis) return null;
                    
                    return (
                      <div>
                        <Title level={5}>分析摘要</Title>
                        <Paragraph>
                          <Text strong>类型：</Text>{analysis.analysisType}<br />
                          <Text strong>数据量：</Text>{analysis.statistics.count}<br />
                          <Text strong>平均值：</Text>{analysis.statistics.mean?.toFixed(2)}<br />
                          <Text strong>标准差：</Text>{analysis.statistics.std?.toFixed(2)}
                        </Paragraph>
                        
                        <Title level={5}>关键洞察</Title>
                        <ul>
                          {analysis.insights.slice(0, 3).map((insight, index) => (
                            <li key={index}><Text>{insight}</Text></li>
                          ))}
                        </ul>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div style={{ 
                  height: 200, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#999'
                }}>
                  请选择分析结果以查看预览
                </div>
              )}
            </Card>

            {/* 现有笔记列表 */}
            {existingNotes.length > 0 && (
              <Card 
                title={`📚 现有笔记 (${existingNotes.length}篇)`} 
                style={{ marginTop: 16 }}
                size="small"
              >
                <List
                  dataSource={existingNotes.slice(0, 5)}
                  renderItem={(note) => (
                    <List.Item
                      actions={[
                        <Button 
                          type="link" 
                          size="small"
                          disabled={!selectedAnalysisId}
                          onClick={() => handleLinkToExisting(note.id)}
                        >
                          链接
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        title={note.title}
                        description={
                          <div>
                            <Text type="secondary">
                              {note.content.substring(0, 60)}...
                            </Text>
                            <br />
                            <Space>
                              {note.tags.slice(0, 3).map(tag => (
                                <Tag key={tag}>{tag}</Tag>
                              ))}
                            </Space>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
                {existingNotes.length > 5 && (
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    还有 {existingNotes.length - 5} 篇笔记...
                  </Text>
                )}
              </Card>
            )}
          </Col>
        </Row>
      )}

      {/* 导出为新笔记模态框 */}
      <Modal
        title="导出为新笔记"
        open={exportModalVisible}
        onCancel={() => setExportModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form form={form} onFinish={handleExportAsNote} layout="vertical">
          <Form.Item 
            label="笔记标题" 
            name="title"
            rules={[{ required: true, message: '请输入笔记标题' }]}
          >
            <Input placeholder="输入笔记标题" />
          </Form.Item>
          
          <Form.Item label="标签" name="tags">
            <Select
              mode="tags"
              placeholder="添加标签"
              style={{ width: '100%' }}
            >
              <Option value="数据分析">数据分析</Option>
              <Option value="统计">统计</Option>
              <Option value="研究">研究</Option>
              <Option value="可视化">可视化</Option>
            </Select>
          </Form.Item>
          
          <Form.Item label="笔记内容" name="customContent">
            <TextArea
              rows={12}
              placeholder="将自动生成内容，您也可以自定义..."
              defaultValue={selectedAnalysisId ? generateNoteContent(
                analysisResults.find(a => a.id === selectedAnalysisId)!
              ) : ''}
            />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                创建笔记
              </Button>
              <Button onClick={() => setExportModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 链接到现有笔记模态框 */}
      <Modal
        title="链接到现有笔记"
        open={linkModalVisible}
        onCancel={() => setLinkModalVisible(false)}
        footer={null}
      >
        <List
          dataSource={existingNotes}
          renderItem={(note) => (
            <List.Item
              actions={[
                <Button 
                  type="primary" 
                  size="small"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleLinkToExisting(note.id)}
                >
                  选择
                </Button>
              ]}
            >
              <List.Item.Meta
                title={note.title}
                description={
                  <div>
                    <Paragraph ellipsis={{ rows: 2 }}>
                      {note.content}
                    </Paragraph>
                    <Space>
                      {note.tags.map(tag => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </Space>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default DataIntegration;