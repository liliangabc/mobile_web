var turnplate = {
    init: function () {
        this.restaraunts = ["50M免费流量包", "10闪币", "谢谢参与", "5闪币", "10M免费流量包", "20M免费流量包", "20闪币 ", "30M免费流量包"];
        this.parent=document.getElementsByClassName('turnplate')[0];
        this.canvas = document.getElementById('wheelcanvas');
        this.pointer = this.parent.getElementsByClassName('pointer')[0];
        this.ctx = this.canvas.getContext("2d");
        this.cW = this.canvas.width// = window.innerWidth * .9;
        this.cH = this.canvas.height //= window.innerHeight * .9;
        // this.outsideRadius = this.cW * .8;
        // this.textRadius = this.outsideRadius * .8;
        // this.insideRadius = this.textRadius * .4;
        this.outsideRadius = 192;
        this.textRadius = 155;
        this.insideRadius = 68;
        this.startAngle = 0;
        this.bRotate = false;
        this.draw();
        var that = this;
        this.pointer.addEventListener('click', function () {
            that.rotate(null, oTipBox.show);
        }, false);
    },
    draw: function () {
        //根据奖品个数计算圆周角度
        var arc = Math.PI / (this.restaraunts.length / 2);
        this.ctx.clearRect(0, 0, this.cW, this.cH);
        this.ctx.strokeStyle = "#FFBE04";
        this.ctx.font = '16px Microsoft YaHei';
        var that=this;
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
                    this.ctx.font = j == 0 ? 'bold 20px Microsoft YaHei' : '16px Microsoft YaHei';
                    if (j == 0) {
                        this.ctx.fillText(texts[j] + "M", -this.ctx.measureText(texts[j] + "M").width / 2, j * line_height);
                    } else {
                        this.ctx.fillText(texts[j], -this.ctx.measureText(texts[j]).width / 2, j * line_height);
                    }
                }
            } else if (text.indexOf("M") == -1 && text.length > 6) { //奖品名称长度超过一定范围 
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
                img.onload = function () {
                    that.ctx.drawImage(img, -15, 10);
                };
                this.ctx.drawImage(img, -15, 10);
            } else if (text.indexOf("谢谢参与") >= 0) {
                var img = document.getElementById("sorry-img");
                img.onload = function () {
                    that.ctx.drawImage(img, -15, 10);
                };
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
            angles += (rotateAngle - angles) * .01 + .8;
            that.canvas.style.transform = 'rotate(' + angles + 'deg)';
            if (angles >= rotateAngle) {
                cancelAnimationFrame(that.aniFrame);
                that.canvas.style.transform = 'rotate(' + rotateAngle + 'deg)';
                if (fn && (typeof fn == 'function')) oTipBox.show(item, txt);
            }
            stats.end();
        })();
    },
    rotate: function (item,fn) {
        if (this.bRotate) return;
        this.bRotate = !this.bRotate;
        var item = item || rnd(1, this.restaraunts.length);
        this.rotateFn(item, this.restaraunts[item - 1],fn);
    }
}
window.onload = turnplate.init.bind(turnplate);
document.addEventListener('DOMContentLoaded', function () {
    window.stats = new Stats();
    stats.showPanel(2);
    document.body.appendChild(stats.dom);
    document.querySelector('.tipbox .ok').addEventListener('click', function () {
        oTipBox.hide();
    }, false);
}, false);

function rnd(n, m) {
    var random = Math.floor(Math.random() * (m - n + 1) + n);
    return random;
}
// 提示信息
var oTipBox = {
    show: function (index, text) {
        var winWidth = window.innerWidth;
        var winHeight = window.innerHeight;
        var tipBox = document.getElementsByClassName('tipbox')[0];
        var shade = document.getElementsByClassName('shade')[0];
        var p = tipBox.getElementsByTagName('p')[0];
        var span = tipBox.getElementsByTagName('span')[0];
        var thisWidth = tipBox.offsetWidth;
        var thisHeight = tipBox.offsetHeight;
        tipBox.style.top = (winHeight - thisHeight) / 2 + 'px';
        tipBox.style.left = (winWidth - thisWidth) / 2 + 'px';
        shade.style.top = 0;
        p.textContent = text;
        if (index == 3) {
            span.classList.add('no');
        } else {
            span.classList.remove('no');
        }
        tipBox.classList.add('fadeIn');
        shade.classList.add('fadeIn');
    },
    hide: function () {
        var tipBox = document.getElementsByClassName('tipbox')[0];
        var shade = document.getElementsByClassName('shade')[0];
        tipBox.classList.remove('fadeIn');
        shade.classList.remove('fadeIn');
        setTimeout(function(){
            shade.style.top = '5000px';
        },200)
    }
}