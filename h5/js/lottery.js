var obj = {
    init: function () {
        this.list=[
            '一等奖','二等奖','三等奖','四等奖','五等奖','六等奖','七等奖','谢谢参与'
        ];
        this.parent=document.getElementsByClassName('myframe')[0];
        this.turntable = document.getElementById('mainCanvas');
        this.arrow = document.getElementById('arrow');
        var w=window.innerWidth*.8;
        this.parent.style.height=this.parent.style.width=w+'px';
        this.turnContext = this.turntable.getContext('2d');
        this.arrowContext = this.arrow.getContext('2d');
        this.turntable.height = this.turntable.width = w;
        this.arrow.height=this.arrow.width=w/8;
        this.arrow.style.top=this.arrow.style.left=(w-this.arrow.width)/2+'px';
        this.centerY =this.centerX = w / 2;
        this.drawTurntable();
        this.drawArrow();
        var that=this;
        this.arrow.addEventListener('click',function(){
            that.rotate(that.list,3);
        },false);
    },
    drawTurntable: function () {
        var len=this.list.length;
        var angle = 2 * Math.PI / len;
        this.turnContext.save();
        this.turnContext.translate(this.centerX, this.centerY);
        for (var i = 0; i < len; i++) {
            this.turnContext.fillStyle = (i % 2) ? '#cccccc' : '#666666';
            this.turnContext.beginPath();
            this.turnContext.moveTo(0,0);
            this.turnContext.arc(0, 0, this.centerX, 0, angle, false);
            this.turnContext.lineTo(0,0);
            this.turnContext.fill();
            this.turnContext.rotate(angle);
        }
        this.turnContext.restore();
    },
    drawArrow:function(){
        this.arrowContext.save();
        this.arrowContext.translate(this.arrow.width/2,this.arrow.height/2);
        this.arrowContext.fillStyle='#ff0000';
        this.arrowContext.beginPath();
        this.arrowContext.arc(0,0,this.arrow.width/2,0,2*Math.PI,false);
        this.arrowContext.fill();
        this.arrowContext.restore();
    },
    rotate:function(list,index){
        cancelAnimationFrame(this.aniFrame);
        var rotateAngle=2160+360/(index)+360/list.length*2;
        var startAngle=0,step=30;
        var that=this;
        (function(){
            that.aniFrame=requestAnimationFrame(arguments.callee);
            startAngle+=step;
            that.turntable.style.transform='rotate('+startAngle+'deg)';
            if(startAngle>=rotateAngle){
                cancelAnimationFrame(that.aniFrame);
            }
        })();
    }
}
document.addEventListener('DOMContentLoaded', obj.init.bind(obj), false);