
import fs from 'fs'

export function autoClassPlugin(options = {cssFile : '', mainUnit: '', mainjsFile:'', refreshInit: true}){
  let {cssFile, mainUnit, classTypes, mainjsFile, refreshInit} = options
  const unit = mainUnit? mainUnit : 'px'
  const defaultOptions = {
    cssFile : 'auto.css', mainUnit: 'px',
    mainjsFile: 'main.js', 
    refreshInit: true, // 当设为 true, dev启动时会手动刷新页面一次，以响应项目未启动时vue页面代码新增的css类
    classTypes: {
      w: {key: 'width', unit},
      h: {key: 'height', unit},
      lh: {key: 'line-height', unit},
      minh: {key: 'min-height', unit},
      minw: {key: 'min-width', unit},
      maxh: {key: 'max-height', unit},
      maxw: {key: 'max-width', unit},
      vw: {key: 'width', unit:'vw'},
      vh: {key: 'height', unit: 'vh'},
      pw: {key: 'width', unit: '%'},
      ph: {key: 'height', unit: '%'},
      p: {key: 'padding', unit},
      pl: {key: 'padding-left', unit},
      pr: {key: 'padding-right', unit},
      pt: {key: 'padding-top', unit},
      pb: {key: 'padding-bottom', unit},
      m: {key: 'margin', unit},
      ml: {key: 'margin-left', unit},
      mr: {key: 'margin-right', unit},
      mt: {key: 'margin-top', unit},
      mb: {key: 'margin-bottom', unit},
      fs: {key: 'font-size', unit},
      bdr:{key: 'border-radius', unit},
      bdrtl:{key: 'border-top-left-radius', unit},
      bdrtr:{key: 'border-top-right-radius', unit},
      bdrbl:{key: 'border-bottom-left-radius', unit},
      bdrbr:{key: 'border-bottom-right-radius', unit},
      op: {key: 'opacity', unit:'%'},
      z: {key: 'z-index', unit:''},
      fl: {key: 'flex', unit: ''}
    }
  }
  if (!cssFile) cssFile = defaultOptions.cssFile
  if (!classTypes) classTypes = defaultOptions.classTypes 
  if (!mainjsFile) mainjsFile = defaultOptions.mainjsFile

  // let config
  let autoClassContent = ''
  let autoCSSFile
  let init = true
  return {
    //插件名字
    name:'vite-plugin-vue-autoClass',
    enforce: "pre",
    // configResolved(resolvedConfig) {
    //   config = resolvedConfig;
    //   console.log(config.build)
    //   autoCSSFile = config.root + '/src/' + (cssFile? cssFile : 'auto.css')
    // },
    
    transform(code,id){
      // console.log(id)
      
      if (id.substring(id.length-4) == '.vue') {
        if (!autoCSSFile) return code
        autoClassContent = fs.readFileSync(autoCSSFile)
        const templateStr = code.substring(code.indexOf('<template>'), code.indexOf('</template>'))
        const classStr1 = templateStr.match(/class=".*?"/g) ?? []
        const classStr2 = templateStr.match(/class='.*?'/g) ?? []
        let classArr = classStr1.concat(classStr2).reduce((pre,cur)=>{
          return pre.concat(cur.split(/[ '"]/).filter(item=>{
            return /\d+$/.test(item)
          }))
        }, [])
        
        const autoClasss = [...(new Set(classArr))]
        const contentStr = autoClasss.reduce((pre, cur)=>{
          const label = cur.replaceAll(/\d+/g, '')
          if ( !classTypes[label] || autoClassContent.includes(cur) ) return pre
          let c = `.${cur} {
            ${classTypes[label].key}: ${cur.replaceAll(/\D+/g, '')}${classTypes[label].unit}
          }`
          return pre+`
          ${c}`
        }, '')
        autoClassContent += contentStr
        if (contentStr) {
          fs.writeFileSync(autoCSSFile, autoClassContent)
        }

        //写入单个vue组件文件中，此方法造成代码冗余，放弃
        // code = code.replace('</style>', contentStr + '' + hStr + '  </style>')
      }
      else if (id.substring(id.length - mainjsFile.length) == mainjsFile) {
        if (!autoCSSFile) {
          const tempPath = id.substring(0, id.length - mainjsFile.length)
          autoCSSFile = tempPath + (cssFile? cssFile : 'auto.css')
          if (!fs.existsSync(autoCSSFile)) fs.writeFileSync(autoCSSFile,'')  
        }

        code = `import './${cssFile? cssFile : 'auto.css'}'
        ${code}
        if (import.meta.hot) {
          import.meta.hot.on('refresh', ()=>{
            console.log('refresh')
            window.location.reload()
          })
        }
        `
      }
      return code;
    },
    handleHotUpdate(ctx) {
      if (ctx.file == autoCSSFile && init && refreshInit) {
        console.log('refresh css')
        init = false
        setTimeout(() => {
          ctx.server.ws.send({
            type: 'custom',
            event: 'refresh'
          })
        }, 1000);
      }
    }
  }
}