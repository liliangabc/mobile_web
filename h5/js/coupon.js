var obj = {
    initBox: function () {
        this.shadeBox = document.getElementsByClassName('shade')[0];
        this.introductBox = document.getElementsByClassName('introduct-box')[0];
        this.linkRule = document.getElementsByClassName('link-rule')[0];
        this.introductBoxWidth = parseInt(getComputedStyle(this.introductBox).width);
        this.shadeBox.style.height = this.introductBox.style.height = document.documentElement.clientHeight + 'px';
        var that = this;
        this.linkRule.onclick = function () {
            clearTimeout(that.tid);
            cancelAnimationFrame(that.aniFrame);
            that.shadeBox.classList.remove('hide');
            that.toLeft(that.introductBox, -that.introductBoxWidth, 0, 20);
        };
        this.shadeBox.addEventListener('touchstart', function (e) {
            e.preventDefault();
            clearTimeout(that.tid);
            cancelAnimationFrame(that.aniFrame);
            this.classList.add('hide');
            that.toRight(that.introductBox, 0, -that.introductBoxWidth, 20);
        })
        this.introductBox.addEventListener('touchstart', function (e) {
            e.preventDefault();
            clearTimeout(that.tid);
            that.shadeBox.classList.remove('hide');
            var touch = e.targetTouches[0];
            that.startTime = Date.now();
            that.startX = touch.clientX;
        }, false);
        this.introductBox.addEventListener('touchmove', function (e) {
            e.preventDefault();
            var touch = e.targetTouches[0];
            that.endX = touch.clientX;
            var s = that.endX - that.startX;
            this.style.right = (s <= 0 ? 0 : -s) + 'px';
        }, false);
        this.introductBox.addEventListener('touchend', function (e) {
            e.preventDefault();
            clearTimeout(that.tid);
            cancelAnimationFrame(that.aniFrame);
            var countTime = Date.now() - that.startTime;
            var s = that.endX - that.startX;
            var w = that.introductBoxWidth;
            var step;
            if ((s >= w / 2) | (countTime < 200 && s >= w / 8)) {
                step = Math.ceil(20 / w * (w - s));
                that.toRight(that.introductBox, -s, -w, step);
                that.tid = setTimeout(function () {
                    that.shadeBox.classList.add('hide');
                }, 100)
            } else {
                step = Math.ceil(20 / w * s);
                that.toLeft(that.introductBox, -s, 0, step);
            }
        }, false);
    },
    toLeft: function (el, startX, endX, step) {
        var that = this;
        (function () {
            that.aniFrame = requestAnimationFrame(arguments.callee);
            startX += step;
            if (startX >= endX) {
                startX = endX;
                cancelAnimationFrame(that.aniFrame);
            }
            el.style.right = startX + 'px';
        })();
    },
    toRight: function (el, startX, endX, step) {
        var that = this;
        (function () {
            that.aniFrame = requestAnimationFrame(arguments.callee);
            startX -= step;
            if (startX <= endX) {
                startX = endX;
                cancelAnimationFrame(that.aniFrame);
            }
            el.style.right = startX + 'px';
        })();
    }
}
document.addEventListener('DOMContentLoaded', obj.initBox.bind(obj), false);