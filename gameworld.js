var Jumper = function() {};
Jumper.Play = function() {};
var w = 300, h = 500;

Jumper.Play.prototype = {

  preload: function() {
    this.load.image( 'playerRight', 'rsz_character_right.png' );
    this.load.image( 'playerLeft', 'rsz_character_left.png' );
    this.load.image( 'panel', 'rsz_170-solar-panel-hz.png' );
    this.load.image( 'peat', 'rsz_maantiede_energia_shutterstock_88741837_peda.png')
    this.load.image('background', 'http://clipartix.com/wp-content/uploads/2016/08/Sunrise-clipart-2.jpg');
    game.load.image('menu', 'number-buttons-90x90.png', 270, 180);
    
  },
    
  create: function() {
    // background picture
    var bg = game.add.tileSprite(0, 0, 300, 600,('background'));
    bg.fixedToCamera = true;
    
      // scaling
//    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
//    this.scale.maxWidth = this.game.width;
//    this.scale.maxHeight = this.game.height;
//    this.scale.pageAlignHorizontally = true;
//    this.scale.pageAlignVertically = true;

    // physics
    this.physics.startSystem( Phaser.Physics.ARCADE );

    // camera and platform tracking vars
    this.cameraYMin = 99999;
    this.platformYMin = 99999;

    // create platforms
    this.platformsCreate();

    // create hero
    this.heroCreate();

    // cursor controls
    this.cursor = this.input.keyboard.createCursorKeys();
      
       /*
        Code for the pause menu
    */

    
      
    // Create a label to use as a button
    pause_label = game.add.text(7, 0, 'Pause', { font: '24px Arial', fill: '#000', backgroundColor: "#fff" });
    pause_label.fixedToCamera = true;
    pause_label.inputEnabled = true;
    pause_label.events.onInputUp.add(function () {
        // When the paus button is pressed, we pause the game
        game.paused = true;
        
        // Then add the menu
        menu = game.add.sprite(w/2, h/2, 'menu');
        menu.fixedToCamera = true;
        menu.anchor.setTo(0.5, 0.5);

        // And a label to illustrate which menu item was chosen. (This is not necessary)
        choiseLabel = game.add.text(w/2, h-150, 'Click outside menu to continue', { font: '15px Arial', fill: '#fff' });
        choiseLabel.fixedToCamera = true;
        choiseLabel.anchor.setTo(0.5, 0.5);
    });

    // Add a input listener that can help us return from being paused
    game.input.onDown.add(unpause, self);

    // And finally the method that handels the pause menu
    function unpause(event){
        // Only act if paused
        if(game.paused){
            // Calculate the corners of the menu
            var x1 = w/2 - 270/2, x2 = w/2 + 270/2,
                y1 = h/2 - 180/2, y2 = h/2 + 180/2;

            // Check if the click was inside the menu
            if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ){
                // The choicemap is an array that will help us see which item was clicked
                var choisemap = ['one', 'two', 'three', 'four', 'five', 'six'];

                // Get menu local coordinates for the click
                var x = event.x - x1,
                    y = event.y - y1;

                // Calculate the choice 
                var choise = Math.floor(x / 90) + 3*Math.floor(y / 90);

                // Display the choice
                choiseLabel.text = 'You chose menu item: ' + choisemap[choise];
            }
            else{
                // Remove the menu and the label
                menu.destroy();
                choiseLabel.destroy();

                // Unpause the game
                game.paused = false;
            }
        }
    };  
      
  },

  update: function() {
    // this is where the main magic happens
    // the y offset and the height of the world are adjusted
    // to match the highest point the hero has reached
    this.world.setBounds( 0, -this.hero.yChange, this.world.width, this.game.height + this.hero.yChange );
      
     
    // the built in camera follow methods won't work for our needs
    // this is a custom follow style that will not ever move down, it only moves up
    this.cameraYMin = Math.min( this.cameraYMin, this.hero.y - this.game.height + 130 );
    this.camera.y = this.cameraYMin;
    //update button pause, DOES NOT WORK
      
    
    // hero collisions and movement
    this.physics.arcade.collide( this.hero, this.platforms );
    this.heroMove();

    // for each plat form, find out which is the highest
    // if one goes below the camera view, then create a new one at a distance from the highest one
    // these are pooled so they are very performant
      
    this.platforms.forEachAlive( function( elem ) {
      this.platformYMin = Math.min( this.platformYMin, elem.y );
      if( elem.y > this.camera.y + this.game.height ) {
        elem.kill();
        this.platformsCreateOne( this.rnd.integerInRange( 0, this.world.width - 50 ), this.platformYMin - 100, 1 );
        this.fakesCreateOne( this.rnd.integerInRange( 0, this.world.width - 50 ), this.platformYMin - 100, 1 );
      }
    }, this );
  },

  shutdown: function() {
    // reset everything, or the world will be messed up
    this.world.setBounds( 0, 0, this.game.width, this.game.height );
    this.cursor = null;
    this.hero.destroy();
    this.hero = null;
    this.platforms.destroy();
    this.platforms = null;
  },

  platformsCreate: function() {
    // platform basic setup
    this.platforms = this.add.group();
    this.platforms.enableBody = true;
    this.platforms.createMultiple( 100, 'panel' );

    
    this.fakePlatforms = this.add.group();
    this.fakePlatforms.enableBody = true;
    this.fakePlatforms.createMultiple( 100, 'peat' );
    // create the base platform, with buffer on either side so that the hero doesn't fall through
    this.platformsCreateOne( -16, this.world.height - 16, this.world.width + 16 );
    // create a batch of platforms that start to move up the level
    for( var i = 0; i < 9; i++ ) {
      this.platformsCreateOne( this.rnd.integerInRange( 0, this.world.width - 50 ), this.world.height - 100 - 100 * i, 1 );
        this.fakesCreateOne( this.rnd.integerInRange( 0, this.world.width - 50 ), this.world.height - 100 - 100 * i, 1 );
    }
  },

  platformsCreateOne: function( x, y, width ) {
    // this is a helper function since writing all of this out can get verbose elsewhere
    var platform = this.platforms.getFirstDead();
    platform.reset( x, y );
    platform.scale.x = width;
    platform.scale.y = 1;
    platform.body.immovable = true;
    return platform;
  },
    
  fakesCreateOne: function( x, y, width ) {
    // this is a helper function since writing all of this out can get verbose elsewhere
    var fakePlatform = this.fakePlatforms.getFirstDead();
    fakePlatform.reset( x, y );
    fakePlatform.scale.x = width;
    fakePlatform.scale.y = 1;
    fakePlatform.body.immovable = true;
    return fakePlatform;
  },

  heroCreate: function() {
    // basic hero setup
    this.hero = game.add.sprite( this.world.centerX, this.world.height - 36, 'playerRight' );
    this.hero.anchor.set( 0.5 );
    
    // track where the hero started and how much the distance has changed from that point
    this.hero.yOrig = this.hero.y;
    this.hero.yChange = 0;

    // hero collision setup
    // disable all collisions except for down
    this.physics.arcade.enable( this.hero );
    this.hero.body.gravity.y = 500;
    this.hero.body.checkCollision.up = false;
    this.hero.body.checkCollision.left = false;
    this.hero.body.checkCollision.right = false;
  },

  heroMove: function() {
    // handle the left and right movement of the hero
    if( this.cursor.left.isDown ) {
      this.hero.body.velocity.x = -200
        this.hero.loadTexture('playerLeft', 0, false);
    } else if( this.cursor.right.isDown ) {
      this.hero.body.velocity.x = 200;
        this.hero.loadTexture('playerRight', 0, false);
    } else {
      this.hero.body.velocity.x = 0;
    }

    // handle hero jumping
    if(this.hero.body.touching.down ) {
      this.hero.body.velocity.y = -350;
    } 
    
    // wrap world coordinated so that you can warp from left to right and right to left
    this.world.wrap( this.hero, this.hero.width / 2, false );

    // track the maximum amount that the hero has travelled
    this.hero.yChange = Math.max( this.hero.yChange, Math.abs( this.hero.y - this.hero.yOrig ) );
 
    // if the hero falls below the camera view, gameover
    if( this.hero.y > this.cameraYMin + this.game.height && this.hero.alive ) {
      this.state.start( 'Play' );
    }
  }
}

var game = new Phaser.Game( 300, 500, Phaser.CANVAS, '' );
game.state.add( 'Play', Jumper.Play );
game.state.start( 'Play' );