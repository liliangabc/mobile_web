var turnplate = {
    init: function () {
        // 奖品列表
        this.restaraunts = ["50M免费流量包", "10闪币", "谢谢参与", "5闪币", "10M免费流量包", "20M免费流量包", "20闪币 ", "30M免费流量包"];
        // 外层父元素
        this.parent = document.getElementById('turnplate');
        var w = parseInt(getComputedStyle(this.parent).width);
        this.parent.style.height = w + 'px';
        // 画布和上下文
        this.canvas = this.parent.getElementsByTagName('canvas')[0];
        this.ctx = this.canvas.getContext("2d");
        this.cH = this.cW = this.canvas.height = this.canvas.width = w;
        // 指针
        this.pointer = this.parent.getElementsByClassName('pointer')[0];
        // 外圆
        this.outsideRadius = this.cW / 2 - 5;
        // 文本绘制的半径
        this.textRadius = this.outsideRadius * .8;
        // 内圆
        this.insideRadius = parseInt(getComputedStyle(this.pointer).width) / 2;
        // 开始角度
        this.startAngle = 0;
        // 是否在旋转
        this.bRotate = false;
        // 绘制圆盘
        this.draw();
        var that = this;
        // 指针点击
        this.pointer.addEventListener('click', function () {
            that.rotate(null, oTipBox.show.bind(oTipBox));
        }, false);
    },
    draw: function () {
        var arc = Math.PI / (this.restaraunts.length / 2);
        this.ctx.clearRect(0, 0, this.cW, this.cH);
        this.ctx.strokeStyle = "#FFBE04";
        this.ctx.font = '12px Microsoft YaHei';
        var that = this;
        for (var i = 0; i < this.restaraunts.length; i++) {
            var angle = this.startAngle + i * arc;
            this.ctx.fillStyle = (i % 2 == 0) ? "#FFF4D6" : "#FFFFFF";
            this.ctx.beginPath();
            this.ctx.arc(this.cW / 2, this.cH / 2, this.outsideRadius, angle, angle + arc, false);
            this.ctx.arc(this.cW / 2, this.cH / 2, this.insideRadius, angle + arc, angle, true);
            this.ctx.stroke();
            this.ctx.fill();
            this.ctx.save();
            //----绘制奖品开始----
            this.ctx.fillStyle = "#E5302F";
            var text = this.restaraunts[i];
            var line_height = 17;
            this.ctx.translate(this.cW / 2 + Math.cos(angle + arc / 2) * this.textRadius, this.cH / 2 + Math.sin(angle + arc / 2) * this.textRadius);
            this.ctx.rotate(angle + arc / 2 + Math.PI / 2);
            if (text.indexOf("M") > 0) {
                var texts = text.split("M");
                for (var j = 0; j < texts.length; j++) {
                    this.ctx.font = j == 0 ? 'bold 16px Microsoft YaHei' : '12px Microsoft YaHei';
                    if (j == 0) {
                        this.ctx.fillText(texts[j] + "M", -this.ctx.measureText(texts[j] + "M").width / 2, j * line_height);
                    } else {
                        this.ctx.fillText(texts[j], -this.ctx.measureText(texts[j]).width / 2, j * line_height);
                    }
                }
            } else if (text.indexOf("M") == -1 && text.length > 6) {
                text = text.substring(0, 6) + "||" + text.substring(6);
                var texts = text.split("||");
                for (var j = 0; j < texts.length; j++) {
                    this.ctx.fillText(texts[j], -this.ctx.measureText(texts[j]).width / 2, j * line_height);
                }
            } else {
                this.ctx.fillText(text, -this.ctx.measureText(text).width / 2, 0);
            }
            //添加对应图标
            if (text.indexOf("闪币") > 0) {
                var img = document.getElementById("shan-img");
                this.ctx.drawImage(img, -15, 10);
            } else if (text.indexOf("谢谢参与") >= 0) {
                var img = document.getElementById("sorry-img");
                this.ctx.drawImage(img, -15, 10);
            }
            this.ctx.restore();
        }
    },
    rotateFn: function (item, txt, fn) {
        cancelAnimationFrame(this.aniFrame);
        var angles = item * (360 / this.restaraunts.length) - (360 / (this.restaraunts.length * 2));
        if (angles < 270) {
            angles = 270 - angles;
        } else {
            angles = 360 - angles + 270;
        }
        var rotateAngle = 2160 * 6 + angles;
        var that = this;
        (function () {
            stats.begin();
            that.aniFrame = requestAnimationFrame(arguments.callee);
            angles += Math.ceil((rotateAngle - angles) * .01);
            that.canvas.style.transform = 'rotate(' + angles + 'deg)';
            if (angles >= rotateAngle) {
                cancelAnimationFrame(that.aniFrame);
                that.canvas.style.transform = 'rotate(' + rotateAngle + 'deg)';
                if (fn && (typeof fn == 'function')) fn(item, txt);
            }
            stats.end();
        })();
    },
    rotate: function (item, fn) {
        if (this.bRotate) return;
        this.bRotate = !this.bRotate;
        var item =  item || this.rnd(1, this.restaraunts.length);
        this.rotateFn(item, this.restaraunts[item - 1], fn);
    },
    rnd: function (n, m) {
        var random = Math.floor(Math.random() * (m - n + 1) + n);
        return random;
    }
}
// 提示信息
var oTipBox = {
    init: function () {
        this.tipBox = document.getElementsByClassName('tipbox')[0];
        this.shade = document.getElementsByClassName('shade')[0];
        this.ok = this.tipBox.getElementsByClassName('ok')[0];
        this.width = this.tipBox.offsetWidth;
        this.height = this.tipBox.offsetHeight;
        this.ok.addEventListener('click', this.hide.bind(this), false);
    },
    show: function (index, text) {
        var winWidth = window.innerWidth;
        var winHeight = window.innerHeight;
        var p = this.tipBox.getElementsByTagName('p')[0];
        var span = this.tipBox.getElementsByTagName('span')[0];
        this.tipBox.style.top = (winHeight - this.height) / 2 + 'px';
        this.tipBox.style.left = (winWidth - this.width) / 2 + 'px';
        this.shade.style.top = 0;
        p.textContent = text;
        if (index == 3) {
            span.classList.add('no');
        } else {
            span.classList.remove('no');
        }
        this.tipBox.classList.add('fadeIn');
        this.shade.classList.add('fadeIn');
    },
    hide: function () {
        this.tipBox.classList.remove('fadeIn');
        this.shade.classList.remove('fadeIn');
        var that = this;
        setTimeout(function () {
            that.shade.style.top = '5000px';
        }, 200)
    }
}
window.onload = window.onresize = turnplate.init.bind(turnplate);
document.addEventListener('DOMContentLoaded', function () {
    oTipBox.init();
    window.stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);
}, false);