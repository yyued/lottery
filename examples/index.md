# Lottery

---

## 演示

### 回字型抽奖
````html
<!-- 容器元素 -->
<div class="lotto" id="J_lottery1">
    <div class="lotto__list">
        <div data-lotto-item class="lotto__item">
            <img class="lotto__img" src="http://art.yypm.com/148x102x01" alt="" >
            <em class="lotto__txt">1Y币</em>
            <div class="lotto__border"></div>
        </div>
        <div data-lotto-item class="lotto__item">
            <img class="lotto__img" src="http://art.yypm.com/148x102x02" alt="" >
            <em class="lotto__txt">LOL皮肤(199QB)</em>
            <div class="lotto__border"></div>
        </div>
        <div data-lotto-item class="lotto__item">
            <img class="lotto__img" src="http://art.yypm.com/148x102x07" alt="" >
            <em class="lotto__txt">YY熊一只</em>
            <div class="lotto__border"></div>
        </div>
        <div data-lotto-item class="lotto__item">
            <img class="lotto__img" src="http://art.yypm.com/148x102x06" alt="" >
            <em class="lotto__txt">谢谢参与</em>
            <div class="lotto__border"></div>
        </div>
        <div data-lotto-item class="lotto__item">
            <img class="lotto__img" src="http://art.yypm.com/148x102x03" alt="" >
            <em class="lotto__txt">LOL英雄(45QB)</em>
            <div class="lotto__border"></div>
        </div>
        <div class="lotto__item" style="width:300px;"></div>
        <div data-lotto-item class="lotto__item">
            <img class="lotto__img" src="http://art.yypm.com/148x102x03" alt="" >
            <em class="lotto__txt">LOL英雄(45QB)</em>
            <div class="lotto__border"></div>
        </div>
        <div data-lotto-item class="lotto__item">
            <img class="lotto__img" src="http://art.yypm.com/148x102x05" alt="" >
            <em class="lotto__txt">LOL皮肤(69QB)</em>
            <div class="lotto__border"></div>
        </div>
        <div class="lotto__item" style="width:300px;"></div>
        <div data-lotto-item class="lotto__item">
            <img class="lotto__img" src="http://art.yypm.com/148x102x02" alt="" >
            <em class="lotto__txt">LOL皮肤(199QB)</em>
            <div class="lotto__border"></div>
        </div>
        <div data-lotto-item class="lotto__item">
            <img class="lotto__img" src="http://art.yypm.com/148x102x06" alt="" >
            <em class="lotto__txt">谢谢参与</em>
            <div class="lotto__border"></div>
        </div>
        <div data-lotto-item class="lotto__item">
            <img class="lotto__img" src="http://art.yypm.com/148x102x07" alt="" >
            <em class="lotto__txt">YY熊一只</em>
            <div class="lotto__border"></div>
        </div>
        <div data-lotto-item class="lotto__item">
            <img class="lotto__img" src="http://art.yypm.com/148x102x05" alt="" >
            <em class="lotto__txt">LOL皮肤(69QB)</em>
            <div class="lotto__border"></div>
        </div>
        <div data-lotto-item class="lotto__item">
            <img class="lotto__img" src="http://art.yypm.com/148x102x01" alt="" >
            <em class="lotto__txt">1Y币</em>
            <div class="lotto__border"></div>
        </div>
        <a id="J_start1" href="javascript:void(0);" class="btn-start">START</a>
    </div>
</div>

<!-- 示例样式 -->
<style type="text/css">
	.lotto em{padding: 0;}
    .lotto__list { position: relative; width: 650px; font-size: 0; }
	.lotto__item { position: relative; margin-left: 4px; margin-top: 4px; display: inline-block; *display: inline; *zoom: 1; width: 148px; height: 102px; text-align: center; }
	.lotto__img { width: 148px; height: 102px; }
	.lotto__txt { position: absolute; width: 100%; height: 24px; line-height: 24px; bottom: 0; left: 0; font-size: 14px; color: #fff; background-color: rgba(0, 0, 0, 0.3); filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=#7f000000, endColorstr=#7f000000); }
	.lotto__border { display: none; position: absolute; z-index: 1; left: -3px; top: -3px; width: 148px; height: 102px; border: 3px solid #FE2441; }
	.lotto__item--hover .lotto__border { display: block; }
	.btn-start { position: absolute; top: 125px; left: 180px; width: 254px; height: 176px; background-color: #aaa; color: #fff; line-height: 176px; text-align: center; font-size: 32px; }
	.btn-start:hover { background-color: #ccc; color: #fff; text-decoration: none; }
</style>
````


#### 调用方法
````javascript
seajs.use(['lottery','gallery/jquery/1.10.2/jquery'],function(Lottery, $){
	var lot1 = new Lottery({
		el : "#J_lottery1",
		lottoItem : '[data-lotto-item]',
		activeClass : 'lotto__item--hover'
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
````


### 一字型抽奖
````html
<!-- 容器元素 -->
<div class="lotto lotto2" id="J_lottery2">
    <div class="lotto__list">
        <div data-lotto-item class="lotto__item">
            <img class="lotto__img" src="http://art.yypm.com/148x102x01" alt="" >
            <em class="lotto__txt">1Y币</em>
            <div class="lotto__border"></div>
        </div>
        <div data-lotto-item class="lotto__item">
            <img class="lotto__img" src="http://art.yypm.com/148x102x02" alt="" >
            <em class="lotto__txt">LOL皮肤(199QB)</em>
            <div class="lotto__border"></div>
        </div>
        <div data-lotto-item class="lotto__item">
            <img class="lotto__img" src="http://art.yypm.com/148x102x07" alt="" >
            <em class="lotto__txt">YY熊一只</em>
            <div class="lotto__border"></div>
        </div>
        <div data-lotto-item class="lotto__item">
            <img class="lotto__img" src="http://art.yypm.com/148x102x06" alt="" >
            <em class="lotto__txt">谢谢参与</em>
            <div class="lotto__border"></div>
        </div>
        <a id="J_start2" href="javascript:void(0);" class="btn-start">START</a>
    </div>
</div>

<!-- 示例样式 -->
<style type="text/css">
	.lotto2{height: 350px;}
</style>
````


#### 调用方法
````javascript
seajs.use(['lottery','gallery/jquery/1.10.2/jquery'],function(Lottery, $){
	var lot2 = new Lottery({
		el : "#J_lottery2",
	})
	$('#J_start2').on('click', function(e){
		e.preventDefault()
		lot2.start()
		setTimeout(function(){
	        lot2.stop(2, function(){
	            console.log(123)
	        })
	    },2000)
	})
})
````


### lu型抽奖
````html
<!-- 容器元素 -->
<div class="lotto lotto3" id="J_lottery3">
    <div class="lotto__list">
        <div data-lotto-item class="lotto__item">
            <img class="lotto__img" src="http://art.yypm.com/148x102x01" alt="" >
            <em class="lotto__txt">1Y币</em>
            <div class="lotto__border"></div>
        </div>
        <div data-lotto-item class="lotto__item">
            <img class="lotto__img" src="http://art.yypm.com/148x102x02" alt="" >
            <em class="lotto__txt">LOL皮肤(199QB)</em>
            <div class="lotto__border"></div>
        </div>
        <div data-lotto-item class="lotto__item">
            <img class="lotto__img" src="http://art.yypm.com/148x102x07" alt="" >
            <em class="lotto__txt">YY熊一只</em>
            <div class="lotto__border"></div>
        </div>
        <div data-lotto-item class="lotto__item">
            <img class="lotto__img" src="http://art.yypm.com/148x102x06" alt="" >
            <em class="lotto__txt">谢谢参与</em>
            <div class="lotto__border"></div>
        </div>
        <a id="J_start3" href="javascript:void(0);" class="btn-start">START</a>
    </div>
</div>

<!-- 示例样式 -->
<style type="text/css">
	.lotto3{height: 460px;}
	.lotto3 .lotto__list{width: 148px; float: left; _display: inline; }
	.lotto3 .lotto__item{display: block;}
</style>
````


#### 调用方法
````javascript
seajs.use(['lottery','gallery/jquery/1.10.2/jquery'],function(Lottery, $){
	var lot3 = new Lottery({
		el : "#J_lottery3",
	})
	$('#J_start3').on('click', function(e){
		e.preventDefault()
		lot3.start()
		setTimeout(function(){
	        lot3.stop(2, function(){
	            console.log(123)
	        })
	    },2000)
	})
})
````
