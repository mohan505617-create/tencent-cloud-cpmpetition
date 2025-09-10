import React, { useState } from 'react';
import { Card, Tabs, Typography, Row, Col, Statistic, Progress, Timeline, Alert } from 'antd';
import { 
  ExperimentOutlined, 
  DatabaseOutlined, 
  BarChartOutlined, 
  LinkOutlined,
  FileTextOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import type { TabsProps } from 'antd';
import DataCollection from '../components/research/DataCollection';
import DataProcessing from '../components/research/DataProcessing';
import DataAnalysis from '../components/research/DataAnalysis';
import DataIntegration from '../components/research/DataIntegration';

const { Title, Paragraph } = Typography;

// 数据类型定义
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
  metadata: any;
  timestamp: Date;
}

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

const 研究助手: React.FC = () => {
  // 状态管理
  const [collectedData, setCollectedData] = useState<CollectedData[]>([]);
  const [processedData, setProcessedData] = useState<ProcessedData[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [activeTab, setActiveTab] = useState('1');

  // 模拟现有笔记数据
  const [existingNotes] = useState<Note[]>([
    {
      id: '1',
      title: '人工智能研究综述',
      content: '人工智能技术的发展历程和未来趋势...',
      tags: ['AI', '机器学习', '深度学习'],
      createdAt: new Date('2023-11-01')
    },
    {
      id: '2',
      title: '数据挖掘方法论',
      content: '数据挖掘的基本方法和应用案例...',
      tags: ['数据挖掘', '统计学', '算法'],
      createdAt: new Date('2023-10-15')
    }
  ]);

  // 处理数据收集
  const handleDataCollected = (data: CollectedData[]) => {
    setCollectedData(prev => [...prev, ...data]);
  };

  // 处理数据处理
  const handleDataProcessed = (data: ProcessedData[]) => {
    setProcessedData(prev => [...prev, ...data]);
  };

  // 处理分析完成
  const handleAnalysisComplete = (results: AnalysisResult[]) => {
    setAnalysisResults(prev => [...prev, ...results]);
  };

  // 计算研究进度
  const calculateProgress = () => {
    const totalSteps = 4;
    let completedSteps = 0;
    
    if (collectedData.length > 0) completedSteps++;
    if (processedData.length > 0) completedSteps++;
    if (analysisResults.length > 0) completedSteps++;
    if (existingNotes.length > 0) completedSteps++;
    
    return Math.round((completedSteps / totalSteps) * 100);
  };

  // 获取工作流状态
  const getWorkflowStatus = () => {
    return [
      {
        title: '数据收集',
        status: collectedData.length > 0 ? 'finish' : 'wait',
        description: `已收集 ${collectedData.length} 条数据`
      },
      {
        title: '数据处理',
        status: processedData.length > 0 ? 'finish' : collectedData.length > 0 ? 'process' : 'wait',
        description: `已处理 ${processedData.length} 条数据`
      },
      {
        title: '数据分析',
        status: analysisResults.length > 0 ? 'finish' : processedData.length > 0 ? 'process' : 'wait',
        description: `已完成 ${analysisResults.length} 项分析`
      },
      {
        title: '知识整合',
        status: analysisResults.length > 0 ? 'process' : 'wait',
        description: '整合到知识库'
      }
    ];
  };

  // 标签页配置
  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <span>
          <DatabaseOutlined />
          数据收集
        </span>
      ),
      children: (
        <DataCollection 
          onDataCollected={handleDataCollected}
          collectedData={collectedData}
        />
      )
    },
    {
      key: '2',
      label: (
        <span>
          <ExperimentOutlined />
          数据处理
        </span>
      ),
      children: (
        <DataProcessing 
          collectedData={collectedData}
          onDataProcessed={handleDataProcessed}
          processedData={processedData}
        />
      )
    },
    {
      key: '3',
      label: (
        <span>
          <BarChartOutlined />
          数据分析
        </span>
      ),
      children: (
        <DataAnalysis 
          数据={processedData}
          标题="研究数据分析"
          描述="对收集的研究数据进行统计分析和可视化展示"
        />
      )
    },
    {
      key: '4',
      label: (
        <span>
          <LinkOutlined />
          数据整合
        </span>
      ),
      children: (
        <DataIntegration 
          analysisResults={analysisResults}
          existingNotes={existingNotes}
          onIntegrationComplete={(integratedData) => {
            console.log('数据整合完成:', integratedData);
          }}
        />
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <RocketOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          研究助手
        </Title>
        <Paragraph>
          智能化的研究数据收集、处理、分析和整合平台，助力您的学术研究工作
        </Paragraph>
      </div>

      {/* 统计概览 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="已收集数据"
              value={collectedData.length}
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="已处理数据"
              value={processedData.length}
              prefix={<ExperimentOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="分析结果"
              value={analysisResults.length}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="研究进度"
              value={calculateProgress()}
              suffix="%"
              prefix={<RocketOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容区域 */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              size="large"
            />
          </Card>
        </Col>

        {/* 侧边栏 */}
        <Col xs={24} lg={8}>
          {/* 研究工作流 */}
          <Card title="研究工作流" size="small" style={{ marginBottom: '16px' }}>
            <Timeline
              items={getWorkflowStatus().map((item, index) => ({
                dot: item.status === 'finish' ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : 
                     item.status === 'process' ? <ClockCircleOutlined style={{ color: '#1890ff' }} /> : undefined,
                children: (
                  <div>
                    <div style={{ fontWeight: 500 }}>{item.title}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{item.description}</div>
                  </div>
                )
              }))}
            />
          </Card>

          {/* 进度指示 */}
          <Card title="整体进度" size="small" style={{ marginBottom: '16px' }}>
            <Progress
              percent={calculateProgress()}
              status={calculateProgress() === 100 ? 'success' : 'active'}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
              {calculateProgress() < 25 && '开始收集研究数据'}
              {calculateProgress() >= 25 && calculateProgress() < 50 && '继续处理数据'}
              {calculateProgress() >= 50 && calculateProgress() < 75 && '进行数据分析'}
              {calculateProgress() >= 75 && calculateProgress() < 100 && '整合研究成果'}
              {calculateProgress() === 100 && '研究工作流程完成'}
            </div>
          </Card>

          {/* 快速提示 */}
          <Alert
            message="研究提示"
            description="建议按照数据收集 → 数据处理 → 数据分析 → 数据整合的顺序进行研究工作，以获得最佳效果。"
            type="info"
            showIcon
            style={{ marginBottom: '16px' }}
          />

          {/* 现有笔记 */}
          <Card title="相关笔记" size="small">
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {existingNotes.map(note => (
                <div key={note.id} style={{ 
                  padding: '8px 0', 
                  borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer'
                }}>
                  <div style={{ fontWeight: 500, fontSize: '14px' }}>
                    <FileTextOutlined style={{ marginRight: '6px', color: '#1890ff' }} />
                    {note.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    {note.tags.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default 研究助手;