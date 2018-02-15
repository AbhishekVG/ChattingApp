const moment = require('moment');
const date = moment()
// const date = new Date();
// const months = ['jan', 'feb', 'mar', 'apr', 'may', 'june', 'july', 'aug', 'sep', 'oct', 'nov', 'dec'];
// console.log(months[date.getMonth()])
// moment.lang("kn");
moment.locale('kn')
date.subtract(1, 'h')
console.log(date.format('h:mm a'))
console.log(date.valueOf())
console.log(new Date().getTime())