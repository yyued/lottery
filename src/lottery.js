define(function (require, exports, module) {
	var $ = require('gallery/jquery/1.10.2/jquery'),
		_ = require('gallery/underscore/1.6.0/underscore'),
		Class = require('arale/class/1.1.0/class');

	var STATUS_STARTING = 1, STATUS_STOPPING = 2, STATUS_STOPPED = 3,
		SPEED_HIGH = 50, SPEED_LOW = 300;

	var defaults = {
			el: "body",
			lottoItem: "[data-lotto-item]",
			activeClass: "lotto__item--hover"
		};
	var Lottery = Class.create({
		initialize: function(opts){
		    // 0. setup config
			var options = this.options = $.extend({}, defaults, opts)
		    var $arr = $(options.el).find(options.lottoItem),
		        lottoArr = _createCycleArr($arr), //格子们顺时针排好队
		    	activeClass = options.activeClass,
		        finished = false, //一轮游戏结束转动标志 
		        step = 0, //一轮游戏的计步数
		        cycle = 0, //当前转动圈数   
		        cycleTotal = 10, //一轮游戏的总转动圈数
		        index = 0, //当前格
		        indexPrev, //前一格
		        indexStop = 0, //决定在哪一格停止
		        indexSpeedUp = 5, //决定在哪一格加速
		        indexSpeedDown = 0, //决定在哪一格减速
		        timerId1, //定时器对象，开始
		        timerId2, //定时器对象，结束
		        that = this;
	    	that.status = STATUS_STOPPED

		    // 1. reset config
		    this._resetStart = function () {
		        that.status = STATUS_STARTING
		        $(lottoArr).removeClass(activeClass)
		        indexSpeedUp = 5
		    }
		    this._resetStop = function () {
		        that.status = STATUS_STOPPING
		        finished = false
		        cycle = 0
		        cycleTotal = 3
		        indexSpeedUp = 0
		    }

		    // 2. exec animation && callback
		    this._start = function () {
		        timerId1 = setInterval(move1, SPEED_LOW);
		        function move1() {
		            //走N格开始加速
		            if (step == indexSpeedUp) {
		                clearInterval(timerId1);
		                timerId1 = setInterval(move1, SPEED_HIGH);
		            }

		            if (that.status === STATUS_STOPPING){
		                clearInterval(timerId1);
		            }

		            if (index >= lottoArr.length) {
		                index = 0
		            }

		            indexPrev = index > 0 ? index - 1 : lottoArr.length - 1
		            $(lottoArr[indexPrev]).removeClass(activeClass)
		            $(lottoArr[index]).addClass(activeClass)

		            index++
		            step++
		        }
		    } 
		    this._stop = function (stopIndex, cb, cbCtx) {
		    	stopIndex = stopIndex || 0
		    	cb = cb || function(){}
		        timerId2 = setInterval(move2, SPEED_HIGH);
		        function move2() {   
		            //跑马灯变速
		            if (finished == false) {
		                //跑N圈减速
		                if (cycle > cycleTotal && index == 4) {
		                    clearInterval(timerId2);
		                    finished = true; //触发结束  
		                    timerId2 = setInterval(move2, SPEED_LOW);
		                }
		            }

		            if (index >= lottoArr.length) {
		                index = 0;
		                cycle++;
		            }

		            indexPrev = index > 0 ? index - 1 : lottoArr.length - 1;
		            $(lottoArr[index]).addClass(activeClass)
		            $(lottoArr[indexPrev]).removeClass(activeClass)

		            //结束转动并选中号码
		            if (finished == true && index == stopIndex) {
		                clearInterval(timerId2)
		                step = 0
		                that.status = STATUS_STOPPED
		                cb.call(cbCtx)
		            }

		            index++
		            step++
		        }
		    }

		    // utils
		    function _createCycleArr(selector) {
		        var $item = $(selector),arrSrc = [],arrOrder = [],arrDst = [],topMin = 9999,topMax = 0,leftMin = 9999,leftMax = 0,_arrTop = [],_arrBottom = [],_arrLeft = [], _arrRight = [];
		        $item.each(function(i, e) {
		            var obj = $(e).offset()
		            obj.elem = e
		            arrSrc.push(obj)
		        })
		        _.each(arrSrc, function(e) {
		            topMin = e.top < topMin ? e.top : topMin;
		            topMax = e.top > topMax ? e.top : topMax;
		            leftMin = e.left < leftMin ? e.left : leftMin;
		            leftMax = e.left > leftMax ? e.left : leftMax;
		        })
		        _.each(arrSrc, function(e) {
		            e.top === topMin && _arrTop.push(e)
		            e.top === topMax && _arrBottom.push(e)
		            e.left === leftMin && _arrLeft.push(e)
		            e.left === leftMax && _arrRight.push(e)
		        })
		        _arrTop.sort(function(a, b) {
		            return a.left - b.left
		        })
		        _arrRight.sort(function(a, b) {
		            return a.top - b.top
		        })
		        _arrBottom.sort(function(a, b) {
		            return b.left - a.left
		        })
		        _arrLeft.sort(function(a, b) {
		            return b.top - a.top
		        })
		        _arrTop = _arrTop.slice(0, _arrTop.length-1)
		        _arrRight = _arrRight.slice(0, _arrRight.length-1)
		        _arrBottom = _arrBottom.slice(0, _arrBottom.length-1)
		        _arrLeft = _arrLeft.slice(0, _arrLeft.length-1)
		        arrOrder = _arrTop.concat(_arrRight.concat(_arrBottom.concat(_arrLeft)))
		        _.each(arrOrder, function(e) {
		            arrDst.push(e.elem)
		        })
		        return arrDst
		    }

		},
		start: function(){
			if(this.status !== STATUS_STOPPED){
				return;
			}
			this._resetStart()
            this._start()
		},
		stop: function(index, cb, ctx){
			if(this.status !== STATUS_STARTING){
				return;
			}
            this._resetStop()
            this._stop(index, cb, ctx)
		}
	})

	module.exports = Lottery
})