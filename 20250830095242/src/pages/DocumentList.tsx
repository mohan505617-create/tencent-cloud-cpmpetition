import React, { useState, useMemo } from 'react'
import { 
  Card, 
  List, 
  Tag, 
  Button, 
  Select, 
  Input, 
  Avatar, 
  Dropdown, 
  Modal, 
  message,
  Empty,
  Pagination
} from 'antd'
import { 
  FileTextIcon, 
  StarIcon, 
  MoreVerticalIcon, 
  EditIcon, 
  TrashIcon, 
  ArchiveIcon,
  EyeIcon,

} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useKnowledgeStore } from '../store/knowledgeStore'
// 已移除多语言支持
import dayjs from 'dayjs'

const { Option } = Select
const { Search } = Input

const DocumentList: React.FC = () => {
  const navigate = useNavigate()
  // const t = useTranslate() // 暂时注释掉，因为i18n还未实现
  const { 
    documents, 
    categories, 
    tags,
    updateDocument,
    deleteDocument,
    toggleQuickCapture
  } = useKnowledgeStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'title'>('updated')

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(12)

  // 过滤和排序文档
  const filteredDocuments = useMemo(() => {
    let filtered = documents.filter(doc => {
      // 搜索过滤
      const matchesSearch = !searchTerm || 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      // 分类过滤
      const matchesCategory = selectedCategory === 'all' || 
        selectedCategory === 'favorites' && doc.isFavorite ||
        selectedCategory === 'archived' && doc.isArchived ||
        doc.category === selectedCategory

      // 标签过滤
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => doc.tags.includes(tag))

      return matchesSearch && matchesCategory && matchesTags
    })

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'updated':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }
    })

    return filtered
  }, [documents, searchTerm, selectedCategory, selectedTags, sortBy])

  // 分页数据
  const paginatedDocuments = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredDocuments.slice(startIndex, startIndex + pageSize)
  }, [filteredDocuments, currentPage, pageSize])

  const handleToggleFavorite = (docId: string, isFavorite: boolean) => {
    updateDocument(docId, { isFavorite: !isFavorite })
    message.success(isFavorite ? t('documentList.messages.unfavorited') : t('documentList.messages.favorited'))
  }

  const handleArchive = (docId: string, isArchived: boolean) => {
    updateDocument(docId, { isArchived: !isArchived })
    message.success(isArchived ? t('documentList.messages.unarchived') : t('documentList.messages.archived'))
  }

  const handleDelete = (docId: string, title: string) => {
    Modal.confirm({
      title: t('documentList.delete.title'),
      content: t('documentList.delete.content', { title }),
      okText: t('documentList.delete.confirm'),
      okType: 'danger',
      cancelText: t('documentList.delete.cancel'),
      onOk: () => {
        deleteDocument(docId)
        message.success(t('documentList.messages.deleted'))
      }
    })
  }

  const getDocumentMenuItems = (doc: any) => [
    {
      key: 'view',
      icon: <EyeIcon size={16} />,
      label: t('documentList.menu.view'),
      onClick: () => navigate(`/document/${doc.id}`)
    },
    {
      key: 'edit',
      icon: <EditIcon size={16} />,
      label: t('documentList.menu.edit'),
      onClick: () => navigate(`/document/${doc.id}?mode=edit`)
    },
    {
      key: 'favorite',
      icon: <StarIcon size={16} />,
      label: doc.isFavorite ? t('documentList.menu.unfavorite') : t('documentList.menu.favorite'),
      onClick: () => handleToggleFavorite(doc.id, doc.isFavorite)
    },
    {
      key: 'archive',
      icon: <ArchiveIcon size={16} />,
      label: doc.isArchived ? t('documentList.menu.unarchive') : t('documentList.menu.archive'),
      onClick: () => handleArchive(doc.id, doc.isArchived)
    },
    {
      type: 'divider' as const
    },
    {
      key: 'delete',
      icon: <TrashIcon size={16} />,
      label: t('documentList.menu.delete'),
      danger: true,
      onClick: () => handleDelete(doc.id, doc.title)
    }
  ]

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category?.name || t('documentList.uncategorized')
  }

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category?.color || '#gray'
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">文档列表</h1>
          <p className="text-gray-600 mt-1">
            共 {filteredDocuments.length} 篇文档
          </p>
        </div>
        <Button
          type="primary"
          icon={<FileTextIcon size={16} />}
          onClick={toggleQuickCapture}
          className="bg-gradient-to-r from-blue-500 to-purple-600 border-0"
        >
          新建文档
        </Button>
      </div>

      {/* 过滤和搜索 */}
      <Card className="glass-effect border-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Search
            placeholder="搜索文档..."
            allowClear
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          
          <Select
            value={selectedCategory}
            onChange={setSelectedCategory}
            className="w-full"
            placeholder="选择分类"
          >
            <Option value="all">全部分类</Option>
            <Option value="favorites">收藏夹</Option>
            <Option value="archived">归档</Option>
            {categories.map(cat => (
              <Option key={cat.id} value={cat.id}>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: cat.color }}
                  />
                  <span>{cat.name}</span>
                </div>
              </Option>
            ))}
          </Select>

          <Select
            mode="multiple"
            value={selectedTags}
            onChange={setSelectedTags}
            className="w-full"
            placeholder="选择标签"
            maxTagCount={2}
          >
            {tags.map(tag => (
              <Option key={tag} value={tag}>{tag}</Option>
            ))}
          </Select>

          <Select
            value={sortBy}
            onChange={setSortBy}
            className="w-full"
          >
            <Option value="updated">按更新时间</Option>
            <Option value="created">按创建时间</Option>
            <Option value="title">按标题</Option>
          </Select>
        </div>
      </Card>

      {/* 文档列表 */}
      {filteredDocuments.length === 0 ? (
        <Card className="glass-effect border-0">
          <Empty
            description="暂无文档"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button 
              type="primary" 
              onClick={toggleQuickCapture}
              className="bg-gradient-to-r from-blue-500 to-purple-600 border-0"
            >
              创建第一篇文档
            </Button>
          </Empty>
        </Card>
      ) : (
        <>
          <Card className="glass-effect border-0">
            <List
              dataSource={paginatedDocuments}
              renderItem={(doc) => (
                <List.Item
                  className="hover:bg-blue-50 rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 border-b border-gray-100 last:border-b-0"
                  actions={[
                    <Dropdown
                      key="more"
                      menu={{ items: getDocumentMenuItems(doc) }}
                      trigger={['click']}
                    >
                      <Button
                        type="text"
                        icon={<MoreVerticalIcon size={16} />}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Dropdown>
                  ]}
                  onClick={() => navigate(`/document/${doc.id}`)}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        className="bg-gradient-to-br from-blue-500 to-purple-600"
                        size="large"
                      >
                        {doc.title.charAt(0)}
                      </Avatar>
                    }
                    title={
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-lg">{doc.title}</span>
                        {doc.isFavorite && (
                          <StarIcon size={16} className="text-yellow-500" />
                        )}
                        {doc.isArchived && (
                          <ArchiveIcon size={16} className="text-gray-500" />
                        )}
                      </div>
                    }
                    description={
                      <div className="space-y-2">
                        <p className="text-gray-600 line-clamp-2">
                          {doc.content.substring(0, 150)}...
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>
                              更新于 {dayjs(doc.updatedAt).format('MM-DD HH:mm')}
                            </span>
                            <span>•</span>
                            <span>{doc.metadata?.wordCount || 0} 字</span>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                              <div 
                                className="w-2 h-2 rounded-full" 
                                style={{ backgroundColor: getCategoryColor(doc.category) }}
                              />
                              <span>{getCategoryName(doc.category)}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {doc.tags.slice(0, 3).map(tag => (
                              <Tag key={tag} color="blue">
                                {tag}
                              </Tag>
                            ))}
                            {doc.tags.length > 3 && (
                              <Tag color="default">
                                +{doc.tags.length - 3}
                              </Tag>
                            )}
                          </div>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>

          {/* 分页 */}
          {filteredDocuments.length > pageSize && (
            <div className="flex justify-center">
              <Pagination
                current={currentPage}
                total={filteredDocuments.length}
                pageSize={pageSize}
                onChange={setCurrentPage}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total, range) => 
                  `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                }
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default DocumentList