class App {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);

        window.addEventListener('resize', this.resize.bind(this), false);
        this.resize();

        requestAnimationFrame(this.animate.bind(this));
    }

    resize() {
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;

        this.canvas.width = this.stageWidth;
        this.canvas.height = this.stageHeight;
        this.text = new Text(this.stageWidth, this.stageHeight, this.ctx); 
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.text.draw();
    }
}

class Text {
    constructor(stageWidth, stageHeight, ctx) {
        this.pointNumber = 20000;
        this.point = [];
        for (let i = 0; i < this.pointNumber; i ++) this.point.push(new Point(stageWidth, stageHeight));
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = stageHeight / 2 + 'px 궁서체';
        ctx.fillStyle = 'blue'
        ctx.fillText('갓🦍지', stageWidth / 2, stageHeight / 2);
        this.imageData = ctx.getImageData(0, 0, stageWidth, stageHeight).data;
        ctx.clearRect(0, 0, stageWidth, stageHeight);

        this.ctx = ctx;
        this.pointRadius = 3;
        this.clickRadius = 100;
        this.stageWidth = stageWidth;

        document.addEventListener('click', this.click.bind(this));
    }

    draw() {
        for (let i = 0; i < this.point.length; i ++) {
            this.ctx.beginPath();
            this.ctx.arc(this.point[i].x, this.point[i].y, this.pointRadius, 0, 2 * Math.PI);
            this.ctx.fillStyle = this.point[i].color;
            this.ctx.fill();
        }

    }

    click(e) {
        for (let i = 0; i < this.point.length; i ++) {
            if (this.clickRadius >= Math.sqrt(Math.pow(this.point[i].x - e.clientX, 2) + Math.pow(this.point[i].y - e.clientY, 2))) {
                if (this.isColideText(i)) {
                    this.point[i].color = 'blue';
                } else {
                    this.point[i].color = 'red';
                }
            }
        }
    }

    isColideText(i) {
        this.index = this.point[i].x + this.point[i].y * this.stageWidth;
        console.log(this.index)
        if (!(this.imageData[this.index * 4] == 0 && this.imageData[this.index * 4 + 1] == 0 && this.imageData[this.index * 4 + 2] == 0)) return 1;
        return 0
    }
}

class Point {
    constructor(stageWidth, stageHeight) {
        this.x = Math.floor(Math.random() * (stageWidth + 1));
        this.y = Math.floor(Math.random() * (stageHeight + 1));
        this.color = 'black';
    }
}

new App();