/*
Name:jQueryVlcNetCameraPlugin
Copyright 2017/06/29 gan.liu 
How To Use:
	$("#testDiv").ncVlc({
		mrl:"rtsp://admin:eyecool2016@192.168.60.22/h264/ch1",//important,must be inputed
		ratio:"16:9" //default is 16:9,you can change it
		width:"500" //500 pixel,default read parent div's width
		height:"500" // 500 pixel,default caculate from ratio and width
		showtime:"true" //show camera time ,default is false
	});
attention: capable in FIREFOX,IE9,IE10,but IE11 please add <meta http-equiv="X-UA-Compatible" content="IE=10" /> in <head>

*/
(function($) {
	$.fn.ncVlc = function(param) {
		if (param && param instanceof Object) {
			/*  变量部分  */
			//OS type boolean 
		    var isIE=!!window.ActiveXObject || "ActiveXObject" in window || navigator.userAgent.toUpperCase().indexOf("MSIE")>-1?true:false; //判断是否是IE浏览器
			var isFirefox=navigator.userAgent.toUpperCase().indexOf("FIREFOX")>-1?true:false;//是否是火狐浏览器
			var defaultRatio = "16:9";
			//HTML
			var vlcHtml;
			var vlcDiv = $(this);
			var name = "ncVlc";		
			var export_;//外调
			//VLC组件
			var vlcObject ;//vlc实体
			var vlcPlayList;
			var vlcAudio;
			var vlcVedio;
			var vlcInput;
			var vlcDescription;
			//当前播放视频路径
			var vlcMrl;
			var startTime=0;
			var play_begin_time=0;
			var play_pause_time=0;
			var sumTime=0;
			//vlc状态
			var isPaused;
			var isPlaying;
			var width=0;
			var height=0;

			/*  函数部分  */
			//将vlcHTML载入到页面中
			function loadVlc(){

				vlcHtml  = "<p style='padding-left: 5px;'> <object class='ncVlc' type='application/x-vlc-plugin' events='True' ";
				if(isIE){
					vlcHtml += " classid='clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921' "
	
				}else if(isFirefox){				
					
				}else{
					alert("请使用IE或FIREFOX！");
					return false;
				}
				vlcHtml += " > ";
				vlcHtml += " <param name='mrl' value='' /> ";
				vlcHtml += " <param name='volume' value='false' /> ";
				vlcHtml += " <param name='autoplay' value='true' /> ";
				vlcHtml += " <param name='loop' value='false' /> ";
				vlcHtml += " <param name='fullscreen' value='true' /> ";
				vlcHtml += " </object> </p>";
				vlcHtml += "<p style='padding-left: 5px;' class='showtime'><input class='cameraTime' type='text' style='color:blue' placeholder='需要切换到IE9或IE10'/>";
				vlcHtml += "<button class='newestBtn' style='margin-left: 15px;' >最新影像</button></p>";
				vlcDiv.html(vlcHtml);
				vlcDiv.find(".newestBtn").click(function(){
					window[name].gotoNow();
				});
				
				vlcObject = vlcDiv.find(".ncVlc")[0];
				vlcPlayList = vlcObject.playlist;
				vlcAudio = vlcObject.audio;
				vlcVedio = vlcObject.video;
				vlcInput = vlcObject.input;
				vlcDescription = vlcObject.mediaDescription;
				return true;
			}
			
			//分析参数，载入信息
			function analizeParam(){
				var result = false;
				if(param.mrl != undefined){
					vlcMrl = param.mrl;
					result =  true;
				}
				//其它参数配置“1:1”，“4:3”，“16:9”，“16:10”，“221:100”和“5:4”
				if(param.ratio != undefined){
					vlcVedio.aspectRatio = param.ratio;
				}else{
					vlcVedio.aspectRatio = defaultRatio;
				}
				if(param.width != undefined){
					width = param.width;
					vlcDiv.find(".ncVlc").css("width", width+"px" );
				}else{

					width = vlcDiv.width()-10;//左右padding各5
					if(width == 0){
						width = document.body.clientWidth;
					}
					console.log("width"+width);
					vlcDiv.find(".ncVlc").css("width",width+"px" );
					
				}
				if(param.height != undefined){
					height = param.height;
					vlcDiv.find(".ncVlc").css("height",height+"px" );
				}else{
					var ratio = vlcVedio.aspectRatio.split(":");
					height = ratio[1]/ratio[0]*width;
					vlcDiv.find(".ncVlc").css("height",height+"px" );
				}
				if(param.showtime != undefined && param.showtime == "true"){
					vlcDiv.find(".showtime").css("display","block");
				}else{
					vlcDiv.find(".showtime").css("display","none");
				}
				return result;
			}

			//call back functions(there are many more but useless for me)
			var clickit = function(){
				alert("123123");
			}
			function doNotingCallBack(event){
				//console.log("vlc stoped :"+ new Date().getTime() );
			}
			function openingCallBack(event){
				//console.log("vlc opening :"+ new Date().getTime() );
			}
			function bufferingCallBack(event){
				//console.log("vlc buffering :"+ new Date().getTime() );
			}
			function playingCallBack(event){
				console.log("vlc playing :"+ new Date().getTime() );
				var now = new Date().getTime();
				if(startTime == undefined || startTime == 0){
					startTime = now;
				}
				play_begin_time = now;
				isPaused = false;
				isPlaying = true;
			}
			function pausedCallBack(event){
				console.log("vlc paused :"+ new Date().getTime() );
				var now = new Date().getTime();
				play_pause_time = now;
				sumTime += play_pause_time - play_begin_time;
				isPaused = true;
				isPlaying = false;
				
			}
			//ADD LISTENNER
			function addListenners(){
				if(isIE && vlcObject.attachEvent){
					vlcObject.attachEvent('MediaPlayerNothingSpecial', doNotingCallBack);
					vlcObject.attachEvent('MediaPlayerOpening', openingCallBack);
					vlcObject.attachEvent('MediaPlayerBuffering', bufferingCallBack);
					vlcObject.attachEvent('MediaPlayerPlaying', playingCallBack);
					vlcObject.attachEvent('MediaPlayerPaused', pausedCallBack);
					//vlc.attachEvent('', callback);
				}else if( vlcObject.addEventListener ){
					vlcObject.addEventListener('MediaPlayerNothingSpecial', doNotingCallBack, false);
					vlcObject.addEventListener('MediaPlayerOpening', openingCallBack, false);
					vlcObject.addEventListener('MediaPlayerBuffering', bufferingCallBack, false);
					vlcObject.addEventListener('MediaPlayerPlaying', playingCallBack, false);
					vlcObject.addEventListener('MediaPlayerPaused', pausedCallBack, false);
					//vlcObject.addEventListener('', callback, bubble);
				}else{
					return false;
				}
				return true;
			}
			//REMOVE LISTENNER
			function removeListenners(){
				if(isIE && vlcObject.detachEvent){
					vlcObject.detachEvent('MediaPlayerNothingSpecial', doNotingCallBack);
					vlcObject.detachEvent('MediaPlayerOpening', openingCallBack);
					vlcObject.detachEvent('MediaPlayerBuffering', bufferingCallBack);
					vlcObject.detachEvent('MediaPlayerPlaying', playingCallBack);
					vlcObject.detachEvent('MediaPlayerPaused', pausedCallBack);
					
					//vlc.attachEvent('', callback);
				}else if( vlcObject.removeEventListener ){
					vlcObject.removeEventListener('MediaPlayerNothingSpecial', doNotingCallBack, false);
					vlcObject.removeEventListener('MediaPlayerOpening', openingCallBack, false);
					vlcObject.removeEventListener('MediaPlayerBuffering', bufferingCallBack, false);
					vlcObject.removeEventListener('MediaPlayerPlaying', playingCallBack, false);
					vlcObject.removeEventListener('MediaPlayerPaused', pausedCallBack, false);
					
					//vlcObject.addEventListener('', callback, bubble);
				}else{
					return false;
				}
				return true;
			}
			//开启监视者
			function openObserver(){
				setTimeout(observe,500);
			}
			function observe(){
				//修改影像时间
				var cameraTime = "";
				var now = new Date().getTime();
				if(isPaused){
					cameraTime = getDateString(startTime + sumTime);
				}
				if(isPlaying){
					cameraTime = getDateString(startTime + sumTime + now - play_begin_time);
				}
				vlcDiv.find(".cameraTime").val( cameraTime );
				
				setTimeout(observe,500);
			}
			
			//判断是否安装了VLC插件
			function isInsalledVLC(){
				var installed = false;
				if(isIE){
					if(isInsalledIEVLC){
						installed = true;
					}
				}else if(isFirefox){
					if(isInsalledFFVLC){
						installed = true;
					}
				}else{
					alert("请使用IE或者FIREFOX");
				}
				if(!installed)
				alert("您的浏览器中没有安装VLC插件");
				return installed;
			}
			
			
			// 判断IE中是否安装了VLC插件
			function isInsalledIEVLC(){ 
			var vlcObj = null;
			var vlcInstalled= false;
			
			try {
				vlcObj = new ActiveXObject("VideoLAN.Vlcplugin.2"); 
				if( vlcObj != null ){ 
					vlcInstalled = true 
				}
			} catch (e) {
				vlcInstalled= false;
			}        
			return vlcInstalled;
			} 
			//判断FIREFOX中是否安装了VLC插件
			function isInsalledFFVLC(){
				 var numPlugins=navigator.plugins.length;
				 for  (i=0;i<numPlugins;i++)
				 {
					  plugin=navigator.plugins[i];
					  if(plugin.name.indexOf("VideoLAN") > -1 || plugin.name.indexOf("VLC") > -1)
					{            
						 return true;
					}
				 }
				 return false;
			}
			
			//时间日期格式化
			function getDateString(Num){
				if(Num == undefined || Num == 0){
					return "";
				}
				var date  = new Date(Num);
				var year = date.getFullYear();
				var mon = date.getMonth()+1;
				var day = date.getDate();
				var hour = date.getHours();
				var min = date.getMinutes();
				var sec = date.getSeconds();
				if(mon <10){
					mon = "0"+mon;
				}
				if(day <10){
					day = "0"+day;
				}
				if(hour <10){
					hour = "0"+hour;
				}
				if(hour == 23){
					hour = 24;
				}
				if(min <10){
					min = "0"+min;
				}
				if(sec <10){
					sec = "0"+sec;
				}
				return year+"-"+mon+"-"+day+" "+hour+":"+min+":"+sec;
			}
			//可外调参数		
			function backControl(){
				var index = 0;
				while(window[name]!=undefined){
					name = name + index;
					index += 1;
				}
				window[name] = export_;
			}
			
			
			//操作
			function play(){
				vlcPlayList.add(vlcMrl);
				vlcPlayList.play();
				return true;
			}
			function stop(){
				vlcPlayList.stop();
			}
			function fullScreen(){
				vlcVedio.fullscreen = true;
			}
			function gotoNow(){
				
				vlcPlayList.stop();
				vlcPlayList.play();
		
				console.log("gotoNow");
				var now = new Date().getTime();
				startTime= now;
				play_begin_time= now;
				play_pause_time=0;
				sumTime=0;
			}
			export_ = {
				//stop:stop,play:play,fullScreen:fullScreen,
				gotoNow:gotoNow};
			
			//main
			if( !isInsalledVLC() ){return false;}
			if( !loadVlc() ){return false;}
			backControl();
			if( !analizeParam() ){return false;}
			if( !addListenners() ){return false;}
			if( !play() ){return false;}
			openObserver();
			
		}
		return $(this);
	}
})(jQuery);