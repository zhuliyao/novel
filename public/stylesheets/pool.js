//冒泡排序
function bubSort(arr){
	for(var i=0;i<arr.length-1;i++){
		for(var j=0;j<arr.length-1-i;j++){
				if(arr[j]>arr[j+1]){
					var tmp;
					tmp = arr[j];
					arr[j] = arr[j+1];
					arr[j+1] = tmp;
				}
		}
	}
	return arr;
}
//选择排序
function selSort(arr){
	for(var i=0;i<arr.length-1;i++){
		for(var j=i;j<arr.length-1;j++){
				if(arr[i]>arr[j+1]){
						var tmp;
						tmp = arr[i];
						arr[i] = arr[j+1];
						arr[j+1] = tmp;
				}
		}
	}
	return arr;
}
//返回最大值
function getMax(arr){
	var max = arr[0];
	for(var i=0;i<arr.length;i++){
			if(max<arr[i]){
				max = arr[i]
			}
	}
	return max;
}
//返回最小值
function getMin(arr){
	var min = arr[0];
	for(var i=0;i<arr.length;i++){
			if(min>arr[i]){
				min = arr[i]
			}
	}
	return min;
}
//去重
function norepeat(arr){
	var newArr = [];
	for(var i=0;i<arr.length;i++){
		if(newArr.indexOf(arr[i])==-1){
			newArr.push(arr[i]);
		}
	}
	return newArr;
}
//随机范围在num1-num2之间的数
function random1num(min,max){
	return parseInt(min+Math.random()*(max-min+1));
}

//如何将日期格式转换成字符串
function date1String(date,sign){
	sign = sign==undefined?'/':sign;
	return date.getFullYear()+sign+isDblNum(date.getMonth()+1)+sign+isDblNum(date.getDate())+' '+isDblNum(date.getHours())+":"+isDblNum(date.getMinutes())+':'+isDblNum(date.getSeconds());
}

//判断位数是不是一个个位数
function isDblNum(item){
	return item = item<10?'0'+item:item;
}
//获取非行间样式
function getStyle(ele,attr){
	if(ele.currentStyle){
		return ele.currentStyle[attr];
	}else{
		return getComputedStyle(ele,false)[attr];
	}
}
//元素隐藏
function hide(ele){
	ele.style.display='none';
}
//元素显示
function show(ele){
	ele.style.display='block';
}
//获取  删除  添加自定义属性
//当传入2个值得时候是获取
//当传入3个值得时候是设置
//当传入4个值得时候是删除
function attr(ele,eleName,val,boolean){
	if(arguments.length==2){
		return ele.getAttribute(eleName);
	}

	if(arguments.length==3){
		return ele.setAttribute(eleName,val);
	}
	
	if(boolean){
		return ele.removeAttribute(eleName)
	}
}
//获取DOM节点
function getNode(farthNode){
	var arr = farthNode.childNodes;
	var newArr = [];
	for(var i=0;i<arr.length;i++){
		if(arr[i].nodeType==1){
			newArr.push(arr[i])
		}
	}
	return newArr
}
//随机颜色
function randomColor(){
	var R = random1num(0,255); 
	var G = random1num(0,255); 
	var B = random1num(0,255);
	return '#'+string2num(R,G,B) 
}
function string2num(r,g,b){
	r = r.toString(16).length<2?'0'+r.toString(16):r.toString(16);
	g = g.toString(16).length<2?'0'+g.toString(16):g.toString(16);
	b = b.toString(16).length<2?'0'+b.toString(16):b.toString(16);
	return r+g+b
}
//getCookie
function getCookie(_name){
	var str = document.cookie;
	var arr = str.split('; ');
	for(var i=0;i<arr.length;i++){
		var newarr = arr[i].split('=');
		if(newarr[0]==_name){
			return newarr[1];
		}
	}
}
//获取到className
function getClassName(ele,_name){
	var aDiv = document.getElementsByTagName(ele);
	var arr = [];
	var str = new RegExp('\\b'+_name+'\\b','i')
	console.log(str)
	for(var i=0;i<aDiv.length;i++){
		if(aDiv[i].className.match(str)){
				arr.push(aDiv[i]);
		}
	}
	return arr;
}


//运动框架
function move(obj,json,fn){
	clearInterval(obj.timer);
	obj.timer=setInterval(function(){
		var bStop = true;
		for(var attr in json){
			//获取到属性值
			var iCur = 0;
			if(attr=='opacity'){
				iCur = parseInt(parseFloat(getStyle(obj,attr))*100)
			}else{
				iCur = parseInt(getStyle(obj,attr));
			}

			//速度
			var speed = 0;
			speed=(json[attr]-iCur)/8;
			speed = speed>0?Math.ceil(speed):Math.floor(speed);
			if(iCur!=json[attr]){
				bStop=false;
			}

			if(attr=='opacity'){
					obj.style.filter='alpha(opacity:'+(iCur+speed)+')';
					obj.style.opacity=(iCur+speed)/100;
			}else{
				obj.style[attr] = iCur+speed+'px';
			}
			
		}
		if(bStop){
			clearInterval(obj.timer);
			if(fn){
				fn();
			}
		}
	},30)
}