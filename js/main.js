'use strict';

/**
 * 返回一个0到max之间的随机整数
 * @param {Object} max
 */
function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

/**
 * 返回一个随机地址
 */
const randomAddress = () => {
	const p_index = getRandomInt(PACS.length);
	const province = PACS[getRandomInt(p_index)];
	const c_index = getRandomInt(province.children.length);
	const city = province.children[c_index];
	const d_index = getRandomInt(city.children.length);
	const district = city.children[d_index];
	const s_index = getRandomInt(district.children.length);
	const street = district.children[s_index];
	const text = province.name + '/' + city.name + '/' + district.name + '/' + street.name
	return {
		province,
		city,
		district,
		street,
		text,
		code: district.code
	};
}

/**
 * 返回一个随机 出生年月日
 * @returns {Date} birthDate 
 * 			{String} birth 1990-01-01
 * 			{String} text 19900101
 */
const randomBirth = () => {
	const currentYear = new Date().getFullYear();
	const randomBirthYear = getRandomInt(100) + (currentYear - 100);
	const randomBirthMonth = getRandomInt(12) + 1; // 注意月份是从1开始的
	const randomBirthDate = getRandomInt(31) + 1; // 这里假设每个月最多31天
	function getRandomValidDate(year, month, dateLimit) {
		const maxDaysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		return new Date(year, month - 1, Math.min(randomBirthDate, maxDaysInMonth[month - 1]));
	}
	const birthDate = getRandomValidDate(randomBirthYear, randomBirthMonth, randomBirthDate);
	const birth = birthDate.toISOString().split('T')[0]
	const text = birth.replaceAll('-', '');
	return {
		birthDate,
		birth,
		text
	}
}

/**
 * 身份证验证
 */
const verifyID = (ID) => {
	// 权重因子
	const weightFactor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
	// 余数校验码
	const verifyCode = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
	let sum = 0;
	for (let i = 0; i < weightFactor.length; i++) {
		sum += parseInt(ID[i]) * weightFactor[i];
	}
	const remainder = sum % 11;
	const verify = verifyCode[remainder];
	return verify;
}

const {
	text: birthText
} = randomBirth();

/**
 * 前两位出生
 */
const randomDigit = () => {
	const code = getRandomInt(99)
	const suffix = code.toString().padStart(2, 0);
	const sex_code = getRandomInt(9);
	const sex = sex_code % 2; // 奇数表示男性，偶数表示女性
	return {
		text: suffix + sex_code,
		sex
	}
}
const recursionFind = (code, children) => {
	let text = '';
	for (let item of children) {
		if (item.code === code.substring(0, item.code.length)) {
			text += item.name;
			if (item.children) {
				text += '/' + recursionFind(code, item.children)
			}
		}
	}
	return text;
}

/**
 * 身份证反解析
 * @param {String} ID 需要分析的ID
 * @returns {String} 分析结果
 */
const inverseAnalysis = (ID) => {
	const verify = verifyID(ID);
	const areaCode = ID.substring(0, 6); // 前六位地区信息
	const year = ID.substring(6, 10); // 出生年份
	const month = ID.substring(10, 12); // 出生月份
	const day = ID.substring(12, 14); // 出生日期
	const sex = ID.substring(16, 17); // 性别
	const code = ID.substring(17); // 校验码
	const birth = year + '年' + month + '月' + day + '日';
	const sexText = sex % 2 === 0 ? '女' : '男';
	const address = recursionFind(areaCode, PACS);
	const age = new Date().getFullYear() - parseInt(year);
	let text = `年龄：${age}\n性别：${sexText}\n出生日期：${birth}\n地址：${address}\n身份证号码：${ID}`;
	if (code !== verify) {
		text += '\n\n身份证号码错误！'
	}
	return text;
}

const randomName = (suname, len) => {
	let lastNameLen = LAST_NAME.length;
	let name = suname;
	for (let i = 0; i < len - suname.length; i++) {
		if (name.length <= len) {
			name += LAST_NAME[getRandomInt(lastNameLen)];
		}
	}
	return name;
}

/**
 * 随机姓氏，支持单姓、复姓
 * 
 * @param  {Boolean} simple  0单姓、1复姓
 * @param  {Number} len 名字长度包含姓氏
 */
const randomSurame = (simple, len) => {
	let sunameLen = SURNAME.length;
	let doubleSunameLen = DOUBLE_SURNAME.length;
	let suname = '';
	if (simple) {
		suname = SURNAME[getRandomInt(sunameLen)];
	} else {
		suname = DOUBLE_SURNAME[getRandomInt(doubleSunameLen)];
	}
	return randomName(suname, len);
}

/**
 * 随机电话号码
 * 
 */
const randomMobile = () => {
	// 起始号码段
	const randomStartCode = START_CODE[getRandomInt(START_CODE.length)];
	const len = randomStartCode.length;
	const factor = 10000000;
	const randomPostfix = getRandomInt(factor);
	const str = randomStartCode + randomPostfix
	return str.padEnd(11, 0);
}

/**
 * 随机字符串
 * 
 * @param {Number} length
 * @param {Boolean} uppercase 大写
 * @param {Boolean} lowercase 小写
 * @param {Boolean} special 特殊字符
 * @param {Boolean} numbers 数字
 */
const generateRandomString = (length, uppercase, lowercase, special, numbers) => {
	// 特殊字符
	const specialChars = [
		'!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '{', '}',
		'[', ']', '|', '\\', ':', ';', '\'', '"', '<', '>', ',', '.', '?', '/', '`'
	];
	// 数字
	const numberChars = '0123456789';
	// 字母
	const chars = 'abcdefghijklmnopqrstuvwxyz';
	const flag = [];
	const params = [uppercase, lowercase, special, numbers];
	params.filter((item, i) => {
		if (item) {
			flag.push(i)
		}
	});
	let output = '';
	for (let i = 0; i < length; i++) {
		let f = flag[getRandomInt(flag.length)];
		switch (f) {
			case 1:
				output += chars[getRandomInt(chars.length)];
				break;
			case 2:
				output += specialChars[getRandomInt(specialChars.length)];
				break;
			case 3:
				output += numberChars[getRandomInt(numberChars.length)];
				break;
			default:
				output += chars[getRandomInt(chars.length)].toUpperCase();
		}

	}
	return output;
}

// 随机生成邮箱
const randomEmail = () => {
	const p = E_MAIL_PROVIDERS[getRandomInt(E_MAIL_PROVIDERS.length)];
	const a = generateRandomString(10, true, true, false, true);
	return a + '@' + p;
}
// 随机固话 7-8 位，区号3位 号码8位 区号4位 号码7
const randomTel = () => {
	const t = AREA_CODE[getRandomInt(AREA_CODE.length)];
	const l = t.length;
	let a = getRandomInt(9999999);
	a = l === 3 ? a.toString().padEnd(8, 0) : a.toString().padEnd(7, 0)
	return t + '-' + a;
}
// 用户信息组合
const randomUserInfo = () => {
	const {
		text: address,
		code
	} = randomAddress();
	const {
		text: seq,
		sex
	} = randomDigit();
	const {
		birth,
		birthDate,
		text: birthText
	} = randomBirth();
	const params = code + birthText + seq;
	const v_code = verifyID(params);
	const id = params + v_code;
	const age = new Date().getFullYear() - birthDate.getFullYear();
	return {
		id,
		sex: sex === 0 ? '女' : '男',
		birth,
		age,
		address
	}
}

// 解析 URL 参数
const parseUrl = () => {
	const params = document.getElementById('params').value;
	const en = decodeURIComponent(params);
	document.getElementById('params').value = en;
	let urlParams = '';
	if (en.includes('http')) {
		urlParams = new URLSearchParams(en.substring(en.indexOf('?') + 1));
	} else {
		urlParams = new URLSearchParams(en.replaceAll('; ', '&'));
	}
	let html = '';
	let strObj = {};
	urlParams.keys().forEach(key => {
		html += `字段：${key},值：${urlParams.get(key)}\n`;
		strObj[key] = urlParams.get(key)
	})
	document.getElementById('txtURL').value = 'URL：' + en + '\n\n' + JSON.stringify(strObj) + '\n\n' + html
}

// 随机数
document.getElementById('random-num').addEventListener('click', () => {
	let all = document.querySelectorAll('input[name="checkbox"]');
	let length = document.querySelector('input[name="length"]');
	const checkeds = [];
	all.forEach(item => {
		checkeds.push(item.checked)
	})
	let l = parseInt(length.value) ? length.value : 10;
	let str = '';
	for (let i = 0; i < 10; i++) {
		str += generateRandomString(l, checkeds[0], checkeds[1], checkeds[2],
			checkeds[3]) + '\r';
	}
	document.querySelector("#txtBox").value = str;
})

// 随机姓名
document.getElementById('random-name').addEventListener('click', () => {
	let all = document.querySelectorAll('input[name="nameType"]');
	let length = document.querySelector('input[name="size"]');
	const checked = all[0].checked;
	let l = parseInt(length.value) ? length.value : 3;
	let text = '';
	for (let i = 0; i < 10; i++) {
		text += randomSurame(checked, l) + '\r';
	}
	document.querySelector("#txtName").value = text;
})

// 解析验证身份证
document.getElementById('parse-id-card').addEventListener('click', () => {
	let id = document.getElementById('idCard');
	if (id.value.length < 18) {
		alert('长度不够哦！')
		return;
	}
	document.querySelector("#txtCard").value = inverseAnalysis(id.value);
})

document.getElementById('parse-url').addEventListener('click', () => {
	parseUrl()
})

// 公用 dom 创建方法
const commonDOM = (title, callback) => {
	const fieldset = document.createElement('fieldset');
	const legend = document.createElement('legend');
	legend.innerText = title;
	const textarea = document.createElement('textarea');
	const div = document.createElement('div');
	const button = document.createElement('button');
	button.innerText = "生成10组";
	button.onclick = function() {
		callback(textarea);
	}
	div.append(button)
	fieldset.append(legend)
	fieldset.append(div)
	fieldset.append(textarea)
	document.body.append(fieldset);
}
commonDOM('用户信息', function(e) {
	let text = '';
	for (let i = 0; i < 10; i++) {
		const name = randomSurame(true, 3);
		const user = randomUserInfo();
		const email = randomEmail();
		const mobile = randomMobile();
		const tel = randomTel();
		text +=
			`姓名：${name}\r\n年龄：${user.age}\n性别：${user.sex}\n出生日期：${user.birth}\n地址：${user.address}\n身份证号码：${user.id}\n手机电话：${mobile}\n固定电话：${tel}\n电子邮箱：${email}\n`
		text += '\n'
	}
	e.value = text;
});
commonDOM('随机电话', function(e) {
	let text = '';
	for (let i = 0; i < 10; i++) {
		const mobile = randomMobile();
		text += mobile + '\n';
	}
	e.value = text;
});
commonDOM('随机邮箱', function(e) {
	let text = '';
	for (let i = 0; i < 10; i++) {
		const mobile = randomEmail();
		text += mobile + '\n';
	}
	e.value = text;
});
commonDOM('随机固话', function(e) {
	let text = '';
	for (let i = 0; i < 10; i++) {
		const mobile = randomTel();
		text += mobile + '\n';
	}
	e.value = text;
});