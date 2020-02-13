'use strict' 
 
 const main = function(){
    let canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    w = canvas.width = innerWidth,
    h = canvas.height = innerHeight,
    particles = [],
    properties = {
        bgColor: 'rgba(17, 17, 19, 1)',
        particleColor: 'rgba(255, 40, 40, 1)',
        particleRadius: 3,
        particleCount: 60,
        particleMaxVelocity: 1,
        lineLength: 200,
        particleLife: 6,
    };

    document.querySelector('body').appendChild(canvas);

    window.onresize = function(){
        w = canvas.width = innerWidth,
        h = canvas.height = innerHeight;        
    }

    const draw = (fn, beforebegin, afterBegin) => {
        if(!(fn instanceof Function)) 
            return new Error('fn is not a function')
        if(beforebegin && beforebegin instanceof Function) 
            beforebegin()
        ctx.beginPath()
        fn()
        ctx.closePath()
        if(afterBegin && afterBegin instanceof Function)
            afterBegin()
    }

    function Particle(){
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.velocityX = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity;
        this.velocityY = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity;
        this.life = Math.random() * properties.particleLife * 60;
    }

    Particle.prototype.position = function() {
        this.x + this.velocityX > w && this.velocityX > 0 || this.x + this.velocityX < 0 && this.velocityX < 0? this.velocityX *= -1 : this.velocityX;
        this.y + this.velocityY > h && this.velocityY > 0 || this.y + this.velocityY < 0 && this.velocityY < 0? this.velocityY *= -1 : this.velocityY;
        this.x += this.velocityX;
        this.y += this.velocityY;
    }

    Particle.prototype.reDraw = function() {
        draw(() => {
            ctx.arc(this.x, this.y, properties.particleRadius, 0, Math.PI * 2);
        }, 
        null, 
        () => {
            ctx.fillStyle = properties.particleColor
            ctx.fill()
        })
        
    }    

    Particle.prototype.reCalculateLife = function() {
        if(this.life < 1){
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.velocityX = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity;
            this.velocityY = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity;
            this.life = Math.random() * properties.particleLife * 60;
        }
        this.life--;
    }

    const reDrawBackground = () => {
        ctx.fillStyle = properties.bgColor;
        ctx.fillRect(0, 0, w, h);
    }

    const drawLines = () => {
        let x1, y1, x2, y2, length, opacity;
        for(let particle_i of particles){
            for(let particle_j of particles.filter(x => x != particle_i)){
                x1 = particle_i.x;
                y1 = particle_i.y;
                x2 = particle_j.x;
                y2 = particle_j.y;
                length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                if(length < properties.lineLength) {
                    opacity = 1 - length / properties.lineLength;
                    draw(() => {
                        ctx.moveTo(x1, y1)
                        ctx.lineTo(x2, y2)
                    },
                    () => {
                        ctx.lineWidth = '0.5';
                        ctx.strokeStyle = `rgba(255, 40, 40, ${opacity})`;
                    },
                    () => ctx.stroke())
                }
            }
        }
    }

    const reDrawParticles = () => {
        for(let particle of particles){
            particle.reCalculateLife();
            particle.position();
            particle.reDraw();
        }
    }

    const loop = () => {
        reDrawBackground();
        reDrawParticles();
        drawLines();
        requestAnimationFrame(loop);
    }

    (() => {
        for(var i = 0 ; i < properties.particleCount ; i++){
            particles.push(new Particle());
        }
        loop();
    })()
}

main()