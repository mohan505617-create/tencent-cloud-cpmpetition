import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Button, Space, Typography, Statistic, Alert, Table, Tag } from 'antd';
import { 
  BarChartOutlined, 
  LineChartOutlined, 
  PieChartOutlined,
  CalculatorOutlined,
  TrophyOutlined,
  RiseOutlined
} from '@ant-design/icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { evaluate, mean, median, mode, std, min, max } from 'mathjs';

// 注册 Chart.js 组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  ChartTitle,
  Tooltip,
  Legend
);

const { Title, Text } = Typography;
const { Option } = Select;

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
  statistics: {
    count: number;
    mean?: number;
    median?: number;
    mode?: number[];
    std?: number;
    min?: number;
    max?: number;
    sum?: number;
  };
  chartData: any;
  insights: string[];
  timestamp: Date;
}

interface DataAnalysisProps {
  processedData: ProcessedData[];
  onAnalysisComplete: (results: AnalysisResult[]) => void;
  analysisResults: AnalysisResult[];
}

const DataAnalysis: React.FC<DataAnalysisProps> = ({ 
  processedData, 
  onAnalysisComplete, 
  analysisResults 
}) => {
  const [selectedDataId, setSelectedDataId] = useState<string>('');
  const [chartType, setChartType] = useState<string>('bar');
  const [analyzing, setAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);

  // 提取数值数据
  const extractNumbers = (content: string): number[] => {
    const numbers: number[] = [];
    
    try {
      // 尝试解析JSON数据
      const jsonData = JSON.parse(content);
      if (Array.isArray(jsonData)) {
        jsonData.forEach(item => {
          if (typeof item === 'number') {
            numbers.push(item);
          } else if (typeof item === 'object') {
            Object.values(item).forEach(value => {
              if (typeof value === 'number') {
                numbers.push(value);
              }
            });
          }
        });
      }
    } catch {
      // 如果不是JSON，尝试提取文本中的数字
      const matches = content.match(/\d+\.?\d*/g);
      if (matches) {
        numbers.push(...matches.map(Number).filter(n => !isNaN(n)));
      }
    }

    // 如果没有找到数字，生成示例数据
    if (numbers.length === 0) {
      const words = content.split(/\s+/).filter(word => word.length > 0);
      return words.map(word => word.length); // 使用单词长度作为数值
    }

    return numbers;
  };

  // 执行数据分析
  const performAnalysis = async (dataId: string) => {
    const targetData = processedData.find(d => d.id === dataId);
    if (!targetData) return;

    setAnalyzing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const numbers = extractNumbers(targetData.content);
      
      if (numbers.length === 0) {
        throw new Error('未找到可分析的数值数据');
      }

      // 计算统计数据
      const statistics = {
        count: numbers.length,
        mean: mean(numbers) as number,
        median: median(numbers) as number,
        std: std(numbers) as number,
        min: min(numbers) as number,
        max: max(numbers) as number,
        sum: numbers.reduce((a, b) => a + b, 0)
      };

      // 生成图表数据
      const chartData = generateChartData(numbers, chartType);

      // 生成洞察
      const insights = generateInsights(statistics, numbers);

      const analysisResult: AnalysisResult = {
        id: Date.now().toString(),
        dataId: dataId,
        analysisType: `${chartType}图表分析`,
        statistics,
        chartData,
        insights,
        timestamp: new Date()
      };

      setCurrentAnalysis(analysisResult);
      onAnalysisComplete([...analysisResults, analysisResult]);

    } catch (error) {
      console.error('分析失败:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  // 生成图表数据
  const generateChartData = (numbers: number[], type: string) => {
    const labels = numbers.map((_, index) => `数据点 ${index + 1}`);
    
    const baseData = {
      labels: labels.slice(0, 20), // 限制显示前20个数据点
      datasets: [{
        label: '数值',
        data: numbers.slice(0, 20),
        backgroundColor: [
          'rgba(24, 144, 255, 0.6)',
          'rgba(82, 196, 26, 0.6)',
          'rgba(250, 140, 22, 0.6)',
          'rgba(114, 46, 209, 0.6)',
          'rgba(235, 47, 6, 0.6)',
        ],
        borderColor: [
          'rgba(24, 144, 255, 1)',
          'rgba(82, 196, 26, 1)',
          'rgba(250, 140, 22, 1)',
          'rgba(114, 46, 209, 1)',
          'rgba(235, 47, 6, 1)',
        ],
        borderWidth: 1
      }]
    };

    if (type === 'pie') {
      // 对于饼图，按数值范围分组
      const ranges = {
        '0-10': 0,
        '11-50': 0,
        '51-100': 0,
        '100+': 0
      };
      
      numbers.forEach(num => {
        if (num <= 10) ranges['0-10']++;
        else if (num <= 50) ranges['11-50']++;
        else if (num <= 100) ranges['51-100']++;
        else ranges['100+']++;
      });

      return {
        labels: Object.keys(ranges),
        datasets: [{
          data: Object.values(ranges),
          backgroundColor: [
            'rgba(24, 144, 255, 0.6)',
            'rgba(82, 196, 26, 0.6)',
            'rgba(250, 140, 22, 0.6)',
            'rgba(114, 46, 209, 0.6)',
          ],
        }]
      };
    }

    return baseData;
  };

  // 生成分析洞察
  const generateInsights = (stats: any, numbers: number[]): string[] => {
    const insights: string[] = [];
    
    insights.push(`数据集包含 ${stats.count} 个数值`);
    insights.push(`平均值为 ${stats.mean.toFixed(2)}`);
    insights.push(`中位数为 ${stats.median.toFixed(2)}`);
    
    if (stats.mean > stats.median) {
      insights.push('数据分布右偏，存在较大的异常值');
    } else if (stats.mean < stats.median) {
      insights.push('数据分布左偏，存在较小的异常值');
    } else {
      insights.push('数据分布相对对称');
    }
    
    const cv = (stats.std / stats.mean) * 100;
    if (cv > 50) {
      insights.push('数据变异性较大，分布较为分散');
    } else if (cv < 20) {
      insights.push('数据变异性较小，分布较为集中');
    }
    
    insights.push(`数据范围：${stats.min.toFixed(2)} - ${stats.max.toFixed(2)}`);
    
    return insights;
  };

  // 图表选项
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '数据分析图表',
      },
    },
    scales: chartType !== 'pie' ? {
      y: {
        beginAtZero: true,
      },
    } : undefined,
  };

  // 渲染图表
  const renderChart = () => {
    if (!currentAnalysis) return null;

    switch (chartType) {
      case 'bar':
        return <Bar data={currentAnalysis.chartData} options={chartOptions} />;
      case 'line':
        return <Line data={currentAnalysis.chartData} options={chartOptions} />;
      case 'pie':
        return <Pie data={currentAnalysis.chartData} options={chartOptions} />;
      default:
        return <Bar data={currentAnalysis.chartData} options={chartOptions} />;
    }
  };

  return (
    <div>
      <Title level={4}>📊 数据分析</Title>

      {processedData.length === 0 ? (
        <Alert
          message="暂无可分析的数据"
          description="请先在数据处理模块处理数据"
          type="warning"
          showIcon
        />
      ) : (
        <Row gutter={[16, 16]}>
          {/* 分析控制面板 */}
          <Col xs={24} lg={8}>
            <Card title={<><CalculatorOutlined /> 分析设置</>} size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>选择数据源：</Text>
                  <Select
                    placeholder="选择要分析的数据"
                    style={{ width: '100%', marginTop: 8 }}
                    value={selectedDataId}
                    onChange={setSelectedDataId}
                  >
                    {processedData.map(data => (
                      <Option key={data.id} value={data.id}>
                        <Tag color="success">{data.processType}</Tag>
                        {data.content.substring(0, 30)}...
                      </Option>
                    ))}
                  </Select>
                </div>

                <div>
                  <Text strong>图表类型：</Text>
                  <Select
                    value={chartType}
                    onChange={setChartType}
                    style={{ width: '100%', marginTop: 8 }}
                  >
                    <Option value="bar">
                      <BarChartOutlined /> 柱状图
                    </Option>
                    <Option value="line">
                      <LineChartOutlined /> 折线图
                    </Option>
                    <Option value="pie">
                      <PieChartOutlined /> 饼图
                    </Option>
                  </Select>
                </div>

                <Button
                  type="primary"
                  icon={<RiseOutlined />}
                  loading={analyzing}
                  disabled={!selectedDataId}
                  onClick={() => performAnalysis(selectedDataId)}
                  block
                >
                  开始分析
                </Button>
              </Space>
            </Card>

            {/* 统计数据 */}
            {currentAnalysis && (
              <Card title="📈 统计摘要" style={{ marginTop: 16 }} size="small">
                <Row gutter={[8, 8]}>
                  <Col span={12}>
                    <Statistic 
                      title="数据量" 
                      value={currentAnalysis.statistics.count} 
                      prefix={<TrophyOutlined />}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic 
                      title="平均值" 
                      value={currentAnalysis.statistics.mean} 
                      precision={2}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic 
                      title="中位数" 
                      value={currentAnalysis.statistics.median} 
                      precision={2}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic 
                      title="标准差" 
                      value={currentAnalysis.statistics.std} 
                      precision={2}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic 
                      title="最小值" 
                      value={currentAnalysis.statistics.min} 
                      precision={2}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic 
                      title="最大值" 
                      value={currentAnalysis.statistics.max} 
                      precision={2}
                    />
                  </Col>
                </Row>
              </Card>
            )}
          </Col>

          {/* 图表显示 */}
          <Col xs={24} lg={16}>
            <Card title="📊 可视化图表" size="small">
              {currentAnalysis ? (
                <div style={{ height: 400 }}>
                  {renderChart()}
                </div>
              ) : (
                <div style={{ 
                  height: 400, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#999'
                }}>
                  请选择数据并开始分析以查看图表
                </div>
              )}
            </Card>

            {/* 分析洞察 */}
            {currentAnalysis && (
              <Card title="💡 分析洞察" style={{ marginTop: 16 }} size="small">
                <ul style={{ paddingLeft: 20 }}>
                  {currentAnalysis.insights.map((insight, index) => (
                    <li key={index} style={{ marginBottom: 8 }}>
                      <Text>{insight}</Text>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </Col>
        </Row>
      )}

      {/* 历史分析结果 */}
      {analysisResults.length > 0 && (
        <Card 
          title={`📋 分析历史 (${analysisResults.length}项)`} 
          style={{ marginTop: 16 }}
          size="small"
        >
          <Table
            dataSource={analysisResults}
            rowKey="id"
            size="small"
            columns={[
              {
                title: '分析类型',
                dataIndex: 'analysisType',
                key: 'analysisType',
                render: (text) => <Tag color="blue">{text}</Tag>
              },
              {
                title: '数据量',
                dataIndex: ['statistics', 'count'],
                key: 'count',
              },
              {
                title: '平均值',
                dataIndex: ['statistics', 'mean'],
                key: 'mean',
                render: (value) => value?.toFixed(2)
              },
              {
                title: '标准差',
                dataIndex: ['statistics', 'std'],
                key: 'std',
                render: (value) => value?.toFixed(2)
              },
              {
                title: '分析时间',
                dataIndex: 'timestamp',
                key: 'timestamp',
                render: (date) => new Date(date).toLocaleString()
              },
              {
                title: '操作',
                key: 'action',
                render: (_, record) => (
                  <Button 
                    type="link" 
                    size="small"
                    onClick={() => setCurrentAnalysis(record)}
                  >
                    查看详情
                  </Button>
                ),
              },
            ]}
            pagination={{ pageSize: 5 }}
          />
        </Card>
      )}
    </div>
  );
};

export default DataAnalysis;