var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var fruits;
var policiers;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;

var game = new Phaser.Game(config);
    

function preload ()
{
    this.load.image('sky', 'assets/background1.png');
    this.load.image('ground', 'assets/platform.png', { frameWidth: 200, frameHeight: 32 });
    this.load.image('fruit', 'assets/red_ball.png');
    this.load.image('policier', 'assets/policier.png');
    this.load.spritesheet('brave', 'assets/brave.png', { frameWidth: 32, frameHeight: 48 });
}

function create ()
{
    //  Ajout de l'image de fond du jeu
    this.add.image(400, 300, 'sky');

    
    platforms = this.physics.add.staticGroup();

    
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground').setScale(1.5).refreshBody();
        platforms.create(750, 220, 'ground');
        platforms.create(30, 150, 'ground');

    
    player = this.physics.add.sprite(100, 450, 'brave');

    
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('brave', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'brave', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('brave', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    
    cursors = this.input.keyboard.createCursorKeys();

    
    fruits = this.physics.add.group({
        key: 'fruit',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    fruits.children.iterate(function (child) {

        
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    policiers = this.physics.add.group();

   
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(fruits, platforms);
    this.physics.add.collider(policiers, platforms);

    
    this.physics.add.overlap(player, fruits, collectFruit, null, this);

    this.physics.add.collider(player, policiers, hitPolicier, null, this);
}

function update ()
{
    if (gameOver)
    {
        return;
    }

    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-335);
    }
}

function collectFruit (player, fruit)
{
    fruit.disableBody(true, true);

    
    score += 10;
    scoreText.setText('Score: ' + score);

    if (fruits.countActive(true) === 0)
    {
        
        fruits.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var policier = policiers.create(x, 16, 'policier').setTint(0xff0000);
        policier.setBounce(1);
        policier.setCollideWorldBounds(true);
        policier.setVelocity(Phaser.Math.Between(-200, 200), 20);
        policier.allowGravity = false;

    }
}

function hitPolicier (player, policier)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
    gameOverText = alert('Game Over. Votre score est: ' + score)
    ;
    
}
