import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Switch,
  Select,
  Button,
  Row,
  Col,
  Divider,
  Typography,
  Space,
  Alert,
  message,
  Slider,
  Radio,
  Checkbox,
  InputNumber,
  Tooltip
} from 'antd';
import {
  SettingOutlined,
  BulbOutlined,
  BellOutlined,
  GlobalOutlined,
  SecurityScanOutlined,
  SaveOutlined,
  ReloadOutlined,
  MoonOutlined,
  SunOutlined,
  MailOutlined,
  MobileOutlined,
  EyeOutlined,
  LockOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface UserSettings {
  // 主题设置
  theme: 'light' | 'dark' | 'auto';
  primaryColor: string;
  fontSize: number;
  
  // 通知设置
  emailNotifications: boolean;
  pushNotifications: boolean;
  assignmentReminders: boolean;
  courseUpdates: boolean;
  mentorMessages: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  
  // 区域设置
  dateFormat: string;
  timezone: string;
  
  // 隐私设置
  profileVisibility: 'public' | 'university' | 'private';
  showAchievements: boolean;
  showMentorInfo: boolean;
  allowDirectMessages: boolean;
  
  // 学习偏好
  autoSave: boolean;
  autoBackup: boolean;
  defaultNoteFormat: 'markdown' | 'rich-text';
  showTips: boolean;
}

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // 使用ThemeContext
  const { 
    当前主题: currentTheme, 
    主色调: primaryColor, 
    字体大小: fontSize, 
    是否深色模式: isDarkMode,
    设置主题: setTheme, 
    设置主色调: setPrimaryColor, 
    设置字体大小: setFontSize,
    切换主题: toggleTheme 
  } = useTheme();
  
  // 默认设置
  const [settings, setSettings] = useState<UserSettings>({
    theme: currentTheme,
    primaryColor: primaryColor,
    fontSize: fontSize,
    emailNotifications: true,
    pushNotifications: true,
    assignmentReminders: true,
    courseUpdates: true,
    mentorMessages: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    },
    dateFormat: 'YYYY-MM-DD',
    timezone: 'Asia/Hong_Kong',
    profileVisibility: 'university',
    showAchievements: true,
    showMentorInfo: true,
    allowDirectMessages: true,
    autoSave: true,
    autoBackup: true,
    defaultNoteFormat: 'markdown',
    showTips: true
  });

  useEffect(() => {
    // 从localStorage加载设置
    const savedSettings = localStorage.getItem('user-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        const mergedSettings = { 
          ...settings, 
          ...parsed,
          // 确保主题设置与ThemeContext同步
          theme: currentTheme,
          primaryColor: primaryColor,
          fontSize: fontSize
        };
        setSettings(mergedSettings);
        form.setFieldsValue(mergedSettings);
      } catch (error) {
        console.error('Failed to load settings:', error);
        const defaultSettings = {
          ...settings,
          theme: currentTheme,
          primaryColor: primaryColor,
          fontSize: fontSize
        };
        setSettings(defaultSettings);
        form.setFieldsValue(defaultSettings);
      }
    } else {
      const defaultSettings = {
        ...settings,
        theme: currentTheme,
        primaryColor: primaryColor,
        fontSize: fontSize
      };
      setSettings(defaultSettings);
      form.setFieldsValue(defaultSettings);
    }
  }, [currentTheme, primaryColor, fontSize]);

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 保存到localStorage
      localStorage.setItem('user-settings', JSON.stringify(values));
      setSettings(values);
      setHasChanges(false);
      
      message.success('设置保存成功');
    } catch (error) {
      message.error('设置保存失败');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    const defaultSettings: UserSettings = {
      theme: 'light',
      primaryColor: '#1890ff',
      fontSize: 14,
      emailNotifications: true,
      pushNotifications: true,
      assignmentReminders: true,
      courseUpdates: true,
      mentorMessages: true,
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
      },
      dateFormat: 'YYYY-MM-DD',
      timezone: 'Asia/Hong_Kong',
      profileVisibility: 'university',
      showAchievements: true,
      showMentorInfo: true,
      allowDirectMessages: true,
      autoSave: true,
      autoBackup: true,
      defaultNoteFormat: 'markdown',
      showTips: true
    };
    
    form.setFieldsValue(defaultSettings);
    setHasChanges(true);
  };

  const onValuesChange = (changedValues: any, allValues: any) => {
    setHasChanges(true);
    
    // 实时应用主题相关设置
    if (changedValues.theme !== undefined) {
      setTheme(changedValues.theme);
      const themeNames = {
        'light': '浅色模式',
        'dark': '深色模式', 
        'auto': '自动模式'
      };
      message.success(`主题模式已切换为: ${themeNames[changedValues.theme as keyof typeof themeNames]}`);
    }
    
    if (changedValues.primaryColor !== undefined) {
      setPrimaryColor(changedValues.primaryColor);
      const colorNames: { [key: string]: string } = {
        '#1890ff': '城大蓝',
        '#52c41a': '学术绿',
        '#faad14': '创新橙', 
        '#722ed1': '智慧紫',
        '#f5222d': '经典红'
      };
      message.success(`主题色彩已切换为: ${colorNames[changedValues.primaryColor] || '自定义'}`);
    }
    
    if (changedValues.fontSize !== undefined) {
      setFontSize(changedValues.fontSize);
      const sizeNames: { [key: number]: string } = {
        12: '小号',
        14: '中号',
        16: '大号',
        18: '特大号'
      };
      message.success(`字体大小已调整为: ${sizeNames[changedValues.fontSize] || '自定义'}`);
    }
    
    // 更新本地设置状态
    const newSettings = { ...settings, ...allValues };
    setSettings(newSettings);
    
    // 保存非主题设置到localStorage
    const currentSettings = JSON.parse(localStorage.getItem('user-settings') || '{}');
    const updatedSettings = { ...currentSettings, ...allValues };
    localStorage.setItem('user-settings', JSON.stringify(updatedSettings));
  };

  const themeColors = [
    { label: '城大蓝', value: '#1890ff', color: '#1890ff' },
    { label: '学术绿', value: '#52c41a', color: '#52c41a' },
    { label: '创新橙', value: '#faad14', color: '#faad14' },
    { label: '智慧紫', value: '#722ed1', color: '#722ed1' },
    { label: '经典红', value: '#f5222d', color: '#f5222d' },
  ];

  return (
    <div className="settings-container fade-in" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* 页面头部 */}
      <Card className="university-header" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #722ed1 0%, #1890ff 100%)', color: 'white' }}>
        <Row align="middle">
          <Col flex="auto">
            <Space size="large">
              <div style={{ fontSize: '48px' }}>⚙️</div>
              <div>
                <Title level={2} style={{ color: 'white', margin: 0 }}>
                  系统设置
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
                  个性化您的学习环境
                </Text>
                <br />
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                  自定义主题、通知和隐私设置
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button 
                type="primary" 
                ghost 
                icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
                onClick={toggleTheme}
                title="切换主题"
              >
                {isDarkMode ? '浅色模式' : '深色模式'}
              </Button>
              <Button 
                type="primary" 
                ghost 
                icon={<ReloadOutlined />}
                onClick={handleReset}
              >
                恢复默认
              </Button>
              <Button 
                type="primary" 
                ghost 
                icon={<SaveOutlined />}
                onClick={() => form.submit()}
                loading={loading}
                disabled={!hasChanges}
              >
                保存设置
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        onValuesChange={onValuesChange}
        initialValues={settings}
      >
        <Row gutter={[24, 24]}>
          {/* 左侧 - 外观设置 */}
          <Col xs={24} lg={12}>
            {/* 主题设置 */}
            <Card 
              title={
                <Space>
                  <BulbOutlined />
                  外观主题
                </Space>
              }
              className="hover-lift"
              style={{ marginBottom: '24px' }}
            >
              <Form.Item name="theme" label="主题模式">
                <Radio.Group>
                  <Radio.Button value="light">
                    <Space>
                      <SunOutlined />
                      浅色模式
                    </Space>
                  </Radio.Button>
                  <Radio.Button value="dark">
                    <Space>
                      <MoonOutlined />
                      深色模式
                    </Space>
                  </Radio.Button>
                  <Radio.Button value="auto">
                    自动切换
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>

              <Form.Item name="primaryColor" label="主题色彩">
                <Radio.Group>
                  {themeColors.map(color => (
                    <Radio.Button key={color.value} value={color.value}>
                      <Space>
                        <div 
                          style={{ 
                            width: '12px', 
                            height: '12px', 
                            backgroundColor: color.color, 
                            borderRadius: '50%' 
                          }} 
                        />
                        {color.label}
                      </Space>
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </Form.Item>

              <Form.Item name="fontSize" label="字体大小">
                <Slider
                  min={12}
                  max={18}
                  marks={{
                    12: '小',
                    14: '中',
                    16: '大',
                    18: '特大'
                  }}
                />
              </Form.Item>
            </Card>

            {/* 区域设置 */}
            <Card 
              title={
                <Space>
                  <GlobalOutlined />
                  区域设置
                </Space>
              }
              className="hover-lift"
              style={{ marginBottom: '24px' }}
            >
              <Form.Item name="timezone" label="时区设置">
                <Select>
                  <Option value="Asia/Hong_Kong">香港时间 (GMT+8)</Option>
                  <Option value="Asia/Shanghai">北京时间 (GMT+8)</Option>
                  <Option value="UTC">协调世界时 (UTC)</Option>
                </Select>
              </Form.Item>

              <Form.Item name="dateFormat" label="日期格式">
                <Select>
                  <Option value="YYYY-MM-DD">2024-01-01</Option>
                  <Option value="DD/MM/YYYY">01/01/2024</Option>
                  <Option value="MM/DD/YYYY">01/01/2024 (美式)</Option>
                  <Option value="YYYY年MM月DD日">2024年01月01日</Option>
                </Select>
              </Form.Item>
            </Card>

            {/* 学习偏好 */}
            <Card 
              title={
                <Space>
                  <SettingOutlined />
                  学习偏好
                </Space>
              }
              className="hover-lift"
            >
              <Form.Item name="autoSave" valuePropName="checked">
                <Checkbox>自动保存笔记</Checkbox>
              </Form.Item>

              <Form.Item name="autoBackup" valuePropName="checked">
                <Checkbox>自动备份数据</Checkbox>
              </Form.Item>

              <Form.Item name="defaultNoteFormat" label="默认笔记格式">
                <Radio.Group>
                  <Radio value="markdown">Markdown</Radio>
                  <Radio value="rich-text">富文本</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item name="showTips" valuePropName="checked">
                <Checkbox>显示使用提示</Checkbox>
              </Form.Item>
            </Card>
          </Col>

          {/* 右侧 - 通知与隐私 */}
          <Col xs={24} lg={12}>
            {/* 通知设置 */}
            <Card 
              title={
                <Space>
                  <BellOutlined />
                  通知设置
                </Space>
              }
              className="hover-lift"
              style={{ marginBottom: '24px' }}
            >
              <Alert
                message="通知提醒"
                description="合理设置通知可以帮助您及时了解课程动态和导师消息，提升学习效率。"
                type="info"
                showIcon
                style={{ marginBottom: '16px' }}
              />

              <Form.Item name="emailNotifications" valuePropName="checked">
                <Checkbox>
                  <Space>
                    <MailOutlined />
                    邮件通知
                  </Space>
                </Checkbox>
              </Form.Item>

              <Form.Item name="pushNotifications" valuePropName="checked">
                <Checkbox>
                  <Space>
                    <MobileOutlined />
                    推送通知
                  </Space>
                </Checkbox>
              </Form.Item>

              <Divider />

              <Text strong>通知类型：</Text>
              <div style={{ marginTop: '12px' }}>
                <Form.Item name="assignmentReminders" valuePropName="checked">
                  <Checkbox>作业提醒</Checkbox>
                </Form.Item>

                <Form.Item name="courseUpdates" valuePropName="checked">
                  <Checkbox>课程更新</Checkbox>
                </Form.Item>

                <Form.Item name="mentorMessages" valuePropName="checked">
                  <Checkbox>导师消息</Checkbox>
                </Form.Item>
              </div>

              <Divider />

              <Form.Item name={['quietHours', 'enabled']} valuePropName="checked">
                <Checkbox>启用免打扰时间</Checkbox>
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name={['quietHours', 'start']} label="开始时间">
                    <Select defaultValue="22:00">
                      <Option value="20:00">20:00</Option>
                      <Option value="21:00">21:00</Option>
                      <Option value="22:00">22:00</Option>
                      <Option value="23:00">23:00</Option>
                      <Option value="00:00">00:00</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name={['quietHours', 'end']} label="结束时间">
                    <Select defaultValue="08:00">
                      <Option value="06:00">06:00</Option>
                      <Option value="07:00">07:00</Option>
                      <Option value="08:00">08:00</Option>
                      <Option value="09:00">09:00</Option>
                      <Option value="10:00">10:00</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* 隐私设置 */}
            <Card 
              title={
                <Space>
                  <SecurityScanOutlined />
                  隐私与安全
                </Space>
              }
              className="hover-lift"
            >
              <Alert
                message="隐私保护"
                description="香港城市大学重视您的隐私安全，您可以自主控制个人信息的可见范围。"
                type="warning"
                showIcon
                style={{ marginBottom: '16px' }}
              />

              <Form.Item name="profileVisibility" label="个人资料可见性">
                <Radio.Group>
                  <Radio value="public">
                    <Space>
                      <EyeOutlined />
                      公开可见
                    </Space>
                  </Radio>
                  <Radio value="university">
                    <Space>
                      <LockOutlined />
                      仅校内可见
                    </Space>
                  </Radio>
                  <Radio value="private">
                    <Space>
                      <LockOutlined />
                      完全私密
                    </Space>
                  </Radio>
                </Radio.Group>
              </Form.Item>

              <Divider />

              <Text strong>信息显示控制：</Text>
              <div style={{ marginTop: '12px' }}>
                <Form.Item name="showAchievements" valuePropName="checked">
                  <Checkbox>显示学术成就</Checkbox>
                </Form.Item>

                <Form.Item name="showMentorInfo" valuePropName="checked">
                  <Checkbox>显示导师信息</Checkbox>
                </Form.Item>

                <Form.Item name="allowDirectMessages" valuePropName="checked">
                  <Checkbox>允许私信联系</Checkbox>
                </Form.Item>
              </div>

              <Divider />

              <Space direction="vertical" style={{ width: '100%' }}>
                <Button type="link" size="small">
                  数据导出
                </Button>
                <Button type="link" size="small" danger>
                  删除账户
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </Form>

      {/* 页面底部 */}
      <Card style={{ marginTop: '24px', textAlign: 'center', background: '#f8f9fa' }}>
        <Text type="secondary">
          © 2024 香港城市大学 EduAI Hub | 
          <Button type="link" size="small" onClick={() => navigate('/profile')}>
            个人资料
          </Button> |
          <Button type="link" size="small" onClick={() => navigate('/')}>
            返回首页
          </Button>
        </Text>
      </Card>
    </div>
  );
};

export default Settings;