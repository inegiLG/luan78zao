/*
*2016-4-12
*author:刘干
*/ 
function Module_Control_lg_simple(){
	this.module_list ={};
	//ajax获取js
	this.ajaxGetJS = function(url){
		var text = null;
		$.ajax({
			url:url,
			async:false,
			dataType:"text",
			success:function(data){
				text =data;
			}
		});
		return text;
	}
	//定义模块
	this.defineModule = function(module_name){

			var module_head = "function "+module_name+"(){\nvar export__ = {} ;\n";
			var module_tail = "\nreturn export__;\n}\n";
			var module_body = "";
			var module = {
				"module_name":module_name,
				"module_head":module_head,
				"module_body":module_body,
				"module_tail":module_tail,
				//"ajaxGetJS":this.ajaxGetJS,
				// "module_list":this.module_list,
				// "appendJS":function(url){
				// 	var supplement = this.ajaxGetJS(url);
				// 	if(supplement != null){
				// 		this.module_list[module_name].module_body=this.module_list[module_name].module_body+"\n"+supplement+"\n";
				// 		return true; 
				// 	}
				// 	return false;
				// },
				// "appendText":function(supplement){
				// 	if(supplement != null){
				// 		this.module_list[module_name].module_body=this.module_list[module_name].module_body+"\n"+supplement+"\n";
				// 		return true; 
				// 	}
				// 	return false;
				// },				
				"getText":function(){
					return this.module_head + this.module_body + this.module_tail;
				},
				"exec":function(){
					var tail = module_name+"();\n"
					var fn = eval(this.getText()+tail);
					// var exec_tail ="var _"+module_name+" = new "+module_name+"();\n"
					// eval.call(this,this.getText()+exec_tail);
					return fn;
				},
				"getMethod":function(){
					
				}
			};
			this.module_list[module_name]=module;
			//return this.module_list[module_name];
	}
	//删除模块
	this.deleteModule = function(module_name){
		if(this.module_list[module_name]){
			delete this.module_list[module_name];
		}
	}
 	//模块JS追加
 	this.ModuleBodyAppendJS = function(module_name,url){
		var supplement = this.ajaxGetJS(url);
		if(supplement != null){
			this.module_list[module_name].module_body = this.module_list[module_name].module_body + supplement;
			return true; 
		}
		return false;
	}
 	//模块内容追加
 	this.ModuleBodyAppendText = function(module_name,supplement){
		if(supplement != null){
			this.module_list[module_name].module_body=this.module_list[module_name].module_body+"\n"+supplement+"\n";
			return true; 
		}
		return false;
	}	
	//获取module
	this.getModule = function(module_name){
		if(this.module_list[module_name]!=null){
			return this.module_list[module_name];
		}
		return null;
	}
	//执行module
	this.execModule = function(module_name){
		this[module_name] =this.module_list[module_name].exec();
		var xx = this[module_name];
		for(var i in xx){
			if(typeof(xx[i]) == "function"){
				//var body_ = xx[i].toString().replace(/[\r\n]/mg,"}0_0{");				
				//var body = (/{.*}/m.exec(body_)).toString().replace(/}0_0{/g,"\n");	
				var head_ =/function\s[a-zA-Z_$()]+/.exec(xx[i].toString()) ;
				var head = head_.toString().replace(/function\s*/,"");
				var func = "function "+head+"{\nmc."+module_name+"."+head+";\n}\n";
				//alert(xx[i].toString());
				window.eval(func);
			}else if(typeof(xx[i]) == "number"){
				//alert("var "+i+"="+xx[i]+";");
				window.eval("var "+i+"="+xx[i]+";");
			}else if (typeof(xx[i]) == "string"){
				//alert("var "+i+"=\""+xx[i]+"\";");
				window.eval("var "+i+"=\""+xx[i]+"\";");
			}else if (typeof(xx[i]) == "object"){
				//alert("var "+i+"="+ objConvertStr(xx[i])+";");
				window.eval("var "+i+"="+objConvertStr(xx[i])+";");
			}else if (typeof(xx[i]) == "boolean"){
				//alert("var "+i+"="+xx[i]+";");
				window.eval("var "+i+"="+xx[i]+";");
			}else if (typeof(xx[i]) == "undefined"){
				window.eval("var "+i+"=undefined;");
			}else{
				alert("unknown variable type!");
			}		
		}

	}
}

var mc = new Module_Control_lg_simple();