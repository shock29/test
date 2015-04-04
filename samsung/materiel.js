// JavaScript Document
/**
 * 一个全局上下文对象
 */
var context = {
    /**
     * conFilter地址
     */
    conFilterUrl : 'http://weiboapi.offline.bae.baidu.com/service/confilter/',
    
    /**
     * 表单重置事件，在重置表单时需要做的额外事情，在业务逻辑中重写
     */
    onReset : function(){},
    /**
     * 是否允许提交表单，用于“远程验证并提交表单”模式下，在远程验证进行过程中，阻止表单提交
     */
    isSubmitAllow : true,
    /**
     * conFilter结果. key是表单元素的id，value是该元素的过滤结果
     * @type {Object.<string, boolean>}
     */
    filterResult : {}
};

/**
 * 姓氏列表
 */
var FAMILY_NAME = ["李", "王", "张", "刘", "陈", "杨", "赵", "黄", "周", "吴", "徐", "孙", "胡", "朱", "高", "林", "何", "郭", "马", "罗", "梁", "宋", "郑", "谢", "韩", "唐", "冯", "于", "董", "萧", "程", "曹", "袁", "邓", "许", "傅", "沈", "曾", "彭", "吕", "苏", "卢", "蒋", "蔡", "贾", "丁", "魏", "薛", "叶", "阎", "余", "潘", "杜", "戴", "夏", "钟", "汪", "田", "任", "姜", "范", "方", "石", "姚", "谭", "廖", "邹", "熊", "金", "陆", "郝", "孔", "白", "崔", "康", "毛", "邱", "秦", "江", "史", "顾", "侯", "邵", "孟", "龙", "万", "段", "章", "钱", "汤", "尹", "黎", "易", "常", "武", "乔", "贺", "赖", "龚", "文", "庞", "樊", "兰", "殷", "施", "陶", "洪", "翟", "安", "颜", "倪", "严", "牛", "温", "芦", "季", "俞", "章", "鲁", "葛", "伍", "韦", "申", "尤", "毕", "聂", "丛", "焦", "向", "柳", "邢", "路", "岳", "齐", "沿", "梅", "莫", "庄", "辛", "管", "祝", "左", "涂", "谷", "祁", "时", "舒", "耿", "牟", "卜", "路", "詹", "关", "苗", "凌", "费", "纪", "靳", "盛", "童", "欧", "甄", "项", "曲", "成", "游", "阳", "裴", "席", "卫", "查", "屈", "鲍", "位", "覃", "霍", "翁", "隋", "甘", "景", "薄", "单", "包", "司", "柏", "宁", "柯", "阮", "桂", "闵", "解", "柴", "华", "车", "冉", "房", "边", "辜", "吉", "饶", "刁", "瞿", "戚", "丘", "古", "米", "池", "滕", "晋", "苑", "邬", "臧", "畅", "宫", "来", "嵺", "苟", "全", "褚", "廉", "简", "娄", "盖", "符", "奚", "木", "穆", "党", "燕", "郎", "邸", "冀", "谈", "姬", "屠", "连", "郜", "晏", "栾", "郁", "商", "蒙", "喻", "揭", "窦", "宇", "敖", "糜", "鄢", "冷", "卓", "花", "仇", "艾", "蓝", "都", "巩", "稽", "井", "练", "仲", "乐", "虞", "卞", "封", "竺", "冼", "原", "衣", "楚", "佟", "栗", "匡", "宗", "应", "台", "巫", "鞠", "僧", "桑", "荆", "谌", "扬", "明", "沙", "薄", "伏", "岑", "习", "胥", "保", "蔺", "濮", "狄", "闫", "芮", "皮", "司徒", "上官", "闾丘", "司马", "诸葛", "黑", "惠"];

var getFormParam;

function inputCheck(obj, t) {
    if (!(VALUES[obj.id] && VALUES[obj.id].value)) {
        return;
    }
    if (t == 'b' && '' == obj.value) {
        obj.value = VALUES[obj.id].value;
    }
    if (t == 'f' && obj.value == VALUES[obj.id].value) {
        obj.value = '';
    }
    obj.className = VALUES[obj.id].value == obj.value ? obj.id+'_def' : obj.id+'_nor';
}
function selectCheck(obj, eventType) {
    if (!obj.getAttribute('hasDefault')) {
        return;
    }
    if(obj.tagName.toLowerCase() == 'select'){
        if(eventType && eventType == 'focus')obj.className = obj.id+'_nor';
        else obj.className = obj.selectedIndex == 0 ? obj.id+'_def' : obj.id+'_nor';
    }else{
        obj.className = mcui.Selector.getSelectedIndex(obj) == 0 ? 'soSelect '+obj.id+'_def' : 'soSelect '+obj.id+'_nor';
    }
}
function initInputSelectEvent() {
    var wrapEle = baidu.g("wrapper");
    var itexts = wrapEle.getElementsByTagName('input');
    for (var i = 0; i < itexts.length; i++) {
        if (itexts[i].type == 'text' && VALUES[itexts[i].id]) {
            if (VALUES[itexts[i].id].value && VALUES[itexts[i].id].value == itexts[i].value) {
                itexts[i].className = itexts[i].id+'_def';
            }
            itexts[i].onblur = function() { inputCheck(this, 'b'); };
            itexts[i].onfocus = function() { inputCheck(this, 'f'); };
        }
    }

    var iselects = wrapEle.getElementsByTagName('select');
    for (i = 0; i < iselects.length; i++) {
        selectCheck(iselects[i]);
        iselects[i].onchange = function() { selectCheck(this); };
        iselects[i].onblur = function() { selectCheck(this); };
        iselects[i].onmousedown = function() { selectCheck(this, 'focus'); };//onfocus在IE中改变select的样式会导致第一次点击没有dropdown
    }
    var soselects = baidu.dom.q('soSelect', wrapEle, 'div');
    for (i = 0; i < soselects.length; i++) {
        selectCheck(soselects[i]);
        soselects[i].onclick = function() { selectCheck(this); };
    }
}
var Log={};
Log.high = function(obj) {
    baidu.dom.addClass(obj, 'ec_inputerr');
};
Log.low = function() {
    var inputerrs=baidu.dom.q('ec_inputerr', baidu.g("wrapper"));
    if(inputerrs.length>0){
        for(var i=0;i<inputerrs.length;i++){
            baidu.dom.removeClass(inputerrs[i], 'ec_inputerr');
        }
    }
};

function passwordChange(obj){
    if(obj.type=="text"){
        obj.style.display = "none";
        var id=obj.id.substring(4);
        baidu.g(id).style.display = "block";
        baidu.g(id).value="";
        baidu.g(id).focus();//加上
    }else{
        var id="txt_"+obj.id;
        var pass = obj.value;
        if(pass.length<1){
            obj.style.display = "none";
            baidu.g(id).style.display = "block";
        }
    }
}

function submitSuccess(){
    baidu.g('formPage').style.display='none';
    baidu.g('successPage').style.display='';
}

/*计算字符数（1个汉字=2个字符）*/
function truncation (str) {
    var hotwordsCnt;
    for(var j = 0,c = 0;j<str.length;j++){
        c++;
        if(str.charCodeAt(j)>127){
            c++;
        }           
    }
    hotwordsCnt = c;
    return hotwordsCnt; 
}
var U = {
    getPosition: function(el, parent) {
        if ('undefined' == typeof parent) {
            parent = document.body;
        }

        var left = el.offsetLeft, top = el.offsetTop;
        while ((el = el.offsetParent)) {
            var tag = el.tagName.toUpperCase();
            if (tag == 'HTML' || tag == 'BODY') {
                break;
            }
            left += (el.offsetLeft - el.scrollLeft) || 0;
            top += (el.offsetTop - el.scrollTop) || 0;
            if (el == parent) {
                left -= parent.offsetLeft;
                top -= parent.offsetTop;
                break;
            }
        }

        return { 'left': left, 'top': top };
    },
    
    /**
     * 发送监控请求
     * @param {string|number} t 监控代码
     * @param {boolean=} opt_isSendOther 可选，表示是否是将表单数据计入other字段
     */
    baiduAd: function(t, opt_isSendOther) {
        if(window.preventClkmk)return;
        var kw = document.getElementById("kw"),
            other = opt_isSendOther === true ? ('&other=' + base64.base64encode(encodeURIComponent(getFormParam(sForm).rawStrParam))) : '';
        //用baidu.sio.log来发送监控请求的原因是：IE下有一定概率请求会发不出去!
        baidu.sio.log(clkmk + 'plid=' + plid + '&xp=' + t + '&r=' + new Date().valueOf() + (kw != null ? '&q=' + encodeURIComponent(kw.value) : '') + other);
    }

};
var validator = (function() {
    var rules = [];
    
    /**
     * 添加验证对象 - 已废弃，请使用下方的add方法
     * @param {HTMLElement} elm 要验证的表单元素
     * @param {Function} rule 验证函数
     * @param {string} msg 错误文字
     * @param {string} position 错误的显示位置，取值方式为"left,below"，也可以为"left"，有效的关键字为left、right、below、above
     */
    this.add = function(elm, rule, msg, position) {
        var r = {};
        r.elm = elm;
        r.rule = rule;
        r.msg = msg;
        r.position = position;
        rules.push(r);

    };
    
    /**
     * 添加验证对象
     * @param {object} rule 验证对象
     * rule中各项含义如下：
     *  {HTMLElement} elm 要验证的表单元素
     *  {HTMLElement} altElm 可选参数，在elm隐藏（不占面积）时，用它来定位
     *  {Function} rule 验证函数
     *  {string} msg 错误文字
     *  {string} position 错误的显示位置，取值方式为"left,below"，也可以为"left"，有效的关键字为left、right、below、above
     */
    this.add = function(rule) {
        if (rule == null) {
            return;
        }
        rule = rule || {};
        rules.push(rule);

        if ('undefined' != typeof rule.elm) {
            //当出现错误提示时，通过点击错误提示对应的选择框去掉错误提示
            baidu.event.on(rule.elm, 'mousedown', function() { hideError(this); });
            rule.altElm && baidu.event.on(rule.altElm, 'mousedown', function() { hideError(this); });

            function hideError(sel) {
                if (validator.errorContainer && sel == validator.errorContainer.holder) {
                    Log.low();
                    baidu.dom.setStyles(validator.errorContainer, { 'visibility': 'hidden' });
                    validator.setErrorBGVisible(false);
                }
            }
        }
    };
    this.setErrorBGVisible = function(state){
        if(state){
            this.errorBG.style.width = parseInt(this.errorContainer.offsetWidth)+"px";
            this.errorBG.style.height = parseInt(this.errorContainer.offsetHeight)+"px";
            this.errorBG.style.top = this.errorContainer.style.top;
            this.errorBG.style.left = this.errorContainer.style.left;
            this.errorBG.style.zIndex = this.errorContainer.style.zIndex - 1;
            this.errorBG.style.visibility = "visible";
        }else{
            this.errorBG.style.visibility = "hidden";
        }
    };
    
    /**
     * 验证所有控件
     * @param {
     *     'returnError' : boolean=, // 有时在控件错误时并不需要显示错误，而仅仅只需要知道验证同没通过，所以增加此参数来区分。
     *     'validateElement' : string=, // 其为空或undefined表示验证所有元素，否则验证指定的元素
     *     'rule' : Object // 验证一个指定的rule，而不验证rules中保存的所有rule
     * } options 可选功能
     * 
     */
    this.valid = function(options) {
        options = options || {};
        if(options.rule){
            _rules = [options.rule];
        }else{
            _rules = rules;
        }
        if(options.preventClkmk){
            window.preventClkmk = true;
        }
        Log.low();
        baidu.dom.setStyles(this.errorContainer, { 'visibility': 'hidden' });
        this.setErrorBGVisible(false);
        for (var i = 0; i < _rules.length; i++) {
            var r = _rules[i];
            if ((!options.validateElement || (new RegExp('(^|[\\s,;，；])' + r.elm.id + '([\\s,;，；]|$)')).test(options.validateElement)) && !r.rule()) {
                this.errorContainer.innerHTML = r.msg;
                var elm = r.elm;
                if(elm.offsetWidth <= 0 && r.altElm){//目标元素处于隐藏状态，使用altElm
                    elm = r.altElm;
                }
                //如果设置了returnError，将错误直接返回，不显示
                if(options.returnError){
                    window.preventClkmk = false;
                    return {
                        isPass : false,
                        errorElm : elm,
                        errorMsg : r.msg
                    };
                }
                var offX, offY;
                var elmPos = U.getPosition(elm, baidu.g('wrapper'));
                var elmWith = elm.offsetWidth;
                var elmHeight = elm.offsetHeight;
                var position = {
                    'horizontal' : 'left', 
                    'vertical' : 'below'
                };
                var minWidth = 48;
                //将错误容器的宽度设置成真实宽度后，才能计算真实的高度。
                this.errorContainer.style.width = ((elmWith-20-2 < minWidth) ? minWidth : (elmWith-20-2)) + 'px';//减20是因为padding，减2是因为border
                if(r.position){
                    if(r.position.indexOf('right') > -1){
                        position.horizontal = 'right';
                    }
                    if(r.position.indexOf('above') > -1){
                        position.vertical = 'above';
                    }
                }
                if (position.horizontal == 'right') {
                    offX = elmPos.left + elmWith - this.errorContainer.offsetWidth;
                } else {
                    offX = elmPos.left;
                }
                if (position.vertical == 'above') {
                    offY = elmPos.top;
                    offY -= this.errorContainer.offsetHeight;
                } else {
                    offY = elmPos.top;
                    offY += elmHeight;
                }
                /*if(baidu.browser.ie && baidu.browser.ie>7){
                    offX-=1;
                }else{
                    offY+=1;
                }*/
                
                baidu.dom.setStyles(this.errorContainer, {
                    'left': offX + 'px',
                    'top': offY + 'px',
                    'visibility': 'visible'
                });
                this.setErrorBGVisible(true);
                this.errorContainer.holder = elm;
                Log.high(elm);
                window.preventClkmk = false;
                return false;
            }
        }
        window.preventClkmk = false;
        //如果设置了returnError，返回一个Object表示验证通过
        if(options.returnError){
            return {
                isPass : true,
                errorElm : null,
                errorMsg : ''
            };
        }else{
            return true;
        }
    };

    this.setDefault = function(obj) {
        for (var k in obj) {
            this[k] = obj[k];
        }
    };

    return {
        add: this.add,
        valid: this.valid,
        setDefault: this.setDefault,
        setErrorBGVisible: this.setErrorBGVisible
    };
})();

/**
 * 常用的验证规则
 */
var VALIDATE_RULES_MAP = {
    /**
     * 身份证验证rule
     */
    'identity' : function(value, defaultValue, ele){
        value = baidu.string.trim(value);
        
        if (value == '' || value == defaultValue) {
            return false;
        }
        if(checkIdentity(value) === "0"){
            return true;
        }else{
            return false;
        }
    },
    
    /**
     * 姓名验证rule
     */
    'name' : function(value, defaultValue, ele){
        value = baidu.string.trim(value);
        
        if (value == '' || value == defaultValue) {
            return false;
        }
        if (truncation(value) < 4 || truncation(value) > 8) {
            return false;
        }
        for (var i = 0, l = value.length; i < l; i++) {
            if (!/[\u4E00-\u9FA5]/.test(value.charAt(i))) {
                return false;
            }
        }
        var isMatch = false;
        for (var i = 0, l = FAMILY_NAME.length; i < l; i++){
            if(value.substr(0, FAMILY_NAME[i].length) == FAMILY_NAME[i]){
                isMatch = true;
                break;
            }
        }
        if(!isMatch){
            return false;
        }
        
        //敏感词过滤结果判断
        if(context.filterResult[ele.name] === false){
            return false;
        }
        
        return true;
    },
    
    /**
     * Email验证rule
     */
    'email' : function(value, defaultValue, ele){
        value = baidu.string.trim(value);
        
        if (value == '' || value == defaultValue) {
            return false;
        }
        var mailreg = /^[a-z0-9]([a-z0-9]*[-_\.]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$/i;
        if (mailreg.test(value)) {
            return true;
        }else {
            return false;
        }
    },
    
    /**
     * 手机或电话的验证rule
     */
    'phone' : function(value, defaultValue, hasCell, hasPhone, ele){
        value = baidu.string.trim(value);
        
        if (value == '' || value == defaultValue) {
            return false;
        }
        var rtn1 = true,//for cell
            rtn2 = true;//for phone
        if (value.charAt(0) == '1') {
            var telreg1 = new RegExp('^13\\d{9}$'),
                telreg2 = new RegExp('^14[57]\\d{8}$'),
                telreg3 = new RegExp('^15[0-35-9]\\d{8}$'),
                telreg4 = new RegExp('^18[0-9]\\d{8}$');
            if (!telreg1.test(value)
                && !telreg2.test(value)
                && !telreg3.test(value)
                && !telreg4.test(value)) {
                rtn1 = false;
            }
        } else {
            rtn1 = false;
        }

        if(value.charAt(0) == '0') {
            var phone = value,
                reg = new RegExp('^0[1-9]\\d{1,2}[_—+-]?\\d{7,8}[_—+-]?\\d{0,5}$');
            if (!reg.test(phone)) {
                rtn2 = false;
            }
        } else {
            rtn2 = false;
        }

        //for cell
        if(hasCell && !hasPhone && !rtn1) {
            return false;
        }
        //for phone
        if(hasPhone && !hasCell && !rtn2) {
            return false;
        }
        //for cell or phone
        if(hasPhone && hasCell && !rtn1 && !rtn2) {
            return false;
        }
        
        return true;
    },
    
    /**
     * 账号验证rule
     */
    'account' : function(value, defaultValue, ele){
        value = baidu.string.trim(value);
        
        if (value == '' || value == defaultValue) {
            return false;
        }
        var reg = new RegExp(/^[a-zA-Z][a-zA-Z0-9]{5,15}$/);//不超过7个汉字，或14个字节(数字，字母和下划线)
        if (reg.test(value)) {
            return true;
        }else {
            return false;
        }
    },
    
    /**
     * 正则验证rule
     */
    'reg' : function(value, defaultValue, regExp, ele){
        value = baidu.string.trim(value);
        
        if (value == '' || value == defaultValue) {
            return false;
        }
        var reg = new RegExp(regExp);
        if (reg.test(value)) {
            return true;
        }else {
            return false;
        }
    },
    
    /**
     * 下拉框默认选择验证rule
     */
    'notdefault' : function(value, ele){
        return !(value == 0);
    },
    
    /**
     * 密码5-10验证rule
     */
    'password5-10' : function(value, defaultValue, ele){
        value = baidu.string.trim(value);
        var reg = new RegExp(/^[a-zA-Z0-9]{5,10}$/);//长度为5-10的数字或字母
        if (reg.test(value)) {
            return true;
        } else {
            return false;
        }
    }
};

/**
 * 验证身份证号码是否正确
 * @param {string} idcard 身份证号码
 * @return {string} 错误代码，'0'代表成功，其他代码错误
 */
function checkIdentity(idcard) {
    var Errors=new Array(
        "0",
        "1",//"身份证号码位数不对!",
        "2",//"身份证号码出生日期超出范围或含有非法字符!",
        "3",//"身份证号码校验错误!",
        "4" //"身份证地区非法!"
    );
    var area = {11:"北京", 12:"天津", 13:"河北", 14:"山西", 15:"内蒙古", 21:"辽宁", 22:"吉林", 23:"黑龙江", 31:"上海", 32:"江苏", 33:"浙江", 34:"安徽", 35:"福建", 36:"江西", 37:"山东", 41:"河南", 42:"湖北", 43:"湖南", 44:"广东", 45:"广西", 46:"海南", 50:"重庆", 51:"四川", 52:"贵州", 53:"云南", 54:"西藏", 61:"陕西", 62:"甘肃", 63:"青海", 64:"宁夏", 65:"新疆", 71:"台湾", 81:"香港", 82:"澳门", 91:"国外"};
    var idcard,Y,JYM;
    var S,M;
    var idcard_array = new Array();
    idcard_array = idcard.split("");
    //地区检验
    if(area[parseInt(idcard.substr(0,2))]==null)
        return Errors[4];
    //身份号码位数及格式检验
    switch(idcard.length) {
        case 15:
            if ( (parseInt(idcard.substr(6,2))+1900) % 4 == 0 || ((parseInt(idcard.substr(6,2))+1900) % 100 == 0 && (parseInt(idcard.substr(6,2))+1900) % 4 == 0 )) {
                ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;//测试出生日期的合法性
            } else {
                ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;//测试出生日期的合法性
            }
            if(ereg.test(idcard))
                return Errors[0];
            else
                return Errors[2];
            break;
        case 18:
            //18位身份号码检测
            //出生日期的合法性检查
            //闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
            //平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
            if ( parseInt(idcard.substr(6,4)) % 4 == 0 || (parseInt(idcard.substr(6,4)) % 100 == 0 && parseInt(idcard.substr(6,4))%4 == 0 )) {
                ereg=/^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;//闰年出生日期的合法性正则表达式
            } else {
                ereg=/^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;//平年出生日期的合法性正则表达式
            }
            if(ereg.test(idcard)) {//测试出生日期的合法性
                //计算校验位
                S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7
                + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9
                + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10
                + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5
                + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8
                + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4
                + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2
                + parseInt(idcard_array[7]) * 1
                + parseInt(idcard_array[8]) * 6
                + parseInt(idcard_array[9]) * 3 ;
                Y = S % 11;
                M = "F";
                JYM = "10X98765432";
                M = JYM.substr(Y,1);//判断校验位
                if(M == idcard_array[17])
                    return Errors[0]; //检测ID的校验位
                else
                    return Errors[3];
            } else
                return Errors[2];
            break;
        default:
            return Errors[1];
            break;
    }
}

/**
 * base64编解码
 */
var base64 = {
    base64EncodeChars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    base64DecodeChars: new Array(
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
        52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
        -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
        -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
    ),
    base64encode: function(str) {
        var returnVal, i, len;
        var c1, c2, c3;
        len = str.length;
        i = 0;
        returnVal = "";
        while(i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if(i == len) {
                returnVal += this.base64EncodeChars.charAt(c1 >> 2);
                returnVal += this.base64EncodeChars.charAt((c1 & 0x3) << 4);
                returnVal += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if(i == len) {
                returnVal += this.base64EncodeChars.charAt(c1 >> 2);
                returnVal += this.base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
                returnVal += this.base64EncodeChars.charAt((c2 & 0xF) << 2);
                returnVal += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            returnVal += this.base64EncodeChars.charAt(c1 >> 2);
            returnVal += this.base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
            returnVal += this.base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
            returnVal += this.base64EncodeChars.charAt(c3 & 0x3F);
        }
        return returnVal;
    },
    base64decode: function(str) {
        var c1, c2, c3, c4;
        var i, len, returnVal;
        len = str.length;
        i = 0;
        returnVal = "";
        while(i < len) {
            /* c1 */
            do {
                c1 = this.base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while(i < len && c1 == -1);
            if(c1 == -1)break;
            /* c2 */
            do {
                c2 = this.base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while(i < len && c2 == -1);
            if(c2 == -1)break;
            returnVal += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
            /* c3 */
            do {
                c3 = str.charCodeAt(i++) & 0xff;
                if(c3 == 61)return returnVal;
                c3 = this.base64DecodeChars[c3];
            } while(i < len && c3 == -1);
            if(c3 == -1)break;
            returnVal += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
            /* c4 */
            do {
                c4 = str.charCodeAt(i++) & 0xff;
                if(c4 == 61)
                return returnVal;
                c4 = this.base64DecodeChars[c4];
            } while(i < len && c4 == -1);
            if(c4 == -1)break;
            returnVal += String.fromCharCode(((c3 & 0x03) << 6) | c4);
        }
        return returnVal;
    }
};

var mcui = (function() {
    this.Selector = (function() {
        var attachedEvent = false;
        var count = 0;
        var hideSelectList = function() {
            var uls = baidu.dom.q('options', sForm, 'ul');
            for (var i = 0, l = uls.length; i < l; i++) {
                uls[i].style.display = 'none';
            }
        };

        var bodyClick = function(e) {
            e = e || window.event;

            var elm = e.target || e.srcElement;
            while ((elm = elm.parentNode)) {
                if (elm.className && elm.className.indexOf('soSelect') > -1) {
                    return;
                }
            }
            hideSelectList();
        };
        
        var setInputValue = function(selCtrl, value){
            selCtrl.getElementsByTagName('input')[0].value = value;
            window[selCtrl.id + 'Change'] && window[selCtrl.id + 'Change'].call(null);
        };

        this.GetValue = function(selCtrl) {
            return selCtrl.getElementsByTagName('input')[0].value;
        };
        this.SetSelectedIndex = function(selCtrl, index) {
            var options = baidu.dom.q('options', selCtrl, 'ul')[0].getElementsByTagName('a');
            if (index >= 0 && options && index < options.length) {
                var a = options[index];
                baidu.dom.q('option_current', selCtrl, 'div')[0].innerHTML = a.innerHTML;
                if (a.getAttribute('data-value') != null) {
                    setInputValue(selCtrl, a.getAttribute('data-value'));
                } else {
                    setInputValue(selCtrl, a.innerHTML);
                }
            }
        };
        this.getSelectedIndex = function(selCtrl) {
            var options = baidu.dom.q('options', selCtrl, 'ul')[0].getElementsByTagName('a'),
                value = mcui.Selector.GetValue();
            if (options && options.length > 0) {
                for(var i = 0; i < options.length; i++){
                    var a = options[i],
                        aValue = a.getAttribute('data-value') != null ? a.getAttribute('data-value') : a.innerHTML;
                    if(aValue == value){
                        return i;
                    }
                }
            }
        };
        this.getValueByIndex = function(selCtrl, index) {
            var options = baidu.dom.q('options', selCtrl, 'ul')[0].getElementsByTagName('a');
            if (index >= 0 && options && index < options.length) {
                var a = options[index];
                return a.getAttribute('data-value') != null ? a.getAttribute('data-value') : a.innerHTML;
            }
            return '';
        };
        this.Init = function(selCtrl) {
            selCtrl.style.zIndex = 10 - count;
            count++;

            if (!attachedEvent) {
                baidu.event.on(document.body, 'click', bodyClick);
                attachedEvent = true;
            }

            var current = baidu.dom.q('option_current', selCtrl, 'div')[0];
            baidu.event.on(current, 'click', function(e) {
                e = e || window.event;
                var clkelm = this.parentNode || e.srcElement.parentNode.parentNode;
                var ul = baidu.dom.q('options', clkelm, 'ul')[0];
                var ul_old_display = ul.style.display;//在hideSelectList前先保存当前下拉框的显示状态
                hideSelectList();
                if (ul_old_display == 'block') {
                    ul.style.display = 'none';
                }
                else {
                    ul.style.display = 'block';
                }
                return false;
            });
            baidu.event.on(baidu.dom.q('option_arrow', selCtrl, 'div')[0], 'click', function(e) {
                e = e || window.event;
                var clkelm = this.parentNode || e.srcElement.parentNode.parentNode.parentNode.parentNode;
                var ul = baidu.dom.q('options', clkelm, 'ul')[0];
                var ul_old_display = ul.style.display;//在hideSelectList前先保存当前下拉框的显示状态
                hideSelectList();
                if (ul_old_display == 'block') {
                    ul.style.display = 'none';
                }
                else {
                    ul.style.display = 'block';
                }
                return false;
            });
        };

        this.SetSelectedItem = function(selCtrl, item) {
            if (selCtrl == null || item == null) {
                return;
            }
            baidu.dom.q('option_current', selCtrl, 'div')[0].innerHTML = item.text;
            setInputValue(selCtrl, item.value);
        };

        this.AddItem = function(selCtrl, item) {
            var ul = baidu.dom.q('options', selCtrl, 'ul')[0];
            var li = baidu.dom.create('li');
            var a = baidu.dom.create('a', {
                'href': 'javascript:;',
                'data-value': item.value,
                'title': item.text
            });
            a.innerHTML = item.text;
            li.appendChild(a);
            ul.appendChild(li);
            baidu.event.on(a, 'click', function(e) {
                e = e || window.event;
                var clkelm = this.parentNode || e.srcElement.parentNode;
                var selCtrl = clkelm.parentNode.parentNode;
                baidu.dom.q('option_current', selCtrl, 'div')[0].innerHTML = this.innerHTML || e.srcElement.innerHTML;
                baidu.dom.q('options', selCtrl, 'ul')[0].style.display = 'none';
                var aElm = this.getAttribute ? this : e.srcElement;
                if (aElm.getAttribute('data-value') != null) {
                    setInputValue(selCtrl, aElm.getAttribute('data-value'));
                } else {
                    setInputValue(selCtrl, aElm.innerHTML);
                }
                if ('undefined' != typeof selCtrl.onvaluechanged) {
                    selCtrl.onvaluechanged();
                }
            });
        };

        this.AddItems = function(selCtrl, items) {
            if (items && items.length) {
                for (var i = 0, l = items.length; i < l; i++) {
                    var item = items[i];
                    mcui.Selector.AddItem(selCtrl, { text: item.text, value: item.value });
                }
            }
        };

        this.ClearItem = function(selCtrl) {
            var ctrlul = selCtrl.getElementsByTagName('ul')[0];
            ctrlul.innerHTML = '';
            baidu.dom.q('option_current', selCtrl, 'div')[0].innerHTML = '';
        };
        return {
            GetValue: this.GetValue,
            Init: this.Init,
            AddItem: this.AddItem,
            AddItems: this.AddItems,
            ClearItem: this.ClearItem,
            SetSelectedIndex: this.SetSelectedIndex,
            SetSelectedItem: this.SetSelectedItem,
            getSelectedIndex: this.getSelectedIndex,
            getValueByIndex: this.getValueByIndex
        };
    })();

    return { Selector: this.Selector };
})();

function o(str){document.writeln(str);}

function initSelect(selEle, data){
    selEle.innerHTML = "";
    for (var i = 0;i<data.length;i++) {
        var option = baidu.dom.create("option", {
            "value": data[i].value,
            "title" : data[i].text
        });
        option.innerHTML = data[i].text;
        selEle.appendChild(option);
    }
}

/**
 * 下拉框联动功能
 */
var DATA_MAP = {};
function initSelectDependency(){
    //生成Map
    baidu.object.each(SELECT_DEPENDENCY, function(item, key){
        var ds = item.datasource;
        function genMap(ds, prefix, map){
            var children = ds.children;
            if(!map){
                map = {};
                ds = baidu.object.clone(ds);
            }
            var curKey = '';
            if(typeof prefix == 'undefined'){
                curKey = ds.value;
            }else{
                curKey = prefix + '\uDEAD' + ds.value;
            }
            map[curKey] = ds;
            if(children && children.length > 0){
                for(var i = 0; i < children.length; i++){
                    arguments.callee(children[i], curKey, map);
                }
            }
            return map;
        }
        DATA_MAP[key] = genMap(ds);
    });
    function getMapKey(idArr, key){
        var partArr = [key];
        for(var i = 0; i < idArr.length; i++){
            partArr.push(baidu.g(idArr[i]).value);
        }
        return partArr.join('\uDEAD');
    }
    //绑定事件
    baidu.object.each(SELECT_DEPENDENCY, function(item, key){
        var dpd = item.dependency,
            ds = item.datasource;
        if(dpd.length > 0){
            initSelect(baidu.g(dpd[0]), ds.children);
            for(var i = dpd.length - 1; i >= 0; i--){
                var id = dpd[i];
                if(i < dpd.length - 1){
                    window[id + 'Change'] = function(){
                        var _id = dpd[i],
                            nextId = dpd[i + 1],
                            _key = key,
                            _i = i,
                            _dpd = dpd;
                        return function(){
                            //先去除下一个联动元素的处理函数(防止多次调用)
                            window[nextId + 'Change'] && baidu.event.un(baidu.g(nextId), 'change', window[nextId + 'Change']);
                            //更新下一个联动元素的选项
                            var idArr = _dpd.slice(0, _i + 1),
                                mapKey = getMapKey(idArr, _key);
                            initSelect(baidu.g(nextId), DATA_MAP[_key][mapKey].children || []);
                            //调用下一个联动函数
                            window[nextId + 'Change'] && window[nextId + 'Change'].call(null);
                            //最后加上下一个联动元素的处理函数
                            window[nextId + 'Change'] && baidu.event.on(baidu.g(nextId), 'change', window[nextId + 'Change']);
                        };
                    }();
                    baidu.event.on(baidu.g(id), 'change', window[id + 'Change']);
                }
            }
            window[dpd[0] + 'Change'] && window[dpd[0] + 'Change'].call(null);
        }
    });
}

/**
 * 远程验证与提交方式
 */
var validateResult = {
    isPass : false,
    errorElm : null,
    errorMsg : ''
};

getFormParam = function (form, nameFilter) {
    var elements    = form.elements,
        len         = elements.length,
        data = [],
        raw = [],
        map = {},
        i, item, itemType, itemName, itemValue, 
        opts, oi, oLen, oItem;
        
    /**
     * 向缓冲区添加参数数据
     * @private
     */
    function addData(name, value) {
        data.push(name + '=' + encodeURIComponent(value));
        raw.push(name + '=' + value);
        if(map[name]){
            if(!baidu.lang.isArray(map[name])){
                map[name] = [map[name]];
            }
            map[name].push(value);
        }else{
            map[name] = value;
        }
    }
    
    for (i = 0; i < len; i++) {
        item = elements[i];
        itemName = item.name;
        
        // 处理：可用并包含表单name的表单项
        if (!item.disabled && itemName
                /*&& item.getAttribute('control')*/
                && (!nameFilter || nameFilter && (new RegExp('(^|[\\s,;，；])' + itemName + '([\\s,;，；]|$)')).test(nameFilter))) {
            itemType = item.type;
            itemValue = item.value;
        
            switch (itemType) {
            // radio和checkbox被选中时，拼装queryString数据
            case 'radio':
            case 'checkbox':
                if (!item.checked) {
                    break;
                }
                
            // 默认类型，拼装queryString数据
            case 'textarea':
            case 'text':
            case 'password':
            case 'hidden':
            case 'select-one':
                addData(itemName, itemValue);
                break;
                
            // 多行选中select，拼装所有选中的数据
            case 'select-multiple':
                opts = item.options;
                oLen = opts.length;
                for (oi = 0; oi < oLen; oi++) {
                    oItem = opts[oi];
                    if (oItem.selected) {
                        addData(itemName, oItem.value);
                    }
                }
                break;
            }
        }
    }
    
    // 完善发送请求的参数选项
    return {
        strParam : data.join('&'),
        rawStrParam : raw.join('&'),
        paramMap : map
    };
};

function showError(elm, msg){
    var tmprule = {
        'elm': elm,
        'rule': function() {
            return false;
        },
        'msg': msg
    };
    validator.valid({
        rule : tmprule
    });
}

function remoteValidate(options){
    var formSetting = FORM_SETTING;
    options = options || {};
    context.isSubmitAllow = true;
    var param;
    if(VALIDATE_ELEMENT == 'custom'){
        param = getFormParam(sForm, VALIDATE_ELEMENT_CUSTOM);
    }else{
        param = getFormParam(sForm);
    }
    var vurl = VALIDATE_URL + (/\?/.test(VALIDATE_URL) ? '&' : '?') + param.strParam,
        localPass = true;
    if(options.localValidate){
        var localValidateResult = validator.valid({
            'returnError' : true,
            'preventClkmk' : true,
            'validateElement' : (VALIDATE_ELEMENT == 'custom' ? VALIDATE_ELEMENT_CUSTOM : '')
        });
        if(localValidateResult.isPass === false){
            validateResult = localValidateResult;
            options.validateAndSubmit && showError(posElm, item);
            localPass = false;
        }
    }
    if(localPass){
        baidu.g('submitBtn').disabled = true;
        context.isSubmitAllow = false;
        baidu.sio.callByServer(vurl, function(data){
            baidu.g('submitBtn').disabled = false;
            context.isSubmitAllow = true;
            if(data.result.toString() == 'true'){
                //验证通过
                validateResult.isPass = true;
                validateResult.errorElm = null;
                options.validateAndSubmit && onSubmitSuccess();
            }else{
                var message = data.message;
                validateResult.isPass = false;
                function getPositionElm(id){
                    var el = baidu.g(id);
                    if(!el){
                        return null;
                    }else{
                        if(el.offsetWidth <= 0){
                            el = baidu.g('txt_' + id);
                            if(!el || el.offsetWidth <= 0){
                                return null;
                            }
                        }
                    }
                    return el;
                }
                if(message){
                    var hasError = false;
                    baidu.object.each(message, function(item, name){
                        if(hasError)return;
                        var posElm = getPositionElm(name);
                        if(posElm == null)posElm = getPositionElm(formSetting.refererElm);
                        validateResult.errorElm = posElm;
                        validateResult.errorMsg = item;
                        options.validateAndSubmit && showError(posElm, item);
                        hasError = true;
                    });
                }else{
                    //未知错误
                    var posElm = getPositionElm(formSetting.refererElm);
                    validateResult.errorElm = posElm;
                    validateResult.errorMsg = '未知错误!';
                    options.validateAndSubmit && showError(posElm, '未知错误!');
                }
            }
        });
    }
}
function onSubmitSuccess(){
    var formSetting = FORM_SETTING;
    //往adrc发请求
    var loc = new String(window.location);
    var parIndex = loc.search(/(\?|&)par=/);
    var adrcUrl = loc.slice(parIndex + 5);
    if (parIndex !== -1) {
        baidu.sio.log(adrcUrl);
    }
    //clickmonkey
    U.baiduAd(ADLOG[formSetting.successCodeIndex], (formSetting.formOtherField == 'yes'));
    //提交量监测（客户）
    formSetting.formCustomMonitor == 'yes' && baidu.sio.log(
        formSetting.formCustomMonitorUrl.replace('[timestamp]', (new Date()).getTime())
    );
    //翻页到成功提示
    if(formSetting.showNewContent == "yes"){
        setTimeout(submitSuccess, 0);
    }
    //重置表单
    if(formSetting.formReset == "yes"){
        setTimeout(resetForm, 50);
    }
}
function exchangeCharset(){
    var temp;
    if (baidu.browser.ie && CHARSET != '' && document.charset != CHARSET) {
        temp = document.charset;
        document.charset = CHARSET;
        CHARSET = temp;
    }
}
var addRemoteValidateEvent = function (form, func, nameFilter) {
    var elements    = form.elements,
        len         = elements.length,
        i, item, itemType, itemName;
    
    for (i = 0; i < len; i++) {
        item = elements[i];
        itemName = item.name;
        
        // 处理：可用并包含表单name的表单项
        if (!item.disabled && itemName
                /*&& item.getAttribute('control')*/
                && (!nameFilter || nameFilter && (new RegExp('(^|[\\s,;，；])' + itemName + '([\\s,;，；]|$)')).test(nameFilter))) {
            itemType = item.type;
        
            switch (itemType) {
                case 'radio':
                case 'checkbox':
                    baidu.event.on(item, 'click', func);
                    break;
                case 'textarea':
                case 'text':
                case 'password':
                    baidu.event.on(item, 'keyup', func);
                    break;
                /*
                hidden类型的input控件值改变都是由js来触发的，那么远程验证函数也应由此处触发执行
                case 'hidden':
                    break;
                */
                case 'select-one':
                case 'select-multiple':
                    baidu.event.on(item, 'change', func);
                    break;
                default:break;
            }
        }
    }
};

function callConFilter(value, filterName, itemName){
    var cfUrl = baidu.format(context.conFilterUrl + '?type=#{filterName}&content=#{content}', {
        'filterName' : filterName,
        'content' : value
    });
    context.filterResult[itemName] = true;
    baidu.sio.callByServer(cfUrl, function(data){
        if(data.success == 'true' && data.result['is_pass'] == 'false'){
            context.filterResult[itemName] = false;
        }
    });
}

function initConFilter(){
    var filterEles = baidu.dom.query('[filter]', sForm);
    baidu.array.each(filterEles, function(ele){
        var itemName = ele.name,
            itemType = ele.type,
            filterName = baidu.dom.getAttr(ele, 'filter');
        
        switch (itemType) {
            case 'text':
                baidu.event.on(ele, 'keyup', function(){
                    callConFilter(ele.value, filterName, itemName);
                });
            default:break;
        }
    });
}

function initSubmitMethod(){
    //init conFilter
    initConFilter();
    var formSetting = FORM_SETTING;
    if(SUBMIT_METHOD == 'form'){
        sForm.onsubmit = function() {
            if (validator.valid()) {
                //在IE下将charset设置为CHARSET指定的编码
                exchangeCharset();
                //提交表单
                sForm.submit();
                //提交后的操作：（1）向adrc发送监控请求；（2）向clickmonkey发送监控请求；（3）可选，重置表单；（4）可选，显示成功提示页
                onSubmitSuccess();
                //在IE下将上一步设置的编码恢复成原有编码
                exchangeCharset();
            }else{
                //至少一项错误
                if(formSetting.atLeastOneError == 'yes'){
                    U.baiduAd(ADLOG[formSetting.atLeastOneErrorCodeIndex]);
                }
            }
            return false;
        };
    }else if(SUBMIT_METHOD == 'validate_form'){
        sForm.onsubmit = function() {
            if(!context.isSubmitAllow)return false;
            if (validator.valid()) {
                //判断远程验证是否成功
                if(validateResult.isPass){
                    //在IE下将charset设置为CHARSET指定的编码
                    exchangeCharset();
                    //提交表单
                    sForm.submit();
                    //提交后的操作：（1）向adrc发送监控请求；（2）向clickmonkey发送监控请求；（3）可选，重置表单；（4）可选，显示成功提示页
                    onSubmitSuccess();
                    //在IE下将上一步设置的编码恢复成原有编码
                    exchangeCharset();
                }else{
                    //在远程验证失败后，并且用户点了提交时才显示错误
                    if(validateResult.errorElm){
                        showError(validateResult.errorElm, validateResult.errorMsg);
                    }
                }
            }else{
                //至少一项错误
                if(formSetting.atLeastOneError == 'yes'){
                    U.baiduAd(ADLOG[formSetting.atLeastOneErrorCodeIndex]);
                }
            }
            return false;
        };
        
        //绑定表单元素改变事件：所有的或用户指定的控件改变时调用远程验证函数
        var toRValidate = function(){
            remoteValidate({
                'validateAndSubmit' : false,
                'localValidate' : true
            });
        };
        if(VALIDATE_ELEMENT == 'custom'){
            addRemoteValidateEvent(sForm, toRValidate, VALIDATE_ELEMENT_CUSTOM);
        }else{
            addRemoteValidateEvent(sForm, toRValidate);
        }
    }else if(SUBMIT_METHOD == 'validate'){
        sForm.onsubmit = function() {
            if (validator.valid()) {
                remoteValidate({
                    'validateAndSubmit' : true,
                    'localValidate' : false
                });
            }else{
                //至少一项错误
                if(formSetting.atLeastOneError == 'yes'){
                    U.baiduAd(ADLOG[formSetting.atLeastOneErrorCodeIndex]);
                }
            }
            return false;
        };
    }
}

function resetForm() {
    sForm.reset();
    baidu.object.each(SELECT_DEPENDENCY, function(item, key){
        var dpd = item.dependency,
            ds = item.datasource;
        if(dpd.length > 0){
            initSelect(baidu.g(dpd[0]), ds.children);
            window[dpd[0] + 'Change'] && window[dpd[0] + 'Change'].call(null);
        }
    });
    initValue();
    context.onReset();
}
