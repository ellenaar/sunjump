var game = new Phaser.Game(500, 400, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('level', 'sunjumpers.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('playerRight', 'characte_right.png');
    game.load.image('playerLeft', 'character_left.png');
    game.load.image('background', 'http://www.planwallpaper.com/static/images/cool-background.jpg')

}

var p;
var map;
var layer;
var bg;
var cursors;

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#787878';
    
    bg = game.add.tileSprite(0, 0, 800, 600,('background'));
    p = game.add.sprite(40, 200, 'playerRight');
    bg.fixedToCamera = true;
    
    //  Un-comment this on to see the collision tiles
    // layer.debug = true;
    
    //map = game.add.tilemap('level');
    //map.addTilesetImage('playerLeft');
    //map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);
    
    //layer = map.createLayer('Tile Layer 1');
    //layer.resizeWorld();
    
    game.physics.enable(p, Phaser.Physics.ARCADE);

    game.physics.arcade.gravity.y = 250;

    p.body.bounce.y = 0.2;
    p.body.linearDamping = 1;
    p.body.collideWorldBounds = true;
    
    game.camera.follow(p);
    cursors = game.input.keyboard.createCursorKeys();
}

function update() {
    
    //game.physics.arcade.collide(player, layer);

    p.body.velocity.x = 0;
        if (p.body.onFloor())
        {
            p.body.velocity.y = -200;
        }

    if (cursors.left.isDown)
    {
        p.body.velocity.x = -150;
        p.loadTexture('playerLeft', 0, false);
    }
    else if (cursors.right.isDown)
    {
        p.body.velocity.x = 150;
        p.loadTexture('playerRight', 0, false);
    }

}

function render() {
    
}