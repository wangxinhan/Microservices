export function exportReportPdf (data) {
  let newWin = window.open('', 'report_export_pdf_show_print', '')
  let tableHTML = document.getElementById(data.id).innerHTML
  newWin.document.write('<style type="text/css">*{margin:0;padding:0}table{border-collapse:collapse;width:100%!important;}td{ border:1px solid #999}th{ border:1px solid #999;white-space:nowrap}</style>')
  newWin.document.write('<h3>' + data.title + '</h3>')
  newWin.document.write(tableHTML)
  newWin.document.location.reload()
  newWin.print()
}
export function sortDataByKey (data, key) {
  data.sort(function (a, b) {
    if (a[key] > b[key]) {
      return 1
    } else if (a[key] === b[key]) {
      return 0
    } else {
      return -1
    }
  })
  return data
}
/*
  导出报表表头的时间设置
*/
export function searchTime (query) {
  if (query.timeType === 'year') {
    return ' 年报（' + query.yearReport + '年' + ')'
  } else if (query.timeType === 'month') {
    return ' 月报（' + query.yearReport + '年' + query.monthReport + '月' + ')'
  } else if (query.timeType === 'day') {
    return ' 日报（' + query.yearReport + '年' + query.monthReport + '月' + query.dayReport + '日' + ')'
  } else {
    return ''
  }
}
/**
 * 格式化时间
 */
export function formatDateQuery (query) {
  let formatedQuery = {}
  for (let key in query) {
    if (typeof query[key] === 'number') {
      if (query[key] > 9) {
        formatedQuery[key] = '' + query[key]
      } else {
        formatedQuery[key] = '0' + query[key]
      }
    } else {
      formatedQuery[key] = query[key]
    }
  }
  return formatedQuery
}

/**
* 检验查询类型和时间格式
* 自定义类型规则：通话、工单[不可空]；在线咨询、邮件[可空]
* canBeNull：是否可以为空；isDay：是否到天
*/
export function checkTime (start, end, canBeNull, isDay) {
  let msg
  let startTime = start ? start.replace(/-/g, '').replace(/:/g, '').replace(/\s/g, '') : 0
  let endTime = end ? end.replace(/-/g, '').replace(/:/g, '').replace(/\s/g, '') : 0
  let temp = isDay ? 10000 : 100000000
  if (startTime && endTime) { // 起止时间均不为0
    if (startTime / temp > 1 && endTime / temp > 1) { // 时间是否完整
      if (startTime > endTime) { // 起止时间是否颠倒
        msg = 'report.queryTimeErr'
      } else {
        msg = true
      }
    } else {
      msg = 'report.queryTypeErr'
    }
  } else {
    if (canBeNull) { // 是否可以为空
      if ((startTime + endTime) / temp > 0 && (startTime + endTime) / temp < 1) { // 时间是否完整
        msg = 'report.queryTypeErr'
      } else {
        msg = true
      }
    } else {
      msg = 'report.queryType'
    }
  }
  return msg
}
/**
* 重置highcharts的默认颜色
*/
// export let colorConfig = {c1: '#7cb5ec', c2: '#f7a35c', c3: '#90ee7e', c4: '#7798BF', c5: '#aaeeee', c6: 'ff0066', c7: '#eeaaee', c8: '#55BF3B', c9: '#DF5353', c10: '#7798BF'}
export let colorConfigArr = ['#7cb5ec', '#f7a35c', '#90ee7e', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee', '#55BF3B', '#DF5353', '#7798BF']
