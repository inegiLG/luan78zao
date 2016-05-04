/*

html:
<div id="101" class="ne_div" style="background-color: rgb(255, 255, 221); position: absolute; left: 546px; top: 42px; border: 2px solid; height: 80px; width: 90px; z-index: 50;" oncontextmenu="rightclick(this);return false;" data-type="router" data-state="selected">路由器</div>
<div id="102" class="ne_div" style="background-color: rgb(255, 255, 221); position: absolute; left: 1058px; top: 217px; border: 2px solid; height: 80px; width: 90px; z-index: 50;" oncontextmenu="rightclick(this);return false;" data-type="switch" data-state="selected">交换机</div>
<div id="103" class="ne_div" style="background-color:#ffd;position:absolute;left:20px;top:120px;border:2px solid;height:80px;width:90px;z-index:10" oncontextmenu="rightclick(this);return false;" data-type="firewall">防火墙</div>

js:

var nets = {
22:{neA_id:101,neB_id:102},
33:{neA_id:102,neB_id:103},
44:{neA_id:103,neB_id:101},
55:{neA_id:103,neB_id:102}
};
//执行步骤如下最重要的一步是：Movies.steps.push([bagmoviex]);
//Movies.steps.push([bagmoviex,bagmoviex]);可以使2个bagmovie并发执行
//以下主要是计算移动的坐标，初始点和终点

Movies.setSteps = function (){
		for(var i in nets){
			var x1 = GetAbsoluteLocation(document.getElementById(nets[i].neA_id)).absoluteLeft+GetAbsoluteLocation(document.getElementById(nets[i].neA_id)).offsetWidth/2+this.left_offset;
			var y1 = GetAbsoluteLocation(document.getElementById(nets[i].neA_id)).absoluteTop+GetAbsoluteLocation(document.getElementById(nets[i].neA_id)).offsetHeight/2+this.top_offset;
			var x2 = GetAbsoluteLocation(document.getElementById(nets[i].neB_id)).absoluteLeft+GetAbsoluteLocation(document.getElementById(nets[i].neB_id)).offsetWidth/2+this.left_offset;
			var y2 = GetAbsoluteLocation(document.getElementById(nets[i].neB_id)).absoluteTop+GetAbsoluteLocation(document.getElementById(nets[i].neB_id)).offsetHeight/2+this.top_offset;
			var bagmoviex = new bagmovie({"x":x1-20,"y":y1},{"x":x2-20,"y":y2});
			this.steps.push([bagmoviex]);
		}	
}


*/ 

function bagdiv(fromx){
	this.id = Movies.BagData_index;
	Movies.BagData_index ++;
	this.getDivStr = function(){
		return '<div id="'+this.id+'" style="position:absolute;left:'+fromx.x+'px;top:'+fromx.y+'px;border:1px solid;height:30px;width:80px">数据包</div>';
	}
	this.getDom = function(){
		var domx = document.createElement("div"); 
		domx.id = this.id;
		domx.className = domx.className+" data_bag";
		domx.style = '"position:absolute;left:'+fromx.x+'px;top:'+fromx.y+'px;border:1px solid;height:30px;width:80px"';
		domx.style.position = "absolute";
		domx.style.border = "1px solid";
		domx.style.height = "20px";
		domx.style.width = "50px";
		domx.style.left = fromx.x+"px";
		domx.style.top = fromx.y+"px";
		domx.style.backgroundColor ="#ffd";
		domx.innerHTML = "数据";
		document.body.appendChild(domx);
		return domx;
	}
}
function bagmovie(fromx,targetx){
	this.bag =  new bagdiv(fromx);
	this.target = targetx;
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

var Movies = {};//最好弄个工厂，随时生成个新的，并发，没弄
Movies.state = 0;//0表示静止，1表示正在移动
Movies.ch1=null;//记录钟表
Movies.bagmovies = new Array();//移动组的包
Movies.stepsIndex = 0;
Movies.completeFlag = true;//完成标志
Movies.speed=1;//速度倍率
Movies.pauseFlag = false;//暂停标记,true表示没暂停
Movies.BagData_index = 30100;
Movies.left_offset = 0;//设置坐标的偏移量
Movies.top_offset = 0;//设置坐标的偏移量
//执行步骤
Movies.steps = new Array();

//初始化移动数据包信息
Movies.init = function (){
	//删除所有的数据包div
	var livebags = $(".data_bag");
	for(var i=0;i<livebags.length;i++){
		document.body.removeChild(livebags[i]);
	}
	//检查bagmovies所有的元素，生成bagdiv
	for(var i=0;i<this.bagmovies.length;i++){
		this.bagmovies[i].dom = this.bagmovies[i].bag.getDom();
		this.bagmovies[i].flag=0;
	}
	//计算坐标增长率
	for(var i=0;i<this.bagmovies.length;i++){
		var left_gap = this.bagmovies[i].target.x - parseInt(this.bagmovies[i].dom.style.left);
		var top_gap = this.bagmovies[i].target.y - parseInt(this.bagmovies[i].dom.style.top);
		var left_x = (left_gap<0)?-left_gap:left_gap;
		var top_y = (top_gap<0)?-top_gap:top_gap;
		//以下要根据绝对值来比较
		if(left_x>top_y){
			this.bagmovies[i].left_increment = 2;
			if(top_y != 0){
				this.bagmovies[i].top_increment = this.bagmovies[i].left_increment*top_y/left_x;
			}else{
				this.bagmovies[i].top_increment = 0;
			}
		}else{
			this.bagmovies[i].top_increment = 2;
			if(left_x != 0 ){
				this.bagmovies[i].left_increment =this.bagmovies[i].top_increment*left_x/top_y;
			}else{
				this.bagmovies[i].left_increment = 0;
			}
		}
		if(left_gap<0){
			this.bagmovies[i].left_increment =-this.bagmovies[i].left_increment ; 
		}
		if(top_gap<0){
			this.bagmovies[i].top_increment = -this.bagmovies[i].top_increment ;
		}
		
	}
}
//默认按照nets的顺序来设置steps
Movies.setSteps = function (){
	if(this.steps==null || this.steps.length ==0){
		for(var i in nets){
			var x1 = GetAbsoluteLocation(document.getElementById(nets[i].neA_id)).absoluteLeft+GetAbsoluteLocation(document.getElementById(nets[i].neA_id)).offsetWidth/2+this.left_offset;
			var y1 = GetAbsoluteLocation(document.getElementById(nets[i].neA_id)).absoluteTop+GetAbsoluteLocation(document.getElementById(nets[i].neA_id)).offsetHeight/2+this.top_offset;
			var x2 = GetAbsoluteLocation(document.getElementById(nets[i].neB_id)).absoluteLeft+GetAbsoluteLocation(document.getElementById(nets[i].neB_id)).offsetWidth/2+this.left_offset;
			var y2 = GetAbsoluteLocation(document.getElementById(nets[i].neB_id)).absoluteTop+GetAbsoluteLocation(document.getElementById(nets[i].neB_id)).offsetHeight/2+this.top_offset;
			var bagmoviex = new bagmovie({"x":x1-20,"y":y1},{"x":x2-20,"y":y2});
			var bagmoviey = new bagmovie({"x":x2-20,"y":y2},{"x":x1-20,"y":y1});
			this.steps.push([bagmoviex,bagmoviey]);
		}
	}
	
}

//开始动画
Movies.anime = function (){
	if(this.completeFlag){
		this.steps=[];
		this.stepsIndex = 0;
		this.speed =2;
		this.setSteps();
		this.beginMovie();
	}
}
//动画
Movies.beginMovie = function (){
	this.bagmovies = this.steps[this.stepsIndex];
	if( (!this.pauseFlag || this.stepsIndex<0 ) && this.stepsIndex<this.steps.length){
		this.init();
	}
	this.pauseFlag =false;
	this.completeFlag =false;
	if(this.bagmovies==null || this.stepsIndex>=this.steps.length){
		this.completeFlag =true;
		return;
	}
	this.changePos();
	
}

//改变网元位置
Movies.changePos = function (){
	var this_ = window.Movies;
	if(this_ != window.Movies){alert(123123);}
	if(this_.pauseFlag){
		return;
	}
	for(var i=0;i<this_.bagmovies.length;i++){
		var width = parseFloat(this_.bagmovies[i].dom.style.width);
		var height= parseFloat(this_.bagmovies[i].dom.style.height);
		var left = parseFloat(this_.bagmovies[i].dom.style.left) ;
		var top = parseFloat(this_.bagmovies[i].dom.style.top) ;
		var left_nochange =true;
		var top_nochange  =true;
		if(this_.bagmovies[i].left_increment>0 && left<this_.bagmovies[i].target.x){
			this_.bagmovies[i].dom.style.left=left+this_.bagmovies[i].left_increment*this_.speed+"px";
			left_nochange=false;		
		}else if(this_.bagmovies[i].left_increment<0 && left>this_.bagmovies[i].target.x){
			this_.bagmovies[i].dom.style.left=left+this_.bagmovies[i].left_increment*this_.speed+"px";
			left_nochange=false;
		}
		if(this_.bagmovies[i].top_increment>0 && top<this_.bagmovies[i].target.y){
			this_.bagmovies[i].dom.style.top=top+this_.bagmovies[i].top_increment*this_.speed+"px";
			top_nochange=false;
		}else if(this_.bagmovies[i].top_increment<0 && top>this_.bagmovies[i].target.y){
			this_.bagmovies[i].dom.style.top=top+this_.bagmovies[i].top_increment*this_.speed+"px";
			top_nochange=false;
		}
		if( left_nochange && top_nochange ){
			this_.bagmovies[i].flag = 1;
		}
		
	}
	//if(this_.ch1==null){
		this_.ch1 = setTimeout(this_.changePos,20);
	//}
	var flagsum =0;
	for(var i=0;i<this_.bagmovies.length;i++){
		flagsum +=this_.bagmovies[i].flag;
	}
	if(flagsum == this_.bagmovies.length){
		clearTimeout(this_.ch1);
		this_.ch1 = null;
		this_.stepsIndex++;
		for(var i=0;i<this_.bagmovies.length;i++){
			document.body.removeChild(this_.bagmovies[i].dom);
		}
		this_.beginMovie();
	}
	
}

//加速
Movies.speedUp = function (){
	if(this.speed <=5){
		this.speed++;
	}
}
//减速
Movies.speedDown = function (){
	if(this.speed>1){
		this.speed--;
	}
}
//暂停
Movies.pause = function (){
	if(this.pauseFlag){
		this.beginMovie();
		document.getElementById("pauseDiv").innerHTML="动画暂停";
	}else{
		this.pauseFlag = true;
		document.getElementById("pauseDiv").innerHTML="动画继续";
	}
}
