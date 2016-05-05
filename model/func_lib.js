
//公共函数
//日期转换为毫秒
function DateToLong(s){
	if(s.replace(/\s/g,"") != ""){
		var a=s.split(/[^0-9]/);
		var d=new Date(a[0],a[1]-1,a[2]);
		return d.getTime();	
	}
	return "";
}
//公共函数
//错误处理，e错误处理函数,z正确处理函数
function dealError(data,z,e){
	if(data.state != 1001){
		e(data);
	}else{
		z(data);
	}
}
//公共函数
//ajaxRequest("/us/ii/oo",{"123":"444"},function(){alert("this is func")});
function ajaxRequest(url,data,func,async,post){
	var url_ = url == undefined ? "":url;
	var data_ = data == undefined ? {}:data;
	var func_ = func == undefined ? function(){}:func;
	var async_ = async==undefined ? false:async;
	var post_ = post==undefined ? "POST":post;
	$.ajax({
        type: "POST",
        url: url_,
        contentType: "application/json; charset=utf-8",
        data: data_,
        async:async_,
        dataType: "json",
        success:func_,
        error:function(data){
        	alert("连接错误！");
        }
    });
}
function ajaxRequest2(param){
	var url_ = param.url == undefined ? "":param.url;
	var data_ = param.data == undefined ? {}:param.data;
	var func_ = param.func == undefined ? function(){}:param.func;
	var async_ = param.async==undefined ? false:param.async;
	var post_ = param.post==undefined ? "POST":param.post;
	$.ajax({
        type: "POST",
        url: url_,
        contentType: "application/json; charset=utf-8",
        data: data_,
        async:async_,
        dataType: "json",
        success:func_,
        error:function(data){
        	alert("连接错误！");
        }
    });
}
//公共函数
//对象转换为字符串
function objConvertStr(o) {
	if (o == undefined) {
		return "";
	}
	var r = [];
	if (typeof o == "string") return "\"" + o.replace(/([\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
	if (typeof o == "object") {
		if (!o.sort) {
			for (var i in o)
				r.push("\"" + i + "\":" + objConvertStr(o[i]));
			if ( !! document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
				r.push("toString:" + o.toString.toString());
			}
			r = "{" + r.join() + "}"
		} else {
			for (var i = 0; i < o.length; i++)
				r.push(objConvertStr(o[i]))
			r = "[" + r.join() + "]";
		}
		return r;
	}
	return o.toString().replace(/\"\:/g, '":""');
}
//cookie
function saveCookie(name,value,expireTime){
	var cookieString = name+"="+escape(value);
	if(expireTime>0){
		var date = new Date();
		date.setTime(date.getTime + expireTime);
		cookieString = cookieString + "; expires="+date.toGMTString();
	}
	document.cookie = cookieString;
}
function deleteCookie(name){
	var date = new Date();
	date.setTime(date.getTime()-10000);
	window.document.cookie= name+"=xx; expires="+date.toGMTString();
}
function getCookie(name){
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg))
	return unescape(arr[2]);
	else
	return null;
}
//抛出事件给某元素(慎用，并没完全理解，总出现死循环)
function throwMouseEventsToId(eventType,id){
	  var event = document.createEvent('MouseEvents');
      event.initEvent(eventType, true,false);
      event.eventType = 'message';
      document.getElementById(id).dispatchEvent(event);
}
//加入监听事件
function addEvent(elm, evType, fn, useCapture) { 
	if (elm.addEventListener) { 
	elm.addEventListener(evType, fn, useCapture);//DOM2.0 
	return true; 
	} 
	else if (elm.attachEvent) { 
	var r = elm.attachEvent('on' + evType, fn);//IE5+ 
	return r; 
	} 
	else { 
	elm['on' + evType] = fn;//DOM 0 
	} 
}
//移除事件监听
function removeEvent(elm, evType, fn ,useCapture){
	  if (elm.removeEventListener) {
          elm.removeEventListener(evType, fn, useCapture);
      } else if (elm.detachEvent) {
          elm.detachEvent("on" + evType, fn);
      } else { 
          elm["on" + evType] = null;
      }
} 
//取得绝对定位
function GetAbsoluteLocation(element) 
{ 
    if ( arguments.length != 1 || element == null ) 
    { 
        return null; 
    } 
    var offsetTop = element.offsetTop; 
    var offsetLeft = element.offsetLeft; 
    var offsetWidth = element.offsetWidth; 
    var offsetHeight = element.offsetHeight; 
    while( element = element.offsetParent ) 
    { 
        offsetTop += element.offsetTop; 
        offsetLeft += element.offsetLeft; 
    } 
    return { absoluteTop: offsetTop, absoluteLeft: offsetLeft, 
        offsetWidth: offsetWidth, offsetHeight: offsetHeight }; 
}

//判断是否在工作区
function is_in_div(X,Y,ID){
	var div_dom = document.getElementById(ID);
//	var left = getElementLocation(div_dom).left;
//	var top = getElementLocation(div_dom).top;
//	var right =left + parseInt( document.getElementById(ID).offsetWidth );
//	var bottom =top + parseInt( document.getElementById(ID).offsetHeight );
	var left = GetAbsoluteLocation(div_dom).absoluteLeft;
	var top = GetAbsoluteLocation(div_dom).absoluteTop;
	var right =left + GetAbsoluteLocation(div_dom).offsetWidth;
	var bottom =top + GetAbsoluteLocation(div_dom).offsetHeight;
	if(X>right ){
		return false;
	}
	if(X<left){
		return false;	
	}
	if(Y>bottom){
		return false;
	}
	if(Y<top){
		return false;
	}
	return true;
}
//阻止事件冒泡
function stopBubble(e) {  
    if (e && e.stopPropagation) {//非IE  
        e.stopPropagation();  
    }  
    else {//IE  
        window.event.cancelBubble = true;  
    }  
} 

//通过字符串建立XMLDOC
function createXMLDocByString(xml){
	var xmlDocument = null;
	try{ //Internet Explorer
		xmlDocument=new ActiveXObject("Microsoft.XMLDOM");
		xmlDocument.async="false";
		xmlDocument.loadXML(xml);
	}catch(e){
		  try {//Firefox, Mozilla, Opera, etc.
			  parser=new DOMParser();
			  xmlDocument=parser.parseFromString(xml,"text/xml");
		  }
		  catch(e){
			  alert(e.message);
			  return;
		  }
	}
	return xmlDocument;
}
//获取Object的属性个数，reg是对属性名的正则验证
function getObjectLength(obj,reg){
	var count =0;
	for(var i in obj){
		if(reg.test(i)){
			count++;
		}
	}
	return count;
}
//获取Object深度属性个数，reg是对属性名的正则验证
function getObjectDeepLength(obj,reg,count){
	var count_ = (count == undefined?0:count);
	for(var i in obj){
		if(getObjectLength(obj[i],reg)!=0){
			count_ = getObjectDeepLength(obj[i],reg,count_);
		}
		if(reg.test(i)){
			count_++;
		}
	}
	return count_;
}
//深度克隆
function deepClone(obj){  
    var o;  
    switch(typeof obj){  
    case 'undefined': break;  
    case 'string'   : o = obj + '';break;  
    case 'number'   : o = obj - 0;break;  
    case 'boolean'  : o = obj;break;  
    case 'object'   :  
        if(obj === null){  
            o = null;  
        }else{  
            if(obj instanceof Array){  
                o = [];  
                for(var i = 0, len = obj.length; i < len; i++){  
                    o.push(deepClone(obj[i]));  
                }  
            }else{  
                o = {};  
                for(var k in obj){  
                    o[k] = deepClone(obj[k]);  
                }  
            }  
        }  
        break;  
    default:          
        o = obj;break;  
    }  
    return o;     
} 
