var Jumper = function() {};
Jumper.Play = function() {};

Jumper.Play.prototype = {

  preload: function() {
    this.load.image( 'playerRight', 'Pictures/lobbari_right.png' );
    this.load.image( 'playerLeft', 'Pictures/lobbari_left.png' );
    this.load.image( 'panel', 'Pictures/rsz_170-solar-panel-hz.png' );
    this.load.image( 'peat', 'Pictures/tekstuuri.png')
    this.load.image('background', 'Pictures/Sunrise-clipart-2.jpg');
    this.load.image('spring', 'Pictures/boost.png');
    this.load.image('musicIcon', 'Pictures/nuottiavain1.png');
    this.load.image('shoe', 'Pictures/shoes.png');
    game.load.audio('music', 'Sounds/shooting-stars.mp3');
    this.load.audio('shoeSound', 'Sounds/aaniefekti.mp3');
  },

    
  create: function() {


    shoeSound = game.add.audio('shoeSound');

    // background picture
    var bg = game.add.tileSprite(0, 0, 300, 600,('background'));
    bg.fixedToCamera = true;
    
    music = game.add.audio('music');
    var IconSwitch = true;
    tester();

// A window for the Score 
// Updates the score in update: Function
    var scoreText
    text = this.game.add.text(0, 0,scoreText, { font: " 18px"});
    text.fixedToCamera = true;
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
    this.fakePlatformYMin= 99999;

    // create platforms
    this.platformsCreate();

    // create hero
    this.heroCreate();

    // cursor controls
    this.cursor = this.input.keyboard.createCursorKeys();
        
    // music Icon switches 
    var kuva = game.add.image(260, 25, 'musicIcon')
    kuva.inputEnabled = true;
    kuva.fixedToCamera = true;
    kuva.events.onInputDown.add(tester, self);
      
    var MusicButton;  
    MusicButton = game.input.keyboard.addKey(Phaser.Keyboard.M);
    MusicButton.onDown.add(tester, self);
    
    function tester(event){
        if(this.IconSwitch){
            musicOff();
        }else{
            musicOn();
        }   
    }  
    
      function musicOff(event){
          music.stop();
          this.IconSwitch = false;
      }
      
      function musicOn(event){
          music.play();
          this.IconSwitch = true; 
      }
      
       /*
        Code for the pause menu
    */
      var w = 300, h = 500;
    // Create a label to use as a button
    pause_label = game.add.text(229, 2, 'PAUSE', { 
        font: '20px TheMinion', 
        fill: '#76EE00'
    });
    pause_label.setShadow(2, 2, 'rgba(0,0,0,0.5)', 5);
    pause_label.fixedToCamera = true;
    pause_label.inputEnabled = true;
      
    pause_label.events.onInputOver.add(over, this);
    pause_label.events.onInputOut.add(out, this);
    var pauseButton;  
    var gameOn = true;
    pauseButton = game.input.keyboard.addKey(Phaser.Keyboard.P);
    pauseButton.onDown.add(pauseTest, self);
    pause_label.events.onInputUp.add(pauseTest, self);
    
      
    function pauseTest(event){
        if(this.gameOn){
            pauseFunction();
            this.gameOn = false;
        } else {
            unpause();
            this.gameOn = true;
        }
    }
      
    function over(item){
          item.alpha=.5;
      }
      
      function out(item){
          item.alpha=1;
      }
      
      
      function pauseFunction(event){
        // When the pause button is pressed, we pause the game
        game.paused = true;
    }

    // And finally the method that handels the pause menu
    function unpause(event){
        game.paused = false;
    }
      
  },


  update: function() {

    // Updates the score
    scoreText = Math.round(-1*this.camera.y);
    text.setText("Score: " + scoreText);
    // this is where the main magic happens
    // the y offset and the height of the world are adjusted
    // to match the highest point the hero has reached
    this.world.setBounds( 0, -this.hero.yChange, this.world.width, this.game.height + this.hero.yChange );
      
     
    // the built in camera follow methods won't work for our needs
    // this is a custom follow style that will not ever move down, it only moves up
    this.cameraYMin = Math.min( this.cameraYMin, this.hero.y - this.game.height + 130 );
    this.camera.y = this.cameraYMin;
    
    // hero collisions and movement
    this.physics.arcade.collide( this.hero, this.platforms );
    this.physics.arcade.collide( this.hero, this.springs );
    this.physics.arcade.collide(this.hero, this.shoes);
    this.heroMove();
    if(boostMultiplier == 2){
        this.cameraFlash();
    }

    // for each plat form, find out which is the highest
    // if one goes below the camera view, then create a new one at a distance from the highest one
    // these are pooled so they are very performant
    

    //width of the platforms decreases over time
    this.platforms.forEachAlive( function( elem ) {
      this.platformYMin = Math.min( this.platformYMin, elem.y );
      if( elem.y > this.camera.y + this.game.height ) {
            
        if (elem.scale.x>1){
            platFormDecreaser = 1
        } else{
            platFormDecreaser = elem.scale.x 
        }
        elem.kill();
        this.platformsCreateOne( this.rnd.integerInRange( 0, this.world.width - 50 ), this.platformYMin - 100, platFormDecreaser * 0.8  );
      }
    }, this );
    this.fakePlatforms.forEachAlive( function(elem2) {
        this.fakePlatformYMin = Math.min(this.fakePlatformYMin, elem2.y);
        if( elem2.y > this.camera.y + this.game.height ){
            elem2.kill();
            this.fakesCreateOne ( this.rnd.integerInRange( 0, this.world.width - 50), this.fakePlatformYMin - 100, 1);
        }
    }, this)

    
  },

  shutdown: function() {
    // reset everything, or the world will be messed up
    this.world.setBounds( 0, 0, this.game.width, this.game.height );
    this.cursor = null;
    this.hero.destroy();
    this.hero = null;
    this.platforms.destroy();
    this.platforms = null;
    music.stop();
  },

  platformsCreate: function() {
    // platform basic setup
    this.platforms = this.add.group();
    this.platforms.enableBody = true;
    this.platforms.createMultiple( 100, 'panel' );

    this.springs = this.add.group();
    this.springs.enableBody = true;
    this.springs.createMultiple( 20, 'spring' );  
      
    this.fakePlatforms = this.add.group();
    this.fakePlatforms.enableBody = true;
    this.fakePlatforms.createMultiple( 100, 'peat' );

    this.shoes = this.add.group();
    this.shoes.enableBody = true;
    this.shoes.createMultiple(20, 'shoe');
    // create the base platform, with buffer on either side so that the hero doesn't fall through
    this.platformsCreateOne( -16, this.world.height - 16, this.world.width + 16 );
    // create a batch of platforms that start to move up the level
    for( var i = 0; i < 15; i++ ) {
      this.platformsCreateOne( this.rnd.integerInRange( 0, this.world.width - 50 ), this.world.height - 50 - 50 * i, 1 );
    }
      for( var i = 0; i < 15; i++ ) {
      this.fakesCreateOne( this.rnd.integerInRange( 0, this.world.width - 50 ), this.world.height - 1000 - 100 - 100 * i, 1 );
        }
      for( var i = 0; i < 20; i++ ) {
      this.springsCreateOne( this.rnd.integerInRange( 0, this.world.width - 50 ), this.world.height - 1000 - 975 * i, 1 );
        }

        this.shoesCreateOne(this.rnd.integerInRange(0,this.world.width - 50), this.world.height/2 - 20 , 1);
    
    
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
    
  springsCreateOne: function( x, y, width ) {
    // this is a helper function since writing all of this out can get verbose elsewhere
    var spring = this.springs.getFirstDead();
    spring.reset( x, y );
    spring.scale.x = width;
    spring.scale.y = 1;
    spring.body.immovable = true;
    return spring;
  },

  shoesCreateOne: function(x,y){
    var shoe = this.shoes.getFirstDead();
    shoe.reset(x,y);
    shoe.scale.x = 1
    shoe.scale.y = 1
    shoe.body.immovable = true;
    return shoe;
  },



  heroCreate: function() {
    // basic hero setup
    this.hero = game.add.sprite( this.world.centerX, this.world.height - 46, 'playerRight' );
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

  shoeTurbo: function(){
    boostMultiplier = 1;
  },

  cameraFlash: function() {
    game.camera.flash(0xffff00,500);
  },

  heroMove: function() {

    if( this.cursor.left.isDown ) {
      this.hero.body.velocity.x = -200 * boostMultiplier;
        this.hero.loadTexture('playerLeft', 0, false)
    } else if( this.cursor.right.isDown ) {
      this.hero.body.velocity.x = 200 *boostMultiplier ;
        this.hero.loadTexture('playerRight', 0, false);
    } else {
      this.hero.body.velocity.x = 0;
    }
      
    if(this.physics.arcade.overlap(this.hero, this.shoes)){
        this.hero.body.velocity.y = -600;
        //game.time.events.add(Phaser.Timer.Second * 10, functionShoes, this);
        shoeSound.play();
        this.cameraFlash();
        boostMultiplier = 2;
        game.time.events.add(Phaser.Timer.SECOND * 6, this.shoeTurbo, this);

    }


      if(this.physics.arcade.collide( this.hero, this.springs )) {
       this.hero.body.velocity.y = -600;
    } else if(this.hero.body.touching.down && this.physics.arcade.collide( this.hero, this.platforms ) ) {
        this.hero.body.velocity.y = -350 * boostMultiplier;
    } else if(this.hero.body.touching.down && this.cameraYMin == 84) {
      this.hero.body.velocity.y = 0;
    } else if(this.hero.body.touching.down ){
        this.hero.body.velocity.y = -350 * boostMultiplier;
    }
    
    // wrap world coordinated so that you can warp from left to right and right to left
    this.world.wrap( this.hero, this.hero.width / 2, false );

    // track the maximum amount that the hero has travelled
    this.hero.yChange = Math.max( this.hero.yChange, Math.abs( this.hero.y - this.hero.yOrig ) );
 
    // if the hero falls below the camera view, gameover
    //Update highscore
    if( this.hero.y > this.cameraYMin + this.game.height && this.hero.alive ) {
        if(localStorage.getItem("Highscore") == String(NaN) || localStorage.getItem("Highscore") < scoreText){
            localStorage.setItem("Highscore", scoreText);
        } 
        this.shoeTurbo();
      this.state.start( 'Highscore' );
    }
  }
}

var boostMultiplier = 1;

var game = new Phaser.Game( 300, 500, Phaser.CANVAS, '' );
game.state.add( 'Play', Jumper.Play );
game.state.add('Highscore', Highscore)
game.state.add('Menu', GameMenu)
game.state.start('Menu')

//game.state.add('Menu', GameMenu)
//game.state.start('Menu')
//Phaser.Utils.mixinPrototype(GameMenu.prototype, mixins);
//game.state.start( 'Play' );