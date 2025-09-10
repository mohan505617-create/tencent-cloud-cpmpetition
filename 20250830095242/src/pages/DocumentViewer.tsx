import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { 
  Card, 
  Button, 
  Tag, 
  Breadcrumb, 
  Input, 
  Select, 
  message, 
  Modal,
  Tooltip,
  Divider
} from 'antd'
import { 
  ArrowLeftIcon, 
  EditIcon, 
  StarIcon, 
  ShareIcon, 

  SaveIcon,
  EyeIcon,
  ClockIcon,
  TagIcon,
  FolderIcon
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { useKnowledgeStore } from '../store/knowledgeStore'
// 已移除多语言支持
import dayjs from 'dayjs'

const { TextArea } = Input
const { Option } = Select

const DocumentViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isEditMode = searchParams.get('mode') === 'edit'
  // const t = useTranslate() // 暂时注释掉，因为i18n还未实现

  const { 
    documents, 
    categories, 
    tags,
    updateDocument,
    deleteDocument 
  } = useKnowledgeStore()

  const [document, setDocument] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(isEditMode)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editTags, setEditTags] = useState<string[]>([])

  useEffect(() => {
    if (id) {
      const doc = documents.find(d => d.id === id)
      if (doc) {
        setDocument(doc)
        setEditTitle(doc.title)
        setEditContent(doc.content)
        setEditCategory(doc.category)
        setEditTags(doc.tags)
      } else {
        message.error(t('documentViewer.errors.notFound'))
        navigate('/documents')
      }
    }
  }, [id, documents, navigate])

  const handleSave = () => {
    if (!editTitle.trim() || !editContent.trim()) {
      message.warning(t('documentViewer.errors.emptyFields'))
      return
    }

    updateDocument(id!, {
      title: editTitle.trim(),
      content: editContent.trim(),
      category: editCategory,
      tags: editTags,
      metadata: {
        ...document.metadata,
        wordCount: editContent.trim().length,
        readingTime: Math.ceil(editContent.trim().length / 200)
      }
    })

    setIsEditing(false)
    message.success(t('documentViewer.messages.saved'))
  }

  const handleToggleFavorite = () => {
    updateDocument(id!, { isFavorite: !document.isFavorite })
    setDocument({ ...document, isFavorite: !document.isFavorite })
    message.success(document.isFavorite ? t('documentViewer.messages.unfavorited') : t('documentViewer.messages.favorited'))
  }

  const handleDelete = () => {
    Modal.confirm({
      title: t('documentViewer.delete.title'),
      content: t('documentViewer.delete.content', { title: document.title }),
      okText: t('documentViewer.delete.confirm'),
      okType: 'danger',
      cancelText: t('documentViewer.delete.cancel'),
      onOk: () => {
        deleteDocument(id!)
        message.success(t('documentViewer.messages.deleted'))
        navigate('/documents')
      }
    })
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category?.name || t('documentViewer.uncategorized')
  }

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category?.color || '#gray'
  }

  if (!document) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">{t('documentViewer.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 面包屑导航 */}
      <Breadcrumb
        items={[
          {
            title: <Button type="link" onClick={() => navigate('/documents')}>{t('documentViewer.breadcrumb.documentList')}</Button>
          },
          {
            title: document.title
          }
        ]}
      />

      {/* 文档头部 */}
      <Card className="glass-effect border-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button
              icon={<ArrowLeftIcon size={16} />}
              onClick={() => navigate('/documents')}
            >
              {t('documentViewer.actions.back')}
            </Button>
            
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: getCategoryColor(document.category) }}
              />
              <span className="text-sm text-gray-600">
                {getCategoryName(document.category)}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Tooltip title={document.isFavorite ? t('documentViewer.tooltips.unfavorite') : t('documentViewer.tooltips.favorite')}>
              <Button
                type={document.isFavorite ? 'primary' : 'default'}
                icon={<StarIcon size={16} />}
                onClick={handleToggleFavorite}
              />
            </Tooltip>
            
            <Button
              type={isEditing ? 'default' : 'primary'}
              icon={isEditing ? <EyeIcon size={16} /> : <EditIcon size={16} />}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? t('documentViewer.actions.preview') : t('documentViewer.actions.edit')}
            </Button>

            <Button
              icon={<ShareIcon size={16} />}
              onClick={() => message.info(t('documentViewer.messages.shareInDevelopment'))}
            >
              {t('documentViewer.actions.share')}
            </Button>

            <Button
              danger
              onClick={handleDelete}
            >
              {t('documentViewer.actions.delete')}
            </Button>
          </div>
        </div>

        {/* 文档元信息 */}
        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <ClockIcon size={14} />
            <span>{t('documentViewer.metadata.createdAt', { date: dayjs(document.createdAt).format('YYYY-MM-DD HH:mm') })}</span>
          </div>
          <div className="flex items-center space-x-1">
            <ClockIcon size={14} />
            <span>{t('documentViewer.metadata.updatedAt', { date: dayjs(document.updatedAt).format('YYYY-MM-DD HH:mm') })}</span>
          </div>
          <span>{t('documentViewer.metadata.wordCount', { count: document.metadata?.wordCount || 0 })}</span>
          <span>{t('documentViewer.metadata.readingTime', { time: document.metadata?.readingTime || 1 })}</span>
        </div>

        {/* 标签 */}
        <div className="flex items-center space-x-2">
          <TagIcon size={16} className="text-gray-400" />
          <div className="flex flex-wrap gap-1">
            {document.tags.map((tag: string) => (
              <Tag key={tag} color="blue">
                {tag}
              </Tag>
            ))}
          </div>
        </div>
      </Card>

      {/* 文档内容 */}
      <Card className="glass-effect border-0">
        {isEditing ? (
          <div className="space-y-4">
            {/* 编辑模式 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标题
              </label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                size="large"
                placeholder="输入文档标题..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FolderIcon size={16} className="inline mr-1" />
                  分类
                </label>
                <Select
                  value={editCategory}
                  onChange={setEditCategory}
                  className="w-full"
                  size="large"
                >
                  {categories.map(category => (
                    <Option key={category.id} value={category.id}>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span>{category.name}</span>
                      </div>
                    </Option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TagIcon size={16} className="inline mr-1" />
                  标签
                </label>
                <Select
                  mode="tags"
                  value={editTags}
                  onChange={setEditTags}
                  className="w-full"
                  size="large"
                  placeholder="选择或输入标签..."
                >
                  {tags.map(tag => (
                    <Option key={tag} value={tag}>{tag}</Option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                内容 (支持 Markdown)
              </label>
              <TextArea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={20}
                placeholder="输入文档内容，支持 Markdown 语法..."
                className="font-mono"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button onClick={() => setIsEditing(false)}>
                取消
              </Button>
              <Button
                type="primary"
                icon={<SaveIcon size={16} />}
                onClick={handleSave}
                className="bg-gradient-to-r from-blue-500 to-purple-600 border-0"
              >
                保存
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {/* 查看模式 */}
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {document.title}
            </h1>
            
            <Divider />
            
            <div className="markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {document.content}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </Card>

      {/* 相关文档推荐 */}
      {!isEditing && (
        <Card 
          title="相关文档"
          className="glass-effect border-0"
        >
          <div className="text-center text-gray-500 py-8">
            <p>相关文档推荐功能开发中...</p>
            <p className="text-sm">将基于标签和内容相似度推荐相关文档</p>
          </div>
        </Card>
      )}
    </div>
  )
}

export default DocumentViewer