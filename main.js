/*
 * @Author: saber2pr
 * @Date: 2020-01-11 19:16:52
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-01-11 23:40:58
 */
const actress = [
  "小鸟游-怜",
  "小芦-睦海",
  "绀堂地-衡理",
  "依城-惠理",
  "妮娜-K",
  "二阶堂-嗣",
  "文嘉",
  "天音",
  "二玉子-舞",
  "日向-凛",
  "一条-绫香",
  "朱音",
  "G姐",
  "文岛",
  "yoyo",
  "王红花",
  "忍蛙",
  "万场-盟华",
  "兼志谷-星",
  "薰子",
  "四谷裕美",
  "深沙希",
  "黑胶佬",
  "芹菜",
  "肥结",
  "神宫寺-真理",
  "金潟",
  "稚娜",
  "爱花",
  "涛哥",
  "夜露",
  "吾妻枫",
  "丽塔",
  "杏奈"
]

const MAX_REC = 50
const items = actress.map(name => ({ name }))
const POOL = [
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

const ToolBox = ({ openset, openrec }) => {
  return jsx`
    <nav class="toolbox">
      <button class="btn float-left" onclick=${openset}>设置</button>
      <button class="btn float-right" onclick=${openrec}>抽卡记录</button>
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

const ValueInput = ({ list, n }) => {
  const current = list[list.length - n]
  return jsx`
    <${jsx.frag}>
      ${n}星概率：<input value=${current.value} oninput=${event => {
    current.value = Number(event.target.value)
  }}/>
    </${jsx.frag}>`
}

const Setting = ({ list, closeset }) => {
  return jsx`
    <div class="setting">
      <nav class="toolbox">
        <button class="btn float-left" onclick=${closeset}>返回</button>
      </nav>
      <div class="setting-content">
        <div class="box">
          <div class="content">设置</div>
          <ul>
            <li><${ValueInput} list=${list} n=${4} /></li>
            <li><${ValueInput} list=${list} n=${3} /></li>
            <li><${ValueInput} list=${list} n=${2} /></li>
            <li>1星概率：<input disabled value=${list[3].value}/></li>
          </ul>
        </div>
      </div>
      <div class="setting-confirm">
        <button class="btn" onclick=${closeset}>确定</button>
      </div>
    </div>`
}

const Recording = ({ ref, closerec }) => {
  return jsx`
    <div class="recording">
      <nav class="toolbox">
        <button class="btn float-right" onclick=${closerec}>返回</button>
      </nav>
      <div class="recording-content">
        <div class="box">
          <div class="content">抽卡记录</div>
          <table ref=${ref}></table>
        </div>
      </div>
      <div class="recording-confirm">
        最多只显示${MAX_REC}条记录
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

const cleanRec = (rec, max) => {
  while (rec.length > max) {
    rec.pop()
  }
}

const useSelect = list => {
  const ref = {}
  const rec_ref = {}
  const record = []

  const setState = items => {
    jsx.render(
      jsx`<${jsx.frag}>${items.map(
        ({ name, level }) =>
          jsx`<div class="item level${level}">[${level}★]${name}</div>`
      )}<${jsx.frag}/>`,
      ref.current
    )

    record.unshift(...items)
    cleanRec(record, MAX_REC)

    jsx.render(
      jsx`<${jsx.frag}>${record.map(
        ({ name, level }) =>
          jsx`<tr class=${"level" + level} style=${{
            color: "#a93c3c"
          }}><th align="left" style=${{ padding: "0 0.5rem" }}>${"★".repeat(
            level
          )}</th><td style=${{
            padding: "0 0.5rem"
          }}>${name}</td></tr>`
      )}<${jsx.frag}/>`,
      rec_ref.current
    )
  }

  const select = n => setState(PoolHelper.compute(list, n))
  return [ref, rec_ref, select]
}

const Layout = ({ list }) => {
  const [ref, rec_ref, select] = useSelect(list)

  const topRef = {}
  const clearTop = () => {
    topRef.current.className = ""
  }

  const openset = () => {
    topRef.current.className = "show-set"
  }

  const openrec = () => {
    topRef.current.className = "show-rec"
  }

  return jsx`
    <div ref=${topRef}>
      <${Setting} list=${list} closeset=${clearTop}/>
      <${Recording} ref=${rec_ref} closerec=${clearTop}/>
      <div class="layout">
        <${ToolBox} openset=${openset} openrec=${openrec}/>
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

jsx.render(jsx`<${Layout} list=${POOL}/>`, document.getElementById("root"))
