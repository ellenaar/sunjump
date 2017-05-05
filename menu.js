var GameMenu = function() {};

GameMenu.prototype = {
    
  menuConfig: {
    startY: 260,
    startX: 30
  },
    
    preload: function() {
        this.load.image('background', 'Sunrise-clipart-2.jpg');
    },

  init: function () {
    this.titleText = game.make.text(game.world.centerX, 100, " Sun Jump ", {
      font: 'bold 40pt TheMinion',
      fill: '#76EE00',
      align: 'center'
    });
    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);
    this.optionCount = 1;
      
    this.playLabel = game.make.text(game.world.centerX, game.world.centerY, " PLAY ", { 
        font: '50px Arial', 
        fill: '#76EE00',
        align: 'center'});
    this.playLabel.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.playLabel.anchor.set(0.5);
    },

  create: function () {

    game.stage.disableVisibilityChange = true;
    game.add.sprite(0, 0, 'background');
    game.add.existing(this.titleText);
    var text = game.add.existing(this.playLabel);
    
      // game.input.onDown.add(start, self);
     // game.input.activePointer.isDown.add(start, self);
        // .addKey(Phaser.Keyboard.UP).onDown.add(start, self);
      text.inputEnabled = true;
      text.events.onInputOver.add(over, this);
      text.events.onInputOut.add(out, this);
      text.events.onInputDown.add(start, self);
      
      function start(event){
          game.state.start('Play');
      }
      
      function over(item){
          item.alpha=.5;
      }
      
      function out(item){
          item.alpha=1;
      }
      
    
  }
};

//Phaser.Utils.mixinPrototype(GameMenu.prototype, mixins);