//轮播模块
(function (r, f) {
	if(typeof exports === "object")
		exports = f();    //CommonJS
	else if(typeof define === "function" && define.amd)
		define([], f);  //AMD
	else
		r.Slider = f();     //普通浏览器
})(this, function () {
	let tm = null;
	
	function slider_task(es)
	{//es: this.elms
		//this.elms.elms:轮播的元素
		//this.elms.iter:轮播元素对应的指示器
		if(es.data.iter)
			es.data.iter.classList.remove("active");
		es.data.elms.classList.remove("active");
		es.data.elms.classList.add("dying");
		es = es.next;
		if(es.data.iter)
			es.data.iter.classList.add("active");
		es.data.elms.classList.remove("dead");
		es.data.elms.classList.add("active");
		setTimeout(function () {
			es.prev.data.elms.classList.remove("dying");
			es.prev.data.elms.classList.add("dead");
		}, 500);//此定时器时间需要和过渡时间一致
		return es;
	}

	class _{
		constructor(parent, iter, time)
		{//parent 轮播的父元素; time 轮播的时间
			if(Node.prototype._ !== "NODE")
				throw new ReferenceError(">Slider >CSRT 此模块依赖链表list.js，请先引入list.js");

			if(/^\[object HTML[a-zA-Z]*Element\]$/.test(Object.prototype.toString.call(parent))){
				let iters=[], elms = parent.querySelectorAll("[data-cell-index]");
				let direction = parent.dataset.slider;
				//检查参数必须是DOM元素，有不少于2个子元素
				//检查轮播
				if(elms.length <1){
					elms = parent.children;
					for(var i=0; i<elms.length; i++)
						elms[i].dataset.cellIndex = i;
					console.warn(">Slider >CSRT 父元素“parent”下无属性为 data-cell-index 的子元素，已设置所有子元素为轮播对象");
				}
				if(elms.length <2)
					throw new RangeError(">Slider >CSRT 父元素“parent”有少于两个子元素，无法轮播");
				//检查轮播指示器
				if(iter && /^\[object HTML[a-zA-Z]*Element\]$/.test(Object.prototype.toString.call(iter))){
					iters = iter.querySelectorAll("[data-cell-index]");
					if(iters.length <1){
						if(iter.children.length === elms.length){
							iters = iter.children;
							for(i=0; i<iters.length; i++)
								iters[i].dataset.cellIndex = i;
							console.warn(">Slider >CSRT 父元素“iter”下无属性为 data-cell-index 的子元素，已设置所有子元素为轮播指示器");
						}
						else{
							//iters = null;
							iters = [];
							console.error(">Slider >CSRT 轮播和轮播指示器数量不同，已忽略轮播指示器设置");
						}
					}
					else{
						if(iters.length !== elms.length){
							//iters = null;
							iters = [];
							console.error(">Slider >CSRT 轮播和轮播指示器数量不同，已忽略轮播指示器设置");
						}
					}
				}
				//检查指示器是否为空
				if(iters.length<1){
					for(i=0; i<elms.length; i++)
						iters[i] = null;
				}
				//检查元素结束

				if(direction!=="vertical" && direction!=="horizontal")
				{//检查是否定义了轮播方向
					parent.dataset.slider = "vertical";
					console.warn(">Slider >CSRT 父元素“parent”未指定轮播方向或设置了不支持的值，重置为默认垂直方向");
				}
				//轮播时间
				time = parseInt(time);
				if(isNaN(time) || time <500){
					time = 1000;
					console.warn(">Slider >CSRT 轮播间隔未指定或小于500毫秒，已重置默认1000毫秒");
				}
				//构造循环链表
				let node={}, list = new Node({elms: elms[0], iter: iters[0]});
				for(i=1; i<elms.length; i++){
					node = new Node({elms: elms[i], iter: iters[i]});
					list.list_push_back(list, node);
				}
				list.list_loop(list);
				//开始轮播
				this.elms = list;
				this.time = time;
				this.status = true;
				tm = setInterval(function(){
					this.elms = slider_task(this.elms)
				}.bind(this), this.time);
			}
			else
				throw new TypeError(">Slider >CSRT 参数“parent”必须是一个DOM元素，表示需要轮播的父元素");
		}
		slider_stop(){
			if(tm){
				clearInterval(tm);
				tm = null;
				this.status = false;
				return true;
			}
			else
				console.error(">Slider >slider_stop 轮播已是停止状态");
			return false;
		}
		slider_start(){
			if(tm)
				console.error(">Slider >slider_start 轮播已是开始状态");
			else{
				tm = setInterval(function(){
					this.elms = slider_task(this.elms)
				}.bind(this), this.time);
				this.status = true;
				return true;
			}
			return false;
		}
		slider_toggle(){
			if(tm)
				return this.slider_stop();
			else
				return this.slider_start();
		}
	}
	_.prototype._="SLIDER";//用于方便检查是否已加载此模块
	return _;
});