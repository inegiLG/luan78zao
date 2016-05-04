

// var a = {x:{xx:1},y:2,z:3};
// var b = a.x;
// a.w = a.x.xx = a.y = a = {x:10,y:20};
// console.log(a);
// console.log(b);

var alist = true;
var slist = {a:function(){alert("123123123123123");}};
var xlist = {a:{aa:1},b:{bb:{bbb:1}},c:1};
var x ="99";
var ss = 1000;
var list = {};
var chh =null;

chh = setInterval(function(){
	ss++;
	if(confirm("是否取消循环提示？"+ss)){
		clearInterval(chh);
	}
},3000);
function abc(){
	alert(ss);
}
document.getElementById("div1").click= function(){
	addlist(x);
	x++;
}
document.getElementById("div1").dblclick=function(){
	getlist();
};
function addlist(x){
	list[x] =x;
}
function getlist(){
	for(var i in list){
		alert(i+"->"+list[i]);
	}
}
function changeSS(y){
	ss =y;
}

export__ = {x:x,changeSS:changeSS,ss:ss,slist:slist,alist:alist};
