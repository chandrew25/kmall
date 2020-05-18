/**
 * 金额: 输入小数点后保留两位
 * @param {*} e 
 * @param {*} digit: 默认2位小数
 */
function numberLimit(e, digit) {
    if ( !digit ) digit = 2;
    var result = (e && e.target && e.target.value.match(/^\d*(\.?\d{0,1})/g)[0]) || null;
    return result;
}

/**
 * 校验是否正确的手机号码
 * @param {*} value 
 */
function isMobilePhone(value) {
    var reg = /^1[3456789]\d{9}$/
    return reg.test(value);
}

/**
 * 校验是否中国电话号码（包括移动和固定电话）
 * @param {*} value 
 */
function isPhone(value) {
    var reg = /(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}/
    return reg.test(value);
}

/**
 * 校验输入的身份证号是否正确
 * 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
 * 身份证18位组成：由十七位数字本体码和一位校验码组成。排列顺序从左到右依次为：六位数字地址码，八位数字出生日期码， 三位数字顺序码和一位数字校验码。
 * 地址码(前六位数)：表示编码对象常住户口所在县(市、旗、区)的行政区划代码
 * 出生日期码(第七位至十四位)：表示编码对象出生的年、月、日
 * 顺序码(第十五位至十七位)：表示在同一地址码所标识的区域范围内，对同年、同月、同日出生的人编定的顺序号，顺序码的奇数分配给男性，偶数分配给女性。
 * 校验码（第十八位数）：作为尾号的校验码，是由号码编制单位按统一的公式计算出来的，如果某人的尾号是0－9，都不会出现X，但如果尾号是10，那么就得用X来代替，因为如果用10做尾号，那么 此人的身份证就变成了19位。X是罗马数字的10，用X来代替10，可以保证公民的身份证符合国家标准
 * [参考]
 *      vue-elementUI中身份证验证: https://github.com/Believel/vueHoutaiPCModel/issues/3
 */
function isIdCard(value) {
    var vcity = { 
        11:"北京", 12:"天津", 13:"河北", 14:"山西", 15:"内蒙古", 
        21:"辽宁", 22:"吉林", 23:"黑龙江", 31:"上海", 32:"江苏", 
        33:"浙江", 34:"安徽", 35:"福建", 36:"江西", 37:"山东", 41:"河南", 
        42:"湖北", 43:"湖南", 44:"广东", 45:"广西", 46:"海南", 50:"重庆", 
        51:"四川", 52:"贵州", 53:"云南", 54:"西藏", 61:"陕西", 62:"甘肃", 
        63:"青海", 64:"宁夏", 65:"新疆", 71:"台湾", 81:"香港", 82:"澳门", 91:"国外"
    };
    //是否为空
    if ( value === '' ) {
        return false;
    }
    //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
    var reg = /(^\d{15}$)|(^\d{17}(\d|X|x)$)/;  
    if ( reg.test(value) === false ) {
        return false;  
    }
    //检查省份  
    var province = value.substr(0, 2);  
    if ( vcity[province] == undefined ) {  
        return false;
    }
    //校验生日
    var len = value.length;
    //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字  
    if ( len == '15' ) {
        var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
        var arr_data   = value.match(re_fifteen);
        var year  = arr_data[2];
        var month = arr_data[3];
        var day   = arr_data[4];
        var birthday = new Date('19'+year+'/'+month+'/'+day);
        
        var now = new Date();
        var now_year = now.getFullYear();
        year = '19' + year;
        //年月日是否合理 
        if ( birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day ) {
            //判断年份的范围（3岁到100岁之间)
            var time = now_year - year;
            if ( time < 3 || time > 100 ) {
                return false;
            }
        } else {
            return false; 
        }
    }
    value = value.toUpperCase();
    //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X  
    if ( len == '18' ) {
        var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
        var arr_data    = value.match(re_eighteen);
        var year  = arr_data[2];
        var month = arr_data[3];
        var day   = arr_data[4];
        var birthday = new Date(year + '/' + month + '/' + day);
        var now = new Date();  
        var now_year = now.getFullYear();
        //年月日是否合理  
        if ( birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day ) {
            //判断年份的范围（3岁到100岁之间)
            var time = now_year - year;
            if ( time < 3 || time > 100 ) {
                return false;
            }
        } else {
            return false; 
        }
    }
    //检验位的检测
    //15位转18位 
    if ( len == '15' ) {
        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);  
        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');  
        var cardTemp = 0, i;
        value = value.substr(0, 6) + '19' + value.substr(6, value.length - 6);
        for (i = 0; i < 17; i++) {
            cardTemp += value.substr(i, 1) * arrInt[i];  
        }  
        value += arrCh[cardTemp % 11];
    }
    len = value.length;
    if ( len == '18' ) {
        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
        var cardTemp = 0, i, valnum;
        for (i = 0; i < 17; i ++) {
            cardTemp += value.substr(i, 1) * arrInt[i];
        }
        valnum = arrCh[cardTemp % 11];
        if ( valnum == value.substr(17, 1) ) {
            return true;
        }
        return false;
    }
    return false;
}