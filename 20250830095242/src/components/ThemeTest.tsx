import React from 'react';
import { Card, Typography, Space, Button } from 'antd';
import { SunOutlined, MoonOutlined, BulbOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ThemeTest: React.FC = () => {
  const testTheme = (theme: 'light' | 'dark' | 'auto') => {
    document.documentElement.setAttribute('data-theme', theme);
  };

  const testColor = (color: string) => {
    document.documentElement.style.setProperty('--primary-color', color);
  };

  const testFontSize = (size: number) => {
    document.documentElement.style.setProperty('--font-size-base', `${size}px`);
    
    // 移除之前的字体大小类
    document.body.classList.remove('font-size-small', 'font-size-medium', 'font-size-large', 'font-size-xlarge');
    
    // 添加对应的字体大小类
    const fontSizeMap: { [key: number]: string } = {
      12: 'font-size-small',
      14: 'font-size-medium',
      16: 'font-size-large', 
      18: 'font-size-xlarge'
    };
    const fontSizeClass = fontSizeMap[size] || 'font-size-medium';
    document.body.classList.add(fontSizeClass);
  };

  return (
    <Card title="主题测试组件" style={{ margin: '20px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={4}>主题模式测试</Title>
          <Space>
            <Button 
              icon={<SunOutlined />} 
              onClick={() => testTheme('light')}
            >
              浅色模式
            </Button>
            <Button 
              icon={<MoonOutlined />} 
              onClick={() => testTheme('dark')}
            >
              深色模式
            </Button>
            <Button 
              icon={<BulbOutlined />} 
              onClick={() => testTheme('auto')}
            >
              自动模式
            </Button>
          </Space>
        </div>

        <div>
          <Title level={4}>主题色彩测试</Title>
          <Space>
            <Button 
              style={{ backgroundColor: '#1890ff', color: 'white' }}
              onClick={() => testColor('#1890ff')}
            >
              城大蓝
            </Button>
            <Button 
              style={{ backgroundColor: '#52c41a', color: 'white' }}
              onClick={() => testColor('#52c41a')}
            >
              学术绿
            </Button>
            <Button 
              style={{ backgroundColor: '#faad14', color: 'white' }}
              onClick={() => testColor('#faad14')}
            >
              创新橙
            </Button>
            <Button 
              style={{ backgroundColor: '#722ed1', color: 'white' }}
              onClick={() => testColor('#722ed1')}
            >
              智慧紫
            </Button>
            <Button 
              style={{ backgroundColor: '#f5222d', color: 'white' }}
              onClick={() => testColor('#f5222d')}
            >
              经典红
            </Button>
          </Space>
        </div>

        <div>
          <Title level={4}>字体大小测试</Title>
          <Space>
            <Button onClick={() => testFontSize(12)}>小号 (12px)</Button>
            <Button onClick={() => testFontSize(14)}>中号 (14px)</Button>
            <Button onClick={() => testFontSize(16)}>大号 (16px)</Button>
            <Button onClick={() => testFontSize(18)}>特大号 (18px)</Button>
          </Space>
        </div>

        <div>
          <Title level={4}>效果预览</Title>
          <Text>这是一段示例文本，用于测试主题和字体大小的效果。</Text>
          <br />
          <Text type="secondary">这是次要文本，用于测试颜色对比度。</Text>
        </div>
      </Space>
    </Card>
  );
};

export default ThemeTest;