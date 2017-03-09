/**
 * jQuery.inputselect 自定义下拉框
 * author:liulingli
 * date :  2016-12-19
 * Instructions:
 * */
;(function(){
    var methods={
      init:function(options){
        return this.each(function(){
          var $this = $(this);
          var defaluts = {
			    isMultChoose:false,//默认不可多选
			    postUrl: "",//获取选项的地址
			    postParam : '', //参数
			    setConfig:'',
			  //设置显示配置，以表头为基础，在每一个表头上附加参数，指明是否隐藏hide、表头文字text、表头宽度width、填充控件IDreturnId
	            isFocus: true,//默认由onfocus触发
	            isClick : false,//是否由onclick触发
	            isOne :false,//当数据只有一条的时候是否自动将数据填充到对应字段中去
	            evenColor : "#EFEFEF",//偶数行背景颜色
	            oddColor : "#EFEFEF",//奇数行背景颜色
	            headColor : "#CCCCCC",//表头背景颜色
	            highlightColor : "#04BFEA",//高亮行背景颜色
	            isEnter : true,//点击enter键时,没有选中的情况下,是否默认选中第一行      
	            pageNo : 1,
	            isDbclick : true,//默认双击的时候,清空数据
	            parent : null,
	            callback :''//选中之后的回调函数
             };
      		  //合并默认参数opt和defaluts
              settings = $.extend({},defaluts,options);
			  methods.inputselectMain.call($this, settings);  
      		})
      	},
	  inputselectMain:function(){
	  	return this.each(function(){
	  	   	var $this = $(this);
	  	   	var setting = settings; //缓存settings	
	  	   	var bindId = "si"+getUUID(8,10);
	  	   	var totalPage = 1; //默认总共有1页
	  	   	//给inputSelect添加class属性"inputslect",用于enter转tab键区分
	  	   	$this.addClass("inputselect");
	  	   	//不记住输入记录
	  	   	$this.attr("autocomplete","off");
	  	   	function getUUID(len,radix){ //随机生成全局唯一标识符,len为长度，radix为基数
	  	   	   	var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
				var uuid = [], i;
				radix = radix || chars.length;
				if (len) {
				   for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
				} else {
				    var r;
				    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
				    uuid[14] = '4';
				    for (i = 0; i < 36; i++) {
					    if (!uuid[i]) {
					    	 r = 0 | Math.random()*16;
					     	uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
					    }
				  	 }	
				}				 
			  	return uuid.join('');
  	   	    };
	  	   	/*** 公共方法 ***/
	  	   	var pubMethod = {
	  	   		getIdNum:function(){ //获取当前对象id的序号
	  	   			var num = $this.attr("id").split("_")[1];
	  	   			if(num!=undefined&&num!='undefined'){
	  	   				return num;
	  	   			}
	  	   			return '';
	  	   		},
	  	       	getParamJson:function(offerNo){ //获取即时的POST入参的JSON对象
		  	    	setting.pageNo = setting.pageNo+offerNo;
		  	    	if(setting.pageNo<=0){
		  	    	  	setting.pageNo = 1;
		  	    	}
		  	        var num = pubMethod.getIdNum(); //下标号   	  
		  	       	var obj="ajaxSelect.";
		  	    	var json = "{";
			            json += "time:\""+new Date().getMilliseconds()+"\"";
			            json += ", pageNo:"+setting.pageNo;
			        if(setting.postParam!=null&&setting.postParam!=''){
				        for(var key in setting.postParam){
					    	json += ", \""+obj+key+"\":\""+$("#"+setting.postParam[key]+"_"+num).val()+"\"";
			            }
			        }else{
			          	json +=",\""+obj+"term\":\""+$this.val()+"\"";
			        }
			        json += "}";
			        return eval("("+json+")");
	  	       	},
	  	       	parseSetConfig:function(){
	  	       	  	var setConfig = eval("("+setting.setConfig+")");
	  	       	     	theadHtml="<thead id='"+bindId+"_head' class='si_head'>";    
	  	       	  	for(i=0;i<setConfig.length;i++){
	  	       	  	 	var config = setConfig[i];
	  	       	  	 	if(config.hide==true){
	  	       	  	 		theadHtml += "<th style='display:none'>"+config.text+"</th>";
	  	       	  	 	}else if(config.hide==undefined||config.hide=='undefined'){
	  	       	  	  		if(config.width!=undefined){
	  	       	  	 			theadHtml += "<th style='width:"+config.width+";background:"+setting.headColor+"'>"+config.text+"</th>";
	  	       	  	 		}else{
	  	       	  	 	 		theadHtml += "<th style='background:"+setting.headColor+"'>"+config.text+"</th>";
	  	       	  	 		}	  	       	  	 	
	  	       	  	 	}		  	       	  	
	  	       	  	} 
	  	       	 	theadHtml +="</thead>";
	  	       	  // pubMethod.parsePostData();
	  	       	    return theadHtml;
	  	       	},
	  	       	parsePostData:function(data){
	  	       	  	var datas =data,
	  	       	      	setConfig = eval("("+setting.setConfig+")"),
	  	       	      	tobyHtml = "";
	  	       	   	for(var i=0;i<datas.length;i++){
	  	       	   	 	var bgColor = i%2==0?setting.evenColor:setting.oddColor;
	  	       	   	 	var htmlTR = "<tr id='"+bindId+"_body_tr_"+i+"' index='"+i+"' style='background-color:"+bgColor+";cursor:pointer' bgColor='"+bgColor+"'>";
	  	       	   	    var data = datas[i];
	  	       	   	    for(j=0;j<data.length;j++){
	  	       	   	  	 	if(setConfig[j].hide=='undefined'||setConfig[j].hide==undefined||setConfig[j].hide==false||setConfig[j].hide=='false'){
	  	       	   	  	 		htmlTR+="<td title='"+data[j]+"'>"+data[j]+"</td>";
	  	       	   	  	 	}else{
	  	       	   	  	 		htmlTR+="<td style='display:none'>"+data[j]+"</td>";
	  	       	   	  	 	}	  	       	   	  	
	  	       	   	  	}
	  	       	   	    htmlTR+="</tr>";
	  	       	   	  	tobyHtml += htmlTR;
	  	       	   	}
	  	       	     $("#"+bindId+"_body").html(tobyHtml);
	  	       	      return tobyHtml;
	  	       },
	  	       appendTo:function(obj){//容器对象，未定义时添加至body
	  	       	   //获取left和top值
	  	       	   $this.attr("data-id",bindId+"_input");//用于移除确认
	  	       	   var top = $this.offset().top+$this.outerHeight(),
	  	       	       left = $this.offset().left;
	  	       	   var setConfig = eval("("+setting.setConfig+")");
	  	       	   var bindDiv= "<div id='"+bindId+"_div' style='position:absolute;left:"+left+"px;top:"+top+"px' class='si_div'>";
	  	       	       bindDiv+="<table class='si_table' id='"+bindId+"_table'>";
	  	       	       bindDiv+= pubMethod.parseSetConfig(); //表头
	  	       	       bindDiv+="<tbody id='"+bindId+"_body' class='si_body'>";
	  	       	       bindDiv+="<tr><td colspan='"+setConfig.length+"'>加载中...</td></tr></tbody>";
	  	       	       bindDiv+="<tfoot id='"+bindId+"_foot' class='si_foot'><tr><td colspan='"+setConfig.length+"'>";
	  	       	       bindDiv+="<button id='"+bindId+"_prev' class='page' style='float:left'>上一页</button>";
	  	       	       bindDiv+="<button id='"+bindId+"_next' class='page' style='float:right'>下一页</button>";
	  	       	       bindDiv+="</td></tr></tfoot>"
	  	       	       bindDiv+="</table></div>";
	  	       	    if($("#"+bindId+"_div").length<1){ //判断有没有添加
	  	       	    	if(obj!=undefined){
	  	       	    	    $(obj).append(bindDiv);
	  	       	        }else{
	  	       	    	    $("body").append(bindDiv);
	  	       	        }
	  	       	    };	  	       	    
	  	       },
	  	       removeTo:function(){ //删除容器对象
	  	       	  if($("#"+bindId+"_div").length>0){ //存在时删除
	  	       	     $("#"+bindId+"_div").remove();
	  	       	  }
	  	       },
	  	       hide:function(){ //隐藏容器对象
	  	       	  if($("#"+bindId+"_div").length>0){ //存在时删除
	  	       	     $("#"+bindId+"_div").hide();
	  	       	  }
	  	       },
	  	       show:function(){ //显示容器对象
	  	       	   if($("#"+bindId+"_div").length>0){ //存在时删除
	  	       	       $("#"+bindId+"_div").show();
	  	       	    }
	  	       },
	  	       clearSelect:function(){ //清除选中内容
	  	       	   var setConfig = eval("("+setting.setConfig+")");
	  	       	   for(i=0;i<setConfig.length;i++){
	  	       	   	   var num = pubMethod.getIdNum();
	  	       	  	   var returnId = num!=''?(setConfig[i].returnId+"_"+num):setConfig[i].returnId;   	  	       
	  	       	  	   $("#"+returnId).val(''); 
	  	       	    }
	  	       },
	  	       singgleSelect:function(tr){ //选中
	  	       	 $(tr).siblings("tr").each(function(){
	  	       	 	$(this).css("background-color",$(this).attr("bgcolor")).removeAttr("bgColorOn");;
	  	       	 });
	  	       	 $(tr).css("background-color",setting.highlightColor).attr("bgColorOn",setting.highlightColor);
	  	       	 pubMethod.enter();	  	      
	  	       },
	  	       MultiSelect:function(tr){ //多选
	  	       	 $(tr).css("background-color",setting.highlightColor).attr("bgColorOn",setting.highlightColor);
	  	       },
	  	       enter:function(){
	  	       	  var selectedTR = $("#"+bindId+"_body tr[bgColorOn="+setting.highlightColor+"]"),
	  	       	      setConfig = eval("("+setting.setConfig+")");
	  	       	  var returnValue;
	  	       	  if(selectedTR.length>0){
	  	       	  	    selectedTR.each(function(){	  	       	  	
	  	       	  	        var td = $(this).find("td");
	  	       	  	        for(i=0;i<setConfig.length;i++){
	  	       	  	        	var num = pubMethod.getIdNum();
	  	       	  	        	if(setConfig[i].returnId!=undefined&&setConfig[i].returnId!="undefined"){
	  	       	  	        		var returnId = num!=''?(setConfig[i].returnId+"_"+num):setConfig[i].returnId;
	  	       	  	            	if(setting.isMultChoose){ //多选
		  	       	  	            	var initValue = $("#"+returnId).val(),
		  	       	  	            	    addValue = td.eq(i).text();		  	                           
			  	       	  	        	if(initValue.indexOf(addValue)<=-1){
			  	       	  	        	   returnValue = $("#"+returnId).val()+','+td.eq(i).text();	
			  	       	  	        	}else {
			  	       	  	        	  returnValue = $("#"+returnId).val();	
			  	       	  	        	}
		  	       	  	            }else{ //单选
		  	       	  	                returnValue = td.eq(i).text();
		  	       	  	            }
		  	       	  	            $("#"+returnId).val(returnValue.replace(/^,/,'')); //删除字符前面的“,”
	  	       	  	        	} 	       	  	            
	  	       	            }
	  	       	       })
	  	       	  }else if($this.val()==''||$this.val()==null){
	  	       	  	if(setting.isEnter){
	  	       	  	    var selectedTR = $("#"+bindId+"_body tr").eq(0),
	  	       	            td = selectedTR.find("td");
	  	       	  	    for(i=0;i<setConfig.length;i++){
	  	       	  	    	var num = pubMethod.getIdNum();
	  	       	  	        var returnId = num!=''?(setConfig[i].returnId+"_"+num):setConfig[i].returnId;
	  	       	  	        if(setting.isMultChoose){ //多选
	  	       	  	        	if($("#"+returnId).val().indexOf(td.eq(i).text())<=-1){
	  	       	  	        	   returnValue = $("#"+returnId).val()+','+td.eq(i).text();	
	  	       	  	        	}	  	       	  	   	        	 
	  	       	  	        }else{ //单选
	  	       	  	            returnValue = td.eq(i).text();
	  	       	  	        }	  	       	  	       	       	  	       
	  	       	  	        $("#"+returnId).val(returnValue.replace(/^,/,'')); //删除字符前面的“,”
	  	       	        }
	  	       	  	}	  	       	  	 
	  	       	  }	  	       	
	  	       	  pubMethod.removeTo(); 
	  	       	  if(setting.callback!=''){
	  	       	  	//callback传值
	  	       	  	var callValue = $this.attr("data-string");
	  	       	  	if(typeof setting.callback == 'string'){
	  	       	  		eval("window."+setting.callback+"(callValue)");//this的指向
	  	       	  		return;
	  	       	  	}
	  	       	  	setting.callback(callValue);
	  	       	  }
	  	       	},
	  	        post:function(offerNo){ //执行POST方法，填充数据，完成展示
	  	       	    if(setting.parent!=null&&typeof(setting.parent)=="string"&&setting.parent!=""){
		  	    		var parent=JSON.parse(setting.parent.replaceAll("'","\""));
		  	    		var num = pubMethod.getIdNum();
		  	    		if($("#"+parent.parentId+"_"+num).val()==null||$("#"+parent.parentId+"_"+num).val()==""||$("#"+parent.parentId+"_"+num).val()=="undefined"){
		  	    			alert("请先选择【"+parent.parentName+"】");
		  	    			$("#"+parent.parentShow+"_"+num).focus();
		  	    			try { $("#"+parent.parentShow+"_"+num).click(); } catch (e) { }
		  	    			//$(".si_table").remove();
		  	    			return;
		  	    		}
	  	    	 	}
		  	       	 if(offerNo!=null){
		  	       	 	setting.isPager = true;	  	       	 	
		  	       	 }else{
		  	       	 	setting.pageNo=1;
		  	       	 }
		  	       	 offerNo = offerNo||0;
		  	       	// console.log(setting.pageNo)
		  	       	 //ajax前缓存数据
		  	       	 var bindId = bindId,
		  	       	     highlightColor = setting.highlightColor,
		  	       	     pageWay = setting.pageWay;
		  	       	 if(setting.isFocus||setting.isClick){
		  	       	 	//console.log(pubMethod.getParamJson(offerNo))
		  	    	    $.get(setting.postUrl,pubMethod.getParamJson(offerNo),function(data){
		  	    	    	pubMethod.parsePostData(data);
		  	    	    	/*if(data.array){
		  	    	    	    totalPage = data.totalPage;
		  	    	    		setting.pageNo = data.pageNo;
		  	    		        pubMethod.parsePostData(data);
		  	    		        
		  	    	    	}else if(data.array.length==0){
		  	    	    		$("#"+bindId+"_body").html(" ");
		  	    	    		return false;
		  	    	    	}else{
		  	    	    		setting.pageNo = -1
		  	    		        pubMethod.parsePostData(data);
		  	    		        setting.isOne&&pubMethod.enter();
		  	    	    	}*/
		  	    	    	//根据获取元素的高度、宽度决定显示位置		
		  	    	    	function getPosition(){
		  	    	    		var showHeight = $("#"+bindId+"_div").outerHeight(),  //获取table的高度
			  	       	       	 	showWidth = $("#"+bindId+"_div").outerWidth(), //获取table的宽度
			  	       	        	disTop = $(window.top).height() - $this.offset().top - $this.outerHeight(),
			  	       	        	disLeft = $(window.top).width() - $this.offset().left;
			  	       	    	$("#"+bindId+"_div").css("width",showWidth+"px");
			  	       	    	if(showHeight>disTop){ //如果下方区域不足以放下则置于上方
			  	       	    		var top = $this.offset().top - showHeight;
			  	       	    		$("#"+bindId+"_div").css("top",top+"px");
			  	       	    	}else{
			  	       	    		var top = $this.offset().top + $this.outerHeight();
			  	       	    		$("#"+bindId+"_div").css("top",top+"px");
			  	       	    	}
			  	       	   		if(showWidth>disLeft){ //如果左方区域放不下
			  	       	    		$("#"+bindId+"_div").css("left","");
			  	       	    		$("#"+bindId+"_div").css("right",0);
			  	       	   		}else{
			  	       	   			$("#"+bindId+"_div").css("left",$this.offset().left);
			  	       	   		}
		  	    	    	}
			  	       	    getPosition();
			  	       	    $(window.top).resize(function(){ //reisze事件时重新计算
			  	       	    	 getPosition();
			  	       	    });
		  	    	    });
		  	        }
	  	        }  	           
	  	    };	  	    	  	   
	  	    $this.on("click",function(){ //焦点事件显示
	  	    	pubMethod.appendTo();
	  	    	pubMethod.post();
	  	    });
	  	     
	  	    $this.on("dblclick",function(){ //双击清楚选框内的内容
	  	    	setting.isDbclick&&pubMethod.clearSelect();
	  	    })
	  	    
	  	    $(document).on("click",function(e){ //点击select选框外的元素，则移除容器
	  	     var $thisOwn = $this;
	  	    	var $target= $(e.target);
	  	    	var isInput = ($target.attr("data-id")==bindId+"_input"); //点击的是否是当前inputselect下拉框
	  	    	var isThis = $target.parents("#"+bindId+"_div").length;
	  	    	if(isThis==0&&!isInput){
	  	    		pubMethod.removeTo();
	  	    	}
	  	    });
	  	    //缓存，是否按住ctrl键
	        var isCtrl = false;
	  	    $(document).on("click","#"+bindId+"_body tr",function(){
	  	    	var $this = $(this),
	  	    	    _index = $(this).attr("index");
	  	    	if(!setting.isMultChoose){	//单选
	  	    		pubMethod.singgleSelect($this);	
	  	    		$("[data-id='"+bindId+"_input']").trigger("blur");
	  	    		$("[data-id='"+bindId+"_input']").trigger("focus");
	  	    	}else{ //多选
	  	    		if(isCtrl){	
	  	    			pubMethod.MultiSelect($this);
	  	    		}else{
	  	    			pubMethod.singgleSelect($this);	
	  	    		}
	  	    		$("[data-id='"+bindId+"_input']").trigger("blur");
	  	    		$("[data-id='"+bindId+"_input']").trigger("focus");
	  	    	}
	  	    	//return false;
	  	    })
	        //翻页
	        $("body").on("click","#"+bindId+"_foot",function(e){
	        	if(e.target.id==bindId+"_prev"){ //上一页
	        		if(setting.pageNo>1){
	        			pubMethod.post(-1);
	        		}	        		
	        	}else if(e.target.id==bindId+"_next"){ //下一页
	        		if(setting.pageNo<totalPage){
	        			pubMethod.post(1);
	        		}	        		
	        	}	        	
	        });
	  	   	$this.keydown(function(){
	  	   	 	 var e = event||window.event,
		             keyCode = e.keyCode||e.which,
		             highlightColor = setting.highlightColor;
	  	   	 	 var index = -1;
	  	   	         trs = $("#"+bindId+"_body").find("tr"),
	  	   	         length = trs.length;
	  	   	     	 for(var i=0; i<trs.length; i++){
			            var tr = trs.eq(i);
			            if(tr.attr("bgColorOn")==highlightColor){
				            index = parseInt(tr.attr("index"));
				            if(!setting.isMultChoose){ break;}//单选
				            //break;
			            }
		            }
		        if(keyCode==40){ //键盘向下
		            /*if(!setting.isMultChoose){ //单选 
		            	//背景色还原，只选一个
                        trs.each(function(){$(this).css("background-color",$(this).attr("bgcolor")).removeAttr("bgColorOn");})
                    }*/
                    trs.each(function(){$(this).css("background-color",$(this).attr("bgcolor")).removeAttr("bgColorOn");});
                    if(index==-1){
                    	trs.eq(0).css("background-color",highlightColor).attr("bgColorOn",highlightColor);
		            }else if(index+1>length-1){
		            	pubMethod.post(1); //翻到最后一行时下一页
		            }else{
		        	   trs.eq(index+1).css("background-color",highlightColor).attr("bgColorOn",highlightColor);
		        	}
		        }else if(keyCode==38){ //键盘向上
		        	/*if(!setting.isMultChoose){ //单选
		        		//背景色还原，只选一个
		        	   trs.each(function(){$(this).css("background-color",$(this).attr("bgcolor")).removeAttr("bgColorOn");;})
		        	}*/
		        	trs.each(function(){$(this).css("background-color",$(this).attr("bgcolor")).removeAttr("bgColorOn");;})
		        	if(index==-1){
		        	  trs.eq(length-1).css("background-color",highlightColor).attr("bgColorOn",highlightColor);
		        	}else if(index==0){
		        	   pubMethod.post(-1); //翻到第一行时上一页
		        	}else{
		        	  trs.eq(index-1).css("background-color",highlightColor).attr("bgColorOn",highlightColor);	
		        	} 
		       }else if(keyCode==37){ //键盘向左
		       	   pubMethod.post(-1);  //上一页
		       	   //console.log(setting.pageNo)
		       }else if(keyCode==39){ //键盘向右
		           pubMethod.post(1); //下一页
		           //console.log(setting.pageNo)
		       }else if(keyCode==13){ //enter键	
		       	   if($("#"+bindId+"_div").length>0){
		       	   	 pubMethod.enter();
		       	   	 $("[data-id='"+bindId+"_input']").trigger("blur");
	  	    		 $("[data-id='"+bindId+"_input']").trigger("focus");
	  	    		 return false;
		       	   }		       	  
		       }else if(keyCode==17){ //ctrl键
		           //isCtrl = false; 
		       }else if(keyCode==27){ //esc键
		       	   pubMethod.removeTo();
		       }else if(keyCode==8||keyCode==46){
		       	   var valueArray = $this.val().split(",");
		       	   if(valueArray.length>1){
		       	   	  return false;
		       	   }		       	  
		       }else{  //其他键 输入内容
		       }
	  	   }).keyup(function(){
	  	   	   //isCtrl = true;
	  	   	    var e = event||window.event,
		            keyCode = e.keyCode||e.which;
		        if(keyCode==8||keyCode==46){
		       	   var valueArray = $this.val().split(",");
		       	   if(valueArray.length>1){
		       	   	   valueArray.pop();
		       	   	   $this.val(valueArray.join(","))
		       	   	   return false;
		       	   }
		       	   pubMethod.post();
		        }else if(!(keyCode==38||keyCode==40||keyCode==27||keyCode==17||keyCode==13)){
		        	pubMethod.post();
		        }else{
		        	return false;
		        }
	  	   });
	  	})
	  }
    }
	$.fn.inputSelect = function(){
		var method = arguments[0];
		if(methods[method]){
			method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
		}
		else if(typeof(method)=='object'||!method){
            method = methods.init;
		}else{
            $.error( 'Method ' +  method + ' does not exist on jQuery.pluginName' );
            return this;
		}
        return method.apply(this, arguments);
	}
})(jQuery);
