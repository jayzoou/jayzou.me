import { normalizeRoute } from '../lib/pageRoutes.ts'

export interface Article {
  path: string
  title: string
  description: string
  status: 'published' | 'planned' | 'reserved'
  reason?: string
}

export interface Category {
  id: string
  path: string
  label: string
  section: 'blog' | 'english'
  navigation: boolean
  articles: readonly Article[]
}

// Order here is the display order. Content, navigation and validation share this catalog.
export const categories: readonly Category[] = [
  {
    "id": "js_core",
    "path": "/posts/js_core",
    "label": "JS核心",
    "section": "blog",
    "navigation": true,
    "articles": [
      {
        "path": "/posts/js_core/type",
        "title": "值与类型",
        "description": "数据类型与隐式转换",
        "status": "published"
      },
      {
        "path": "/posts/js_core/scope",
        "title": "作用域",
        "description": "变量的“地盘”谁说了算？",
        "status": "published"
      },
      {
        "path": "/posts/js_core/closure",
        "title": "闭包",
        "description": "函数与其词法环境的组合体",
        "status": "published"
      },
      {
        "path": "/posts/js_core/this",
        "title": "this",
        "description": "函数执行时的上下文对象",
        "status": "published"
      },
      {
        "path": "/posts/js_core/prototype",
        "title": "原型",
        "description": "对象的继承与共享机制",
        "status": "published"
      },
      {
        "path": "/posts/js_core/event_loop",
        "title": "Event Loop",
        "description": "JavaScript 事件循环的原理与示例",
        "status": "published"
      },
      {
        "path": "/posts/js_core/promise",
        "title": "Promise",
        "description": "JavaScript 异步编程的利器",
        "status": "published"
      },
      {
        "path": "/posts/js_core/execution_context",
        "title": "执行上下文",
        "description": "执行上下文与调用栈",
        "status": "reserved",
        "reason": "历史空白占位：执行上下文尚未发布，保留已有 URL"
      }
    ]
  },
  {
    "id": "design_patterns",
    "path": "/posts/design_patterns",
    "label": "设计模式",
    "section": "blog",
    "navigation": true,
    "articles": [
      {
        "path": "/posts/design_patterns/singleton",
        "title": "单例模式",
        "description": "确保一个类只有一个实例，并提供全局访问点",
        "status": "published"
      },
      {
        "path": "/posts/design_patterns/factory",
        "title": "工厂模式",
        "description": "定义一个创建对象的接口，让子类决定实例化哪一个类",
        "status": "published"
      },
      {
        "path": "/posts/design_patterns/observer",
        "title": "发布-订阅模式",
        "description": "定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都得到通知并自动更新",
        "status": "published"
      },
      {
        "path": "/posts/design_patterns/strategy",
        "title": "策略模式",
        "description": "定义一系列算法，将每个算法封装起来，并使它们可以互换",
        "status": "published"
      },
      {
        "path": "/posts/design_patterns/decorator",
        "title": "装饰器模式",
        "description": "动态地给对象添加额外的职责，就增加功能来说，装饰器模式比生成子类更为灵活",
        "status": "published"
      },
      {
        "path": "/posts/design_patterns/proxy",
        "title": "代理模式",
        "description": "为其他对象提供一种代理以控制对这个对象的访问",
        "status": "published"
      },
      {
        "path": "/posts/design_patterns/iterator",
        "title": "迭代器模式",
        "description": "提供一种方法顺序访问一个聚合对象中的各个元素，而又不暴露该对象的内部表示",
        "status": "published"
      },
      {
        "path": "/posts/design_patterns/adapter",
        "title": "适配器模式",
        "description": "将一个类的接口转换成客户希望的另一个接口，使得原本由于接口不兼容而不能一起工作的那些类可以一起工作",
        "status": "published"
      }
    ]
  },
  {
    "id": "algorithm",
    "path": "/posts/algorithm",
    "label": "算法",
    "section": "blog",
    "navigation": true,
    "articles": [
      {
        "path": "/posts/algorithm/algorithm_analysis",
        "title": "算法分析基础",
        "description": "如何评估算法的时间与空间效率",
        "status": "published"
      },
      {
        "path": "/posts/algorithm/asymptotic_notation",
        "title": "渐近记号",
        "description": "ASMIC 记号与时间复杂度的数学表达",
        "status": "published"
      },
      {
        "path": "/posts/algorithm/frequency_count",
        "title": "频率计数法",
        "description": "通过执行次数分析算法复杂度",
        "status": "published"
      },
      {
        "path": "/posts/algorithm/array",
        "title": "数组",
        "description": "数组相关的算法和操作",
        "status": "published"
      },
      {
        "path": "/posts/algorithm/stack_base",
        "title": "栈与队列(基础篇)",
        "description": "数据结构入门",
        "status": "published"
      },
      {
        "path": "/posts/algorithm/stack_advanced",
        "title": "栈与队列(进阶篇)",
        "description": "高级技巧与优化",
        "status": "published"
      },
      {
        "path": "/posts/algorithm/stack_practice",
        "title": "栈与队列(实战篇)",
        "description": "真实场景应用",
        "status": "published"
      },
      {
        "path": "/posts/algorithm/chain",
        "title": "链表",
        "description": "链表相关的算法和操作",
        "status": "published"
      },
      {
        "path": "/posts/algorithm/hash",
        "title": "哈希表",
        "description": "Map与Set的原理与实战",
        "status": "published"
      },
      {
        "path": "/posts/algorithm/tree",
        "title": "树结构基础",
        "description": "二叉树遍历与应用",
        "status": "published"
      },
      {
        "path": "/posts/algorithm/tree_binary",
        "title": "二叉搜索树",
        "description": "高效查找与应用",
        "status": "published"
      },
      {
        "path": "/posts/algorithm/heap",
        "title": "堆与堆排序",
        "description": "堆数据结构、堆操作、堆排序和优先队列",
        "status": "published"
      }
    ]
  },
  {
    "id": "linear_algebra",
    "path": "/posts/linear_algebra",
    "label": "线性代数",
    "section": "blog",
    "navigation": true,
    "articles": [
      {
        "path": "/posts/linear_algebra/introduction",
        "title": "几何直觉的重要性",
        "description": "理解线性代数的几何视角与数值视角",
        "status": "published"
      }
    ]
  },
  {
    "id": "vue",
    "path": "/posts/vue",
    "label": "Vue",
    "section": "blog",
    "navigation": true,
    "articles": [
      {
        "path": "/posts/vue/design_thinking",
        "title": "Vue的设计思路",
        "description": "声明式渲染与组件化",
        "status": "published"
      },
      {
        "path": "/posts/vue/reactive",
        "title": "响应式系统",
        "description": "数据驱动的视图更新机制",
        "status": "published"
      },
      {
        "path": "/posts/vue/compiler",
        "title": "编译器",
        "description": "模板编译与渲染机制",
        "status": "planned"
      },
      {
        "path": "/posts/vue/runtime",
        "title": "运行时",
        "description": "虚拟DOM与渲染过程",
        "status": "planned"
      },
      {
        "path": "/posts/vue/component",
        "title": "组件化",
        "description": "组件的创建与组合",
        "status": "planned"
      },
      {
        "path": "/posts/vue/ssr",
        "title": "服务端渲染",
        "description": "服务端渲染的实现与优化",
        "status": "planned"
      }
    ]
  },
  {
    "id": "frontend",
    "path": "/posts/frontend",
    "label": "前端开发",
    "section": "blog",
    "navigation": true,
    "articles": [
      {
        "path": "/posts/frontend/rendering",
        "title": "渲染流程",
        "description": "浏览器渲染的流程和机制",
        "status": "published"
      },
      {
        "path": "/posts/frontend/performance",
        "title": "性能优化",
        "description": "提升前端性能的技巧和方法",
        "status": "planned"
      },
      {
        "path": "/posts/frontend/cache",
        "title": "缓存",
        "description": "前端缓存的策略与实现",
        "status": "planned"
      },
      {
        "path": "/posts/frontend/ssr",
        "title": "服务端渲染",
        "description": "服务端渲染的原理与实现",
        "status": "planned"
      },
      {
        "path": "/posts/frontend/lixian",
        "title": "离线",
        "description": "前端离线应用的实现与优化",
        "status": "planned"
      },
      {
        "path": "/posts/frontend/http",
        "title": "HTTP",
        "description": "HTTP 协议的原理与应用",
        "status": "planned"
      }
    ]
  },
  {
    "id": "english/grammar",
    "path": "/posts/english/grammar",
    "label": "语法",
    "section": "english",
    "navigation": true,
    "articles": [
      {
        "path": "/posts/english/grammar/introduction",
        "title": "花一周掌握“够用”的英语语法",
        "description": "爱情应该是“长跑”，而学语法不是",
        "status": "published"
      },
      {
        "path": "/posts/english/grammar/element",
        "title": "成分",
        "description": "主语、谓语、宾语、定语、状语、补语",
        "status": "published"
      },
      {
        "path": "/posts/english/grammar/part-of-speech",
        "title": "词性",
        "description": "名词、动词、形容词、副词等",
        "status": "published"
      },
      {
        "path": "/posts/english/grammar/noun-phrase",
        "title": "名词短语",
        "description": "英文里“名词”几乎从不单独出现",
        "status": "published"
      },
      {
        "path": "/posts/english/grammar/adjective",
        "title": "形容词",
        "description": "形容词修饰名词",
        "status": "published"
      },
      {
        "path": "/posts/english/grammar/adverb",
        "title": "副词",
        "description": "副词修饰动词、形容词或其他副词",
        "status": "published"
      },
      {
        "path": "/posts/english/grammar/basic-sentence-patterns",
        "title": "基本句型",
        "description": "五种基本句型结构",
        "status": "published"
      },
      {
        "path": "/posts/english/grammar/noun-clause",
        "title": "名词性从句",
        "description": "主语从句、宾语从句、表语从句、同位语从句",
        "status": "published"
      },
      {
        "path": "/posts/english/grammar/adj-clause",
        "title": "定语从句",
        "description": "形容词性从句",
        "status": "published"
      },
      {
        "path": "/posts/english/grammar/adv-clause",
        "title": "状语从句",
        "description": "副词性从句",
        "status": "published"
      },
      {
        "path": "/posts/english/grammar/tenses",
        "title": "时态",
        "description": "英语十六种时态",
        "status": "published"
      }
    ]
  },
  {
    "id": "english/document",
    "path": "/posts/english",
    "label": "英文阅读",
    "section": "english",
    "navigation": false,
    "articles": [
      {
        "path": "/posts/english/document/why-vite",
        "title": "Why Vite",
        "description": "阅读 Vite 的设计动机",
        "status": "published"
      }
    ]
  }
]

export const sections = [
  { id: 'blog', label: 'Blog', defaultCategory: 'js_core' },
  { id: 'english', label: 'English', defaultCategory: 'english/grammar' },
] as const

export const articles = categories.flatMap(category => category.articles)
const articleByPath = new Map(articles.map(article => [normalizeRoute(article.path), article]))

export function getArticle(pathname: string): Article | undefined {
  return articleByPath.get(normalizeRoute(pathname))
}

export function getCategory(id: string): Category {
  const category = categories.find(item => item.id === id)
  if (!category) throw new Error(`Unknown content category: ${id}`)
  return category
}

export const reservedPages = Object.fromEntries(articles
  .filter(article => article.status === 'reserved')
  .map(article => [`pages${article.path}.mdx`, article.reason || ''])
)

export const siteMetadata = { name: 'Jay Zou', url: 'https://jayzou.me', description: '个人学习笔记与交互演示' }
const standalonePages: Record<string, { title: string; description: string }> = {
  '/': { title: 'Jay Zou', description: '与 Jay 的数字助手对话，了解公开简历、查询博客正文与体验交互 Demo。' },
  '/posts': { title: 'Blog', description: '前端、算法与计算机基础学习笔记' },
  '/projects': { title: 'Projects', description: 'Jay Zou 的项目与工具' },
}

export function getPageMetadata(pathname: string) {
  const route = normalizeRoute(pathname)
  const canonical = new URL(route === '/' ? '/' : `${route}/`, siteMetadata.url).href
  const article = getArticle(pathname)
  if (article) return { title: `${article.title} · ${siteMetadata.name}`, description: article.description, noindex: article.status !== 'published', canonical }
  const category = categories.find(item => normalizeRoute(item.path) === normalizeRoute(pathname))
  if (category) return { title: `${category.label} · ${siteMetadata.name}`, description: `${category.label}学习笔记与文章目录`, noindex: false, canonical }
  const page = standalonePages[normalizeRoute(pathname)] || standalonePages['/']
  return { ...page, noindex: false, canonical }
}
