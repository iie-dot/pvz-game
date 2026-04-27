var container = document.getElementById('container')

function createPlant(type, onclick) {
    var plant = document.createElement('img')
    plant.type = type
    plant.attack = []
    if (type == 1) {
        plant.src = 'images/Peashooter.gif'
        plant.blood = 500
    }
    else if (type == 2) {
        plant.src = 'images/SnowPea.gif'
        plant.blood = 500
    }
    else if (type == 3) {
        plant.src = 'images/Repeater.gif'
        plant.blood = 500
    }
    else if (type == 4) {
        plant.src = 'images/SunFlower.gif'
        plant.blood = 300
    }
    else if (type == 5) {
        plant.src = 'images/TallNut.gif'
        plant.blood = 400
        plant.maxBlood = 400
    }
    else if (type == 6) {
        plant.src = 'images/Jalapeno.gif'
        plant.blood = 999
    }
    plant.style.position = 'absolute'
    document.oncontextmenu = function (e) {
        e.preventDefault()
    }
    document.onmousemove = function (e) {
        plant.style.left = e.x - 40 + 'px'
        plant.style.top = e.y - 40 + 'px'
    }
    document.onmousedown = function (e) {
        document.onmousemove = null
        document.onmousedown = null
        if (e.button == 2) {
            container.removeChild(plant)
        } else if (e.button == 0) {
            var top = plant.offsetTop;
            if (top < 0 || top > 495) {
                container.removeChild(plant)
                return
            }
            if (top >= 0 && top <= 95) {
                plant.style.top = '90px';
                plant.route = 0;
            } else if (top > 95 && top <= 195) {
                plant.style.top = '190px';
                plant.route = 1;
            } else if (top > 195 && top <= 295) {
                plant.style.top = '290px';
                plant.route = 2;
            } else if (top > 295 && top <= 395) {
                plant.style.top = '390px';
                plant.route = 3;
            } else if (top > 395 && top <= 495) {
                plant.style.top = '490px';
                plant.route = 4;
            }
            
            // 高坚果特殊处理：向上偏移（修复：用 plant.type 而不是 type）
            if (plant.type == 5) {
                plant.style.top = (parseInt(plant.style.top) - 20) + 'px'
            }
            
            onclick(plant)
        }
    }
    container.appendChild(plant)
    return plant
}

function createBullet(plant, disappear) {
    var bullet = document.createElement('img')
    bullet.type = plant.type
    bullet.route = plant.route
    if ([1, 3].indexOf(bullet.type) != -1) {
        bullet.src = 'images/Bullet.gif'
    }
    else if (bullet.type == 2) {
        bullet.src = 'images/SnowBullet.gif'
    }
    bullet.style.position = 'absolute'
    bullet.style.left = plant.offsetLeft + 30 + 'px'
    bullet.style.top = plant.offsetTop + 'px'
    bullet.step = function () {
        if (bullet.src.endsWith('Bullet.gif') && bullet.offsetLeft < 1000) {
            bullet.style.left = bullet.offsetLeft + 4 + 'px'
        } else {
            disappear(bullet)
        }
    }
    container.appendChild(bullet)
    return bullet
}

function createZombie(id, gameover) {
    var zombie = document.createElement('img')
    zombie.id = id
    zombie.status = parseInt(Math.random() * 6)
    if ([0, 1, 2].indexOf(zombie.status) != -1) {
        zombie.src = 'images/Zombie.gif'
        zombie.blood = 9
    }
    else if (zombie.status == 5) {
        zombie.src = 'images/BucketheadZombie.gif'
        zombie.blood = 40
    }
    else {
        zombie.src = 'images/ConeheadZombie.gif'
        zombie.blood = 29
    }

    zombie.style.position = 'absolute'
    zombie.route = parseInt(Math.random() * 5)
    zombie.style.top = [30, 130, 230, 330, 430][zombie.route] + 'px'
    zombie.style.left = '900px'
    zombie.counter = 0
    zombie.speed = 5
    zombie.step = function () {
        zombie.counter++
        if (zombie.counter < zombie.speed) {
            return
        }
        zombie.counter = 0
        if (zombie.src.endsWith('Zombie.gif') && zombie.offsetLeft > -200) {
            zombie.style.left = zombie.offsetLeft - 1 + 'px'
        } if (zombie.offsetLeft < -150) {
            gameover()
        }
    }
    container.appendChild(zombie)
    return zombie
}

function createHead(zombie) {
    var head = document.createElement('img')
    head.src = 'images/ZombieHead.gif'
    head.style.position = 'absolute'
    head.style.left = zombie.offsetLeft + 50 + 'px'
    head.style.top = zombie.offsetTop + 'px'
    container.appendChild(head)
    return head
}

function createSun(plant) {
    var sun = document.createElement('img')
    sun.src = 'images/Sun.png'
    sun.style.position = 'absolute'
    sun.style.left = plant.offsetLeft + 'px'
    sun.style.top = plant.offsetTop - 10 + 'px'
    sun.style.width = '50px'
    sun.style.height = '50px'
    sun.style.cursor = 'pointer'
    sun.style.zIndex = '10'

    var targetTop = plant.offsetTop + 60
    var currentTop = plant.offsetTop - 10
    var fallSpeed = 1

    sun.fallInterval = setInterval(function () {
        if (currentTop < targetTop) {
            currentTop += fallSpeed
            sun.style.top = currentTop + 'px'
        } else {
            clearInterval(sun.fallInterval)
        }
    }, 20)

    sun.onclick = function () {
        if (sun.fallInterval) {
            clearInterval(sun.fallInterval)
        }
        container.removeChild(sun)
        if (typeof addSun === 'function') {
            addSun(25)
        }
    }

    setTimeout(() => {
        if (sun.parentNode) {
            if (sun.fallInterval) {
                clearInterval(sun.fallInterval)
            }
            container.removeChild(sun)
        }
    }, 10000)

    container.appendChild(sun)
    return sun
}
