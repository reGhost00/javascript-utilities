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
	
	function slider_task(es) {
		es.data.classList.remove("active");
		es.data.classList.add("dying");
		es = es.next;
		es.data.classList.remove("dead");
		es.data.classList.add("active");
		setTimeout(function () {
			es.prev.data.classList.remove("dying");
			es.prev.data.classList.add("dead");
		}, 1000);
		return es;
	}

	class _{
		constructor(parent, time)
		{//parent 轮播的父元素; time 轮播的时间
			if(/^\[object HTML[a-zA-Z]*Element\]$/.test(Object.prototype.toString.call(parent))){
				let elms = parent.querySelectorAll("[data-cell-index]");
				let direction = parent.dataset.slider;
				//检查参数必须是DOM元素，有不少于2个子元素
				if(elms.length <1){
					elms = parent.children;
					for(var i=0; i<elms.length; i++)
						elms[i].dataset.cellIndex = i;
					console.warn(">Slider >constructor 父元素“parent”下无属性为 data-cell-index 的子元素，已设置所有子元素为轮播对象");
				}
				if(elms.length <2)
					throw new RangeError(">Slider >constructor 父元素“parent”有少于两个子元素，无法轮播");
				if(direction!=="vertical" && direction!=="horizontal")
				{//检查是否定义了轮播方向
					parent.dataset.slider = "vertical";
					direction = "vertical";
					console.warn(">Slider >constructor 父元素“parent”未指定轮播方向或设置了不支持的值，重置为默认垂直方向");
				}
				//轮播时间
				time = parseInt(time);
				if(isNaN(time) || time <500){
					time = 1000;
					console.warn(">Slider >constructor 轮播间隔未指定或小于500毫秒，已重置默认1000毫秒");
				}
				//构造循环链表
				let node={}, list = new Node(elms[0]);
				for(i=1; i<elms.length; i++){
					node = new Node(elms[i]);
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
				throw new TypeError(">Slider >constructor 参数“parent”必须是一个DOM元素，表示需要轮播的父元素");
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

	return _;
});