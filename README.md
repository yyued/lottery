# Lottery

> 一个浏览器端抽奖动画js组件

## Usage

```html
<div class="lotto" id="J_lottery">
    <div class="lotto__list">
        <div data-lotto-item class="lotto__item">
            <img class="lotto__img" src="img/prize01.jpg" alt="" >
            <em class="lotto__txt">1Y币</em>
            <div class="lotto__border"></div>
        </div>
        <div data-lotto-item class="lotto__item">
            <img class="lotto__img" src="img/prize02.jpg" alt="" >
            <em class="lotto__txt">LOL皮肤(199QB)</em>
            <div class="lotto__border"></div>
        </div>
        <div data-lotto-item class="lotto__item">
            <img class="lotto__img" src="img/prize07.jpg" alt="" >
            <em class="lotto__txt">YY熊一只</em>
            <div class="lotto__border"></div>
        </div>
        <div data-lotto-item class="lotto__item">
            <img class="lotto__img" src="img/prize06.jpg" alt="" >
            <em class="lotto__txt">谢谢参与</em>
            <div class="lotto__border"></div>
        </div>
        <a id="J_start2" href="javascript:void(0);" class="btn-start">START</a>
    </div>
</div>
```

```javascript
seajs.use(['lottery','gallery/jquery/1.10.2/jquery'],function(Lottery, $){
	var lot = new Lottery({
		el : "#J_lottery"
	})
	$('#J_start1').on('click', function(e){
		e.preventDefault()
		lot1.start()
		setTimeout(function(){
	        lot1.stop(2, function(){
	            console.log(123)
	        })
	    },2000)
	})
})
```

## Api

### 构造参数(可选项)

* el: 抽奖容器元素，默认值`body`，页面有多个抽奖动画时，需指定。
* lottoItem: 用来指定抽奖容器内的奖品元素，默认值`[data-lotto-item]`
* activeClass: 执行抽奖动画时切换的样式名，默认值`lotto__item--hover`

### 方法
* `start()`

* `stop(stopIndex, cb, ctx)`
	* stopIndex: 数值类型，表示动画停在哪个奖品序号，奖品序号按从0开始左上角顺时针排列
	* cb: 动画停止后执行的回调函数，如无可不指定
	* ctx: 函数的上下文，如无可不指定