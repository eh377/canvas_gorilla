class App {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);

        this.input = document.createElement('input');
        this.input.type = 'text';
        document.body.appendChild(this.input);

        window.addEventListener('resize', this.resize.bind(this), false);
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;
        this.text = new Text(this.stageWidth, this.stageHeight, this.ctx, this.input); 
        this.resize();
        requestAnimationFrame(this.animate.bind(this));
    }

    resize() {
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;

        this.canvas.width = this.stageWidth;
        this.canvas.height = this.stageHeight;
        this.text.reset(this.stageWidth, this.stageHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.text.draw();
    }
}

class Text {
    constructor(stageWidth, stageHeight, ctx, input) {
        this.text = "💩"

        this.pointNumber = 30000;

        input.value = '';

        this.ctx = ctx;
        this.pointRadius = 3;
        this.clickRadius = 100;
        this.input = input;

        document.addEventListener('click', this.click.bind(this));
        document.addEventListener('keyup', this.enter.bind(this));
    }

    reset(stageWidth, stageHeight) {
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
        this.point = [];
        for (let i = 0; i < this.pointNumber; i ++) this.point.push(new Point(stageWidth, stageHeight));
        
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.font = this.stageHeight / 2 + 'px 궁서체';
        this.ctx.fillStyle = 'blue'
        this.ctx.fillText(this.text, this.stageWidth / 2, this.stageHeight / 2);
        this.imageData = this.ctx.getImageData(0, 0, this.stageWidth, this.stageHeight).data;
        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
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

    enter(e) {
        if (e.keyCode == 13) {
            this.text = this.input.value;
            for (let i = 0; i < this.point.length; i ++) {
                this.point[i].color = 'black';
            }
            this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
            this.ctx.fillStyle = 'blue'
            this.ctx.fillText(this.text, this.stageWidth / 2, this.stageHeight / 2);
            this.imageData = this.ctx.getImageData(0, 0, this.stageWidth, this.stageHeight).data;
            this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
            this.input.value = '';
        }
    }

    isColideText(i) {
        this.index = this.point[i].x + this.point[i].y * this.stageWidth;
        if (!(this.imageData[this.index * 4] == 0 && this.imageData[this.index * 4 + 1] == 0 && this.imageData[this.index * 4 + 2] == 0)) return 1;
        return 0
    }
}

class Point {
    constructor(stageWidth, stageHeight) {
        this.x = Math.floor(Math.random() * (stageWidth));
        this.y = Math.floor(Math.random() * (stageHeight));
        this.color = 'black';
    }
}

new App();