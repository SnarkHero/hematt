const directiveObj = {
  install (Vue) {
    Vue.directive('fofo', {
      // 指令给的在组件里,先用找到里面的input标签给input标签添加自定义事件
      inserted (el) {
        // nodeName获取本身的DOM元素,当本身为textarea或者是input时直接获取，如果不是则往里继续找
        if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
          el.focus()
        } else {
          const theInput = el.querySelector('input')
          const theTextarea = el.querySelector('textrea')
          if (theInput) theInput.focus()
          if (theTextarea) theTextarea.focus()
        }
      },
      // inserted是组件创建瞬间时生效,updated是组件更新时生效
      updated (el) {
        // nodeName获取本身的DOM元素,当本身为textarea或者是input时直接获取，如果不是则往里继续找
        if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
          el.focus()
        } else {
          const theInput = el.querySelector('input')
          const theTextarea = el.querySelector('textrea')
          if (theInput) theInput.focus()
          if (theTextarea) theTextarea.focus()
        }
      }
    })
  }
}

export default directiveObj
