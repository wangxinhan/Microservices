/**
 * Created by liujing on 17/01/09.
 */
let validate = {
  Anything: {
    rule: /.*/,
    message: 'validate.anything'
  },
  Email: {
    rule: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    message: 'validate.email'
  },
  Phone: {
    rule: /^[0-9]\d{2,16}$/,
    message: 'validate.phone'
  },
  Phone2: {
    rule: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
    message: 'validate.phone2'
  },
  AllPhone: {
    rule: /^([0-9]|-){2,16}$/,
    message: 'validate.allPhone'
  },
  Mobile: {
    rule: /^0?(13\d{9}|15\d{9}|18\d{9}|14\d{9})$/,
    message: 'validate.mobile'
  },
  Url: {
    rule: /^((http|ftp|https):\/\/)(([a-zA-Z0-9._-]+\.[a-zA-Z]{2,6})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,4})*(\/[a-zA-Z0-9&%_./-~-]*)?/,
    message: 'validate.url'
  },
  TEXT: {
    rule: /^\w+$/,
    message: 'validate.text'
  },
  Number: {
    rule: /^\d+$/,
    message: 'validate.number'
  },
  Number2: {
    rule: /^\d+(\.\d{1,2})?$/,
    message: 'validate.number2'
  },
  Number3: {
    rule: /^[0-9]\d*$/, // 正整数
    message: 'validate.number3'
  },
  QQ: {
    rule: /^[1-9]\d{4,8}$/,
    message: 'validate.QQ'
  },
  Integer: {
    rule: /^[-+]?\d+$/,
    message: 'validate.integer'
  },
  Double: {
    rule: /^[-+]?\d+(\.\d+)?$/,
    message: 'validate.double'
  },
  Character: {
    rule: /^[A-Za-z0-9_]+$/,
    message: 'validate.character'
  },
  Character2: {
    rule: /^[A-Za-z0-9._]+$/,
    message: 'validate.character2'
  },
  IP: {
    rule: /^(([1][0-9][0-9])|([2][0-4][0-9])|([2][5][0-5])|([0-9][0-9])|([0-9]))\.(([1][0-9][0-9])|([2][0-4][0-9])|([2][5][0-5])|([0-9][0-9])|([0-9]))\.(([1][0-9][0-9])|([2][0-4][0-9])|([2][5][0-5])|([0-9][0-9])|([0-9]))\.(([1][0-9][0-9])|([2][0-4][0-9])|([2][5][0-5])|([0-9][0-9])|([0-9]))$/,
    message: 'validate.IP'
  },
  YYYYMMDDHHDDSS: {
    rule: /^[12][0-9]{3}-([0][1-9]|[1][012])-([012][0-9]|[3][01]) ([01][0-9]|[2][0-3]):[0-5][0-9]:[0-5][0-9]$/,
    message: 'validate.time_s'
  },
  YYYYMMDD: {
    rule: /^[12][0-9]{3}-([0][0-9]|[1][012])-([012][0-9]|[3][01])$/,
    message: 'validate.time_d'
  },
  Chinese: {
    rule: /^[\u0391-\uFFE5]+$/,
    message: 'validate.Chinese'
  },
  NotChinese: {
    rule: /^[^\u0391-\uFFE5]+$/,
    message: 'validate.notChinese'
  },
  UnSafe: {
    rule: /^(([A-Z]*|[a-z]*|\d*|[-_~!@#$%^&*.()[\]{}<>?\\/'"]*)|.{0,5})$|\s/,
    message: 'validate.unSafe'
  },
  Age: {
    rule: /^[1-9]\d{0,2}$/,
    message: 'validate.age'
  }
}
export function checkform (value, type) {
  if (value && type) {
    let rule = validate[type].rule
    // let result = !!value.match(rule)
    let result = !!rule.test(value)
    if (!result) {
      return validate[type].message
    } else {
      return ''
    }
  }
}
