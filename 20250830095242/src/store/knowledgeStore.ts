import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface Document {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  type: 'markdown' | 'note' | 'image' | 'audio' | 'web-clip'
  metadata?: {
    wordCount?: number
    readingTime?: number
    links?: string[]
    backlinks?: string[]
  }
  isFavorite: boolean
  isArchived: boolean
}

export interface Category {
  id: string
  name: string
  color: string
  description?: string
  parentId?: string
  children?: Category[]
}

export interface KnowledgeState {
  documents: Document[]
  categories: Category[]
  tags: string[]
  searchQuery: string
  selectedCategory: string | null
  selectedTags: string[]
  theme: 'light' | 'dark'
  sidebarCollapsed: boolean
  quickCaptureVisible: boolean
  
  // Actions
  addDocument: (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateDocument: (id: string, updates: Partial<Document>) => void
  deleteDocument: (id: string) => void
  addCategory: (category: Omit<Category, 'id'>) => void
  updateCategory: (id: string, updates: Partial<Category>) => void
  deleteCategory: (id: string) => void
  setSearchQuery: (query: string) => void
  setSelectedCategory: (categoryId: string | null) => void
  setSelectedTags: (tags: string[]) => void
  toggleTheme: () => void
  toggleSidebar: () => void
  toggleQuickCapture: () => void
  getDocumentsByCategory: (categoryId: string) => Document[]
  getDocumentsByTag: (tag: string) => Document[]
  searchDocuments: (query: string) => Document[]
}

export const useKnowledgeStore = create<KnowledgeState>()(
  persist(
    immer((set, get) => ({
      documents: [
        {
          id: '1',
          title: '欢迎使用个人知识管理工具',
          content: `# 欢迎使用个人知识管理工具

## 功能特色

### 📝 快速笔记捕获
- 支持多格式输入（文本、图像、音频、网页剪藏）
- 快捷键快速记录想法
- 自动分类和标签生成

### 🔗 双向链接系统
- 建立知识点之间的关联
- 知识图谱可视化
- 智能推荐相关内容

### 🔍 智能搜索
- 全文搜索和高级查询
- AI驱动的语义搜索
- 内容摘要和推荐

### 📊 数据分析
- 使用统计和活跃度分析
- 知识健康检查
- 个性化推荐

## 开始使用

1. 点击左侧边栏的"新建文档"开始创建您的第一篇笔记
2. 使用标签和分类来组织您的知识
3. 利用搜索功能快速找到所需信息
4. 通过快捷键 \`Ctrl+K\` 快速捕获想法

祝您使用愉快！`,
          category: 'getting-started',
          tags: ['欢迎', '教程', '入门'],
          createdAt: new Date(),
          updatedAt: new Date(),
          type: 'markdown',
          metadata: {
            wordCount: 200,
            readingTime: 2,
            links: [],
            backlinks: []
          },
          isFavorite: true,
          isArchived: false
        }
      ],
      categories: [
        {
          id: 'getting-started',
          name: '入门指南',
          color: '#52c41a',
          description: '新用户入门和使用指南'
        },
        {
          id: 'work',
          name: '工作笔记',
          color: '#1890ff',
          description: '工作相关的笔记和文档'
        },
        {
          id: 'personal',
          name: '个人学习',
          color: '#722ed1',
          description: '个人学习和成长记录'
        },
        {
          id: 'ideas',
          name: '想法灵感',
          color: '#fa8c16',
          description: '创意想法和灵感记录'
        }
      ],
      tags: ['欢迎', '教程', '入门', '工作', '学习', '想法'],
      searchQuery: '',
      selectedCategory: null,
      selectedTags: [],
      theme: 'light',
      sidebarCollapsed: false,
      quickCaptureVisible: false,

      addDocument: (documentData) => {
        set((state) => {
          const newDocument: Document = {
            ...documentData,
            id: Date.now().toString(),
            createdAt: new Date(),
            updatedAt: new Date(),
            metadata: {
              wordCount: documentData.content.length,
              readingTime: Math.ceil(documentData.content.length / 200),
              links: [],
              backlinks: []
            }
          }
          state.documents.push(newDocument)
          
          // 自动添加新标签
          documentData.tags.forEach(tag => {
            if (!state.tags.includes(tag)) {
              state.tags.push(tag)
            }
          })
        })
      },

      updateDocument: (id, updates) => {
        set((state) => {
          const index = state.documents.findIndex(doc => doc.id === id)
          if (index !== -1) {
            state.documents[index] = {
              ...state.documents[index],
              ...updates,
              updatedAt: new Date()
            }
          }
        })
      },

      deleteDocument: (id) => {
        set((state) => {
          state.documents = state.documents.filter(doc => doc.id !== id)
        })
      },

      addCategory: (categoryData) => {
        set((state) => {
          const newCategory: Category = {
            ...categoryData,
            id: Date.now().toString()
          }
          state.categories.push(newCategory)
        })
      },

      updateCategory: (id, updates) => {
        set((state) => {
          const index = state.categories.findIndex(cat => cat.id === id)
          if (index !== -1) {
            state.categories[index] = { ...state.categories[index], ...updates }
          }
        })
      },

      deleteCategory: (id) => {
        set((state) => {
          state.categories = state.categories.filter(cat => cat.id !== id)
        })
      },

      setSearchQuery: (query) => {
        set((state) => {
          state.searchQuery = query
        })
      },

      setSelectedCategory: (categoryId) => {
        set((state) => {
          state.selectedCategory = categoryId
        })
      },

      setSelectedTags: (tags) => {
        set((state) => {
          state.selectedTags = tags
        })
      },

      toggleTheme: () => {
        set((state) => {
          state.theme = state.theme === 'light' ? 'dark' : 'light'
        })
      },

      toggleSidebar: () => {
        set((state) => {
          state.sidebarCollapsed = !state.sidebarCollapsed
        })
      },

      toggleQuickCapture: () => {
        set((state) => {
          state.quickCaptureVisible = !state.quickCaptureVisible
        })
      },

      getDocumentsByCategory: (categoryId) => {
        return get().documents.filter(doc => doc.category === categoryId)
      },

      getDocumentsByTag: (tag) => {
        return get().documents.filter(doc => doc.tags.includes(tag))
      },

      searchDocuments: (query) => {
        const documents = get().documents
        if (!query.trim()) return documents
        
        return documents.filter(doc => 
          doc.title.toLowerCase().includes(query.toLowerCase()) ||
          doc.content.toLowerCase().includes(query.toLowerCase()) ||
          doc.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        )
      }
    })),
    {
      name: 'knowledge-store',
      partialize: (state) => ({
        documents: state.documents,
        categories: state.categories,
        tags: state.tags,
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed
      })
    }
  )
)