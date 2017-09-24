//楼层滚动
(function (r, f) {
	if(typeof exports === "object")
		exports = f();    //CommonJS
	else if(typeof define === "function" && define.amd)
		define([], f);  //AMD
	else
		r.Elvt = f();     //普通浏览器
})(this, function () {
//将对楼层和电梯添加自定义属性data-elvt-index
	//激活的楼层和电梯将添加elvt类
	function active(floor, elvt, offset){
		let obj = {floor: floor, elvt: elvt};
		window.onscroll=function(){
			obj = on_body_scroll(obj, offset);    //开始楼层电梯
		}
	}

	function on_body_scroll(obj, offset) {  //滚动监听
		let top = 0;//当前滚动条高度
		if(document.documentElement && document.documentElement.scrollTop)
			top = Math.floor(document.documentElement.scrollTop);   //火狐有效
		else if(document.body)
			top = Math.floor(document.body.scrollTop);  //谷歌有效
		let elvt = obj.elvt;//当前电梯
		let floor = obj.floor;//当前电梯
		let h = parseInt(getComputedStyle(floor.data).height);
		//console.log(h);
		elvt.data.classList.remove("elvt");
		floor.data.classList.remove("elvt");
		//evs.evli[parseInt(s.data.dataset.idx)].removeAttribute("class");
		if(top +offset > floor.data.offsetTop + h){
			do{
				if(floor.next){
					floor = floor.next;
					elvt = elvt.next;
				}
				else
					break;
				if(top + offset + 1 < floor.data.offsetTop)
					break;
			}while(true);
		}
		else if(top < floor.data.offsetTop - offset){
			do{
				if(floor.prev){
					floor = floor.prev;
					elvt = elvt.prev;
				}
				else
					break;
				h = parseInt(getComputedStyle(floor.data).height);
				if(top - offset + 1 < floor.data.offsetTop + h)
					break;
			}while(true);
		}
		//floor,elvt已经是当前显示的
		floor.data.classList.add("elvt");
		elvt.data.classList.add("elvt");
		return {floor: floor, elvt: elvt};
	}

	class _{
		constructor(parent, iter, offset)
		{//parent 楼层，不少于2层  //iter 电梯，数量等于楼层  //offset 触发楼层滚动的允许误差，偏移
			if(Node.prototype._ !== "NODE")
				throw new ReferenceError(">ELVT >CSRT 此模块依赖链表list.js，请先引入list.js");

			if(/^\[object HTML[a-zA-Z]*Element\]$/.test(Object.prototype.toString.call(parent))){
				if(/^\[object HTML[a-zA-Z]*Element\]$/.test(Object.prototype.toString.call(parent))){
					let fls = parent.children;
					if(fls.length>1){
						let its = iter.children;
						if(its.length === fls.length){
							let node={}, floor = new Node(fls[0]), elvt = new Node(its[0]);
							for(var i=1; i<its.length; i++){
								node = new Node(fls[i]);
								floor.list_push_back(floor, node);
								node = new Node(its[i]);
								elvt.list_push_back(elvt, node);
							}
							offset = parseInt(offset);
							if(isNaN(offset) || offset<100 || offset>300){
								offset = 200;   //滚动误差，滚动时距离上下边界的允许误差
								console.warn(">ELVT >CSRT 滚动误差未设置或设置了无效的值，已重置为200");
							}

							this.floor = floor;//楼层
							this.elvt = elvt;   //电梯
							this.offset = offset;//滚动误差
							active(this.floor, this.elvt, this.offset);
						}
						else
							throw new Error(">ELVT >CSRT 楼层数量不等于电梯索引数量");
					}
					else
						throw new Error(">ELVT >CSRT 少于2个楼层的楼层电梯是无意义的");
				}
				else
					throw new TypeError(">ELVT >CSRT 参数“iter”必须是一个DOM元素，表示包含楼层索引的父元素");
			}
			else
				throw new TypeError(">ELVT >CSRT 参数“parent”必须是一个DOM元素，表示包含楼层的父元素");
		}
	}
	_.prototype._ = "ELVT";
	return _;
});