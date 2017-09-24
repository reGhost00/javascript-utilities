//最后修改日期：2017年9月23日
(function(r, f){
	if(typeof exports === "object")
		exports = f();    //CommonJS
	else if(typeof define === "function" && define.amd)
		define([], f);  //AMD
	else
		r.Node = f();     //普通浏览器
})(this, function () { //返回类到全局
	//双向链表
	class _{
		constructor(data){
			this.data = data;
			this.prev = null;
			this.next = null;
			this._type = "LIST_NODE";
			this._loop = false;
		}
		////////
		//  返回链表的第一个结点
		list_front(list)
		{//list 链表中某个结点
			if(list && list._type === "LIST_NODE"){
				if(!list._loop){
					let buf = list;
					do{
						if(buf.prev)
							buf = buf.prev;
						else
							break;
					}while(true);
					return buf;
				}
				else
					console.error(">Node >list_front 该方法在循环链表上使用是无意义的");
			}
			else
				console.error(">Node >list_front 提供的链表是无效的");
			return false;
		}
		////////
		//  返回链表的最后一个结点
		list_back(list)
		{//list 链表中某个结点
			if(list && list._type === "LIST_NODE"){
				if(!list._loop){
					let buf = list;
					do{
						if(buf.next)
							buf = buf.next;
						else
							break;
					}while(true);
					return buf;
				}
				else
					console.log(">Node >list_back 该方法在循环链表上使用是无意义的");//throw new TypeError(">Node >list_back 该方法在循环链表上使用是无意义的");
			}
			else
				console.error(">Node >list_back 提供的链表是无效的");//throw  new TypeError(">Node >list_back 提供的链表是无效的");
			return false;
		}
		////////
		//  将一个结点插入到链表末尾
		list_push_back(list, node)
		{//list 链表中某个结点  node 要插入的结点
			if(list && list._type === "LIST_NODE"){
				if(node && node._type ==="LIST_NODE"){
					if(list._loop){//循环链表
						list.next.prev = node;
						node.next = list.next;
						list.next = node;
						node.prev = list;
					}
					else{
						list = this.list_back(list);
						list.next = node;
						node.prev = list;
						node.next = null;
					}
					return true;
				}
				else
					console.error(">Node >list_push_back 提供了无效的结点");//throw new TypeError(">Node >list_push_back 提供了无效的结点");
			}
			else
				console.error(">Node >list_push_back 提供的链表是无效的，结点必须插入到链表中");//throw new TypeError(">Node >list_push_back 提供的链表是无效的，结点必须插入到链表中");
			return false;
		}
		////////
		//  将一个结点插入到链表中指定位置
		list_insert(list, node, idx)
		{//list 链表中某个结点  node 要插入的结点  idx 要插入的位置
			if(list && list._type === "LIST_NODE"){
				if(node && node._type ==="LIST_NODE"){
					list = this.list_front(list);
					if(list){
						for(let i=0; i<idx; i++)
							if(list.next)list = list.next;
						list.prev.next = node;
						node.prev = list.prev;
						list.prev = node;
						node.next = list;
						return true;
					}
					else
						console.error(">Node >list_insert 无法找到链表中第一个结点");
				}
				else
					console.error(">Node >list_insert 提供了无效的结点");//throw new TypeError(">Node >list_insert 提供了无效的结点");
			}
			else
				console.error(">Node >list_insert 提供的链表是无效的，结点必须插入到链表中");//throw new TypeError(">Node >list_insert 提供的链表是无效的，结点必须插入到链表中");
			return false;
		}
		//删除链表中第一个结点
		list_pop_front(list)
		{//参数 list 链表中某个结点
			// 返回删除后链表的第一个结点
			if(list && list._type === "LIST_NODE"){
				list = this.list_front(list);
				let tmp = list.next;
				tmp.prev = null;
				list.next = null;
				return tmp;
			}
			else
				console.error(">Node >list_pop_front 提供的链表是无效的");//throw new TypeError(">Node >list_pop_front 提供的链表是无效的");
			return false;
		}
		//删除指定位置的结点
		list_erase(list, idx)
		{//参数 list 链表中某个结点
			// idx 删除索引
			// 返回删除后idx的上一个结点
			if(idx > 0){
				if(list && list._type === "LIST_NODE"){
					let tmp = this.list_front(list);
					for(let i=0; i<idx; i++)
						if(tmp.next)tmp = tmp.next;// 要删除tmp
					list = tmp.prev;
					list.next = tmp.next;
					tmp.next.prev = list;
					tmp.next = null;
					tmp.prev = null;
					return true;
				}
				else
					console.error(">Node >list_erase 提供的链表是无效的");
				return false;
			}
			else
				return this.list_pop_front(list);
		}
		////////
		//  循环链表
		list_loop(list)
		{//参数 list 链表中某个结点
			if(list && list._type === "LIST_NODE"){
				if(list._loop)
					console.warn(">Node >list_loop 参数“list”已经是循环链表");
				else{
					let last = this.list_back(list);
					list = this.list_front(list);
					list.prev = last;
					last.next = list;
					//list._loop = true;
					do{
						list._loop = true;
						list = list.next;
					}while(!list._loop);
				}
				return true;
			}
			else
				console.error(">Node >list_loop 提供的链表是无效的");
			return false
		}
		////////
		//  释放链表
		list_clean(list)
		{//参数 list 链表中某个结点
			if(list && list._type === "LIST_NODE"){
				if(!list._loop)//如果不是循环链表
					list = this.list_front(list);
				let tmp = {};
				do{
					tmp = list.next;
					list = null;
					list = tmp;
					tmp = null;
				}while(list.next);
				return true;
			}
			else
				console.error(">Node >list_clean 提供的链表是无效的");
			return false;
		}
	}
	_.prototype._="NODE";//用于方便检查是否已加载此模块
	return _;
});
