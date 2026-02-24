import PageList from '../../PageList'

const dpPages = [
  { path: '/posts/design_patterns/singleton', title: '单例模式', desc: '确保一个类只有一个实例，并提供全局访问点' },
  { path: '/posts/design_patterns/factory', title: '工厂模式', desc: '定义一个创建对象的接口，让子类决定实例化哪一个类' },
  { path: '/posts/design_patterns/observer', title: '发布-订阅模式', desc: '定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都得到通知并自动更新' },
  { path: '/posts/design_patterns/strategy', title: '策略模式', desc: '定义一系列算法，将每个算法封装起来，并使它们可以互换' },
  { path: '/posts/design_patterns/decorator', title: '装饰器模式', desc: '动态地给对象添加额外的职责，就增加功能来说，装饰器模式比生成子类更为灵活' },
  { path: '/posts/design_patterns/proxy', title: '代理模式', desc: '为其他对象提供一种代理以控制对这个对象的访问' },
  { path: '/posts/design_patterns/iterator', title: '迭代器模式', desc: '提供一种方法顺序访问一个聚合对象中的各个元素，而又不暴露该对象的内部表示' },
  { path: '/posts/design_patterns/adapter', title: '适配器模式', desc: '将一个类的接口转换成客户希望的另一个接口，使得原本由于接口不兼容而不能一起工作的那些类可以一起工作' },
]

const DpList = () => {
  return <PageList pages={dpPages} className="dp-list" />
}

export default DpList
