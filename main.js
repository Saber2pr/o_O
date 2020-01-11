/*
 * @Author: saber2pr
 * @Date: 2020-01-11 19:16:52
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-01-11 19:57:04
 */
const actress = [
  "小鸟游-怜",
  "小芦-睦海",
  "绀堂地-衡理",
  "依城-惠理",
  "妮娜-K",
  "二阶堂-嗣",
  "文嘉",
  "二玉子-舞",
  "日向-凛",
  "一条-绫香",
  "朱音",
  "G姐",
  "文岛",
  "yoyo",
  "王红花",
  "兼志谷-星",
  "薰子",
  "四谷裕美",
  "寡妇",
  "黑胶佬",
  "芹菜",
  "肥结",
  "神宫寺-真理",
  "金潟",
  "稚娜",
  "爱花",
  "涛哥",
  "女主",
  "吾妻枫"
]

const items = actress.map(name => ({ name }))

const config = {
  pool: [
    {
      level: 4,
      value: 0.01,
      items
    },
    {
      level: 3,
      value: 0.1,
      items
    },
    {
      level: 2,
      value: 0.5,
      items
    },
    {
      level: 1,
      value: 1,
      items
    }
  ]
}

const ToolBox = ({ openset }) => {
  return jsx`
    <nav class="toolbox">
      <button class="btn float-left" onclick=${openset}>设置</button>
    </nav>`
}

const Result = ({ ref }) => {
  return jsx`
    <div class="result">
      <div class="box">
        <div class="content" ref=${ref}>
        </div>
      </div>
    </div>`
}

const Run = ({ exec }) => {
  return jsx`
    <div class="run">
      <button class="btn" onclick=${() => exec(1)}>抽一次</button>
      <div class="block"></div>
      <button class="btn" onclick=${() => exec(10)}>抽十次</button>
    </div>`
}

const ValueInput = ({ n }) => {
  const pool = config.pool
  const current = pool[pool.length - n]
  return jsx`
    <${jsx.frag}>
      ${n}星概率：<input value=${current.value} oninput=${event => {
    current.value = Number(event.target.value)
  }}/>
    </${jsx.frag}>`
}

const Setting = ({ closeset }) => {
  return jsx`
    <div class="setting">
      <nav class="toolbox">
        <button class="btn float-left" onclick=${closeset}>返回</button>
      </nav>
      <div class="setting-content">
        <div class="box">
          <div class="content">设置</div>
          <ul>
            <li><${ValueInput} n=${4} /></li>
            <li><${ValueInput} n=${3} /></li>
            <li><${ValueInput} n=${2} /></li>
            <li>1星概率：<input disabled value=${config.pool[3].value}/></li>
          </ul>
        </div>
      </div>
      <div class="setting-confirm">
        <button class="btn" onclick=${closeset}>确定</button>
      </div>
    </div>`
}

const PoolHelper = {
  randSelect: list => list[parseInt(list.length * Math.random())],
  findPool: (list, val) => {
    return list.find(({ value }) => val <= value)
  },
  compute: (list, n) =>
    Array(n)
      .fill(0)
      .map(_ => {
        const val = Number(Math.random()).toFixed(1)
        const pool = PoolHelper.findPool(list, val)
        const target = PoolHelper.randSelect(pool.items)
        target.level = pool.level
        return target
      })
}

const useSelect = list => {
  const ref = {}

  const setState = items =>
    jsx.render(
      jsx`<${jsx.frag}>${items.map(
        ({ name, level }) =>
          jsx`<div class="item level${level}">[${level}★]${name}</div>`
      )}<${jsx.frag}/>`,
      ref.current
    )

  const select = n => setState(PoolHelper.compute(list, n))

  return [ref, select]
}

const Layout = ({ list }) => {
  const [ref, select] = useSelect(list)

  const topRef = {}

  const openset = () => {
    topRef.current.className = "show-set"
  }

  const closeset = () => {
    topRef.current.className = ""
  }

  return jsx`
    <div ref=${topRef}>
      <${Setting} closeset=${closeset}/>
      <div class="layout">
        <${ToolBox} openset=${openset}/>
        <div class="box">
          <div class="header">抽卡模拟器(检验欧气的时候到了qwq！)</div>
          <${Result} ref=${ref}/>
          <${Run} exec=${select}/>
          <div class="footer">
            by <a href="https://saber2pr.top/">saber2pr</a>
          </div>
        </div>
      </div>
    </div>`
}

jsx.render(
  jsx`<${Layout} list=${config.pool}/>`,
  document.getElementById("root")
)
