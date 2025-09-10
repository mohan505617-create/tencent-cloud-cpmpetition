import React, { useState } from 'react'
import { 
  Card, 
  Button, 
  List, 
  Tag, 
  Modal, 
  Form, 
  Input, 
  ColorPicker, 
  message,
  Popconfirm,
  Empty,
  Progress,
  Avatar
} from 'antd'
import { 
  FolderIcon, 
  PlusIcon, 
  EditIcon, 
  TrashIcon, 
  FileTextIcon,
  BarChart3Icon
} from 'lucide-react'
// 已移除多语言支持

import { useKnowledgeStore } from '../store/knowledgeStore'

const Categories: React.FC = () => {
  // const t = useTranslate() // 暂时注释掉，因为i18n还未实现

  const { 
    categories, 
    documents,
    addCategory, 
    updateCategory, 
    deleteCategory,
    getDocumentsByCategory 
  } = useKnowledgeStore()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [form] = Form.useForm()

  const handleAddCategory = () => {
    setEditingCategory(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEditCategory = (category: any) => {
    setEditingCategory(category)
    form.setFieldsValue({
      name: category.name,
      description: category.description,
      color: category.color
    })
    setIsModalVisible(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      
      if (editingCategory) {
        updateCategory(editingCategory.id, values)
        message.success(t('categories.updateSuccess'))
      } else {
        addCategory(values)
        message.success(t('categories.createSuccess'))
      }
      
      setIsModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error(t('categories.messages.formValidationFailed'), error)
    }
  }

  const handleDeleteCategory = (categoryId: string) => {
    const docsInCategory = getDocumentsByCategory(categoryId)
    if (docsInCategory.length > 0) {
      message.warning(t('categories.messages.deleteWarning', { count: docsInCategory.length }))
      return
    }
    
    deleteCategory(categoryId)
    message.success(t('categories.messages.deleteSuccess'))
  }

  const getCategoryStats = (categoryId: string) => {
    const docs = getDocumentsByCategory(categoryId)
    const totalWords = docs.reduce((sum, doc) => sum + (doc.metadata?.wordCount || 0), 0)
    const recentDocs = docs.filter(doc => {
      const daysDiff = Math.floor((Date.now() - new Date(doc.updatedAt).getTime()) / (1000 * 60 * 60 * 24))
      return daysDiff <= 7
    }).length

    return {
      docCount: docs.length,
      totalWords,
      recentDocs
    }
  }

  const totalDocs = documents.length
  const maxDocsInCategory = Math.max(...categories.map(cat => getDocumentsByCategory(cat.id).length), 1)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('categories.title')}</h1>
          <p className="text-gray-600 mt-1">
            {t('categories.description')}, {t('common.total')} {categories.length} {t('common.categories')}
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusIcon size={16} />}
          onClick={handleAddCategory}
          className="bg-gradient-to-r from-blue-500 to-purple-600 border-0"
        >
          新建分类
        </Button>
      </div>

      {/* 分类统计概览 */}
      <Card className="glass-effect border-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
            <div className="text-sm text-gray-500">总分类数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{totalDocs}</div>
            <div className="text-sm text-gray-500">总文档数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(totalDocs / Math.max(categories.length, 1))}
            </div>
            <div className="text-sm text-gray-500">平均文档数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {categories.filter(cat => getDocumentsByCategory(cat.id).length > 0).length}
            </div>
            <div className="text-sm text-gray-500">活跃分类数</div>
          </div>
        </div>
      </Card>

      {/* 分类列表 */}
      {categories.length === 0 ? (
        <Card className="glass-effect border-0">
          <Empty
            description="暂无分类"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button 
              type="primary" 
              onClick={handleAddCategory}
              className="bg-gradient-to-r from-blue-500 to-purple-600 border-0"
            >
              创建第一个分类
            </Button>
          </Empty>
        </Card>
      ) : (
        <Card className="glass-effect border-0">
          <List
            dataSource={categories}
            renderItem={(category) => {
              const stats = getCategoryStats(category.id)
              const progressPercent = (stats.docCount / maxDocsInCategory) * 100

              return (
                <List.Item
                  className="hover:bg-blue-50 rounded-lg px-4 py-4 transition-colors"
                  actions={[
                    <Button
                      key="edit"
                      type="text"
                      icon={<EditIcon size={16} />}
                      onClick={() => handleEditCategory(category)}
                    />,
                    <Popconfirm
                      key="delete"
                      title="确认删除"
                      description={`确定要删除分类"${category.name}"吗？`}
                      onConfirm={() => handleDeleteCategory(category.id)}
                      okText="删除"
                      cancelText="取消"
                      okType="danger"
                    >
                      <Button
                        type="text"
                        danger
                        icon={<TrashIcon size={16} />}
                      />
                    </Popconfirm>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size="large"
                        style={{ backgroundColor: category.color }}
                        icon={<FolderIcon size={20} />}
                      />
                    }
                    title={
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-semibold">{category.name}</span>
                        <Tag color={category.color} className="text-white">
                          {stats.docCount} 篇文档
                        </Tag>
                        {stats.recentDocs > 0 && (
                          <Tag color="green">
                            {stats.recentDocs} 篇最近更新
                          </Tag>
                        )}
                      </div>
                    }
                    description={
                      <div className="space-y-3">
                        <p className="text-gray-600">
                          {category.description || '暂无描述'}
                        </p>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <FileTextIcon size={14} className="text-blue-500" />
                            <span>{stats.docCount} 篇文档</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <BarChart3Icon size={14} className="text-green-500" />
                            <span>{stats.totalWords.toLocaleString()} 字</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500">
                              活跃度: {Math.round(progressPercent)}%
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>文档数量分布</span>
                            <span>{stats.docCount} / {maxDocsInCategory}</span>
                          </div>
                          <Progress 
                            percent={progressPercent} 
                            showInfo={false}
                            strokeColor={{
                              '0%': category.color,
                              '100%': category.color + '80'
                            }}
                          />
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )
            }}
          />
        </Card>
      )}

      {/* 新建/编辑分类模态框 */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <FolderIcon size={18} />
            <span>{editingCategory ? '编辑分类' : '新建分类'}</span>
          </div>
        }
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        okText={editingCategory ? '更新' : '创建'}
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            color: '#1890ff'
          }}
        >
          <Form.Item
            name="name"
            label="分类名称"
            rules={[
              { required: true, message: '请输入分类名称' },
              { max: 20, message: '分类名称不能超过20个字符' }
            ]}
          >
            <Input placeholder="输入分类名称..." />
          </Form.Item>

          <Form.Item
            name="description"
            label="分类描述"
            rules={[
              { max: 100, message: '描述不能超过100个字符' }
            ]}
          >
            <Input.TextArea 
              rows={3} 
              placeholder="输入分类描述（可选）..." 
            />
          </Form.Item>

          <Form.Item
            name="color"
            label="分类颜色"
            rules={[{ required: true, message: '请选择分类颜色' }]}
          >
            <ColorPicker 
              showText 
              format="hex"
              presets={[
                {
                  label: '推荐颜色',
                  colors: [
                    '#1890ff', '#52c41a', '#722ed1', '#fa8c16',
                    '#eb2f96', '#13c2c2', '#faad14', '#f5222d'
                  ]
                }
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Categories