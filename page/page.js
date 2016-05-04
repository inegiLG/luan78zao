var page = {};

page.currentNum = 0;
page.allPageNum = 0;
page.refresh_url = "";
page.returnData = null;
//如果传入prev，则向前走一页.
//如果传入next，则向后走一页.
//如果传入其他数字，则跳转到该页.
page.pageGo = function(para){
	var num = this.currentNum;
	var sum = this.allPageNum;
	if(para!=null){
		if(para == "prev"){
			if(num == 1){
				return ;
			}else{
				this.changePage(num-1);	
			}
		}
		else if(para == "next"){
			if(num == sum){
				return ;
			}else{
				this.changePage(num+1);	
			}
		}
		else{
			this.changePage(para);	
		}
		
	}
	
}			
//分页页面查询
page.changePage = function(num){
	var msg = this.collectInfo();
	if(num!=null){
		msg.pagenum = num;
	}
	var that = this;
	this.ajaxRequest(this.refresh_url,msg,function(data){
			dealError(data,function(data){
					//返回的数据应含有 1.当前有多少页 2.总共多少页 3.表数据
					that.refreshPageTable(data);
					that.refreshPageMenu(data);
				},
				function(data){
					// error
					// TODO 1.更新表 2.更新分页菜单
				}
			);
		},true);
}
//更新分页菜单
page.refreshPageMenu = function(data){
	this.refreshNum(data);//更新当前页和总页数
	this.refreshBox(data);//改变盒子
	
}
//更新当前页和总页数
page.refreshNum = function(data){
	this.currentNum = data.pageInfo.pageNum;
	this.allPageNum = data.pageInfo.allPageNum;
}
//改变盒子样式，有多少页，第几页高亮
page.refreshBox = function(data){
	this.editPageBox(data);	
	$("#page_box .page_btn").each(function(){
		var this_num = parseInt( $(this).html().replace(/\s/mg,"") );
		if(this_num == parseInt(data.pageInfo.pageNum)){
			$(this).addClass('page_active').siblings().removeClass('page_active');	
		}
	});	
}
//错误处理
page.dealError = function(d,y,n){
	if(d.state == 0){
		y(d);
	}else{
		n(d);
	}
}
//ajax访问
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
//ajax访问
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
//设置查询地址
page.setURL = function(u){
	this.refresh_url = u;
}
/*******以下是需要重新编辑的部分*******/

//收集查询信息
page.collectInfo = function(){
	// TODO
}
//更新表或页面部分
page.refreshPageTable = function(data){
	// TODO 
}
//编辑盒子样式
page.editPageBox = function(data){
	//      #page_box
	// TODO 1.共有几页
	//		2.当前是第几页
	//		3.整体有何改变
}
