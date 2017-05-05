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
    this.titleText = game.make.text(game.world.centerX, 100, "Sun Jump", {
      font: 'bold 40pt TheMinion',
      fill: '#000000',
      align: 'center'
    });
    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);
    this.optionCount = 1;
  },

  create: function () {

    game.stage.disableVisibilityChange = true;
    game.add.sprite(0, 0, 'background');
    game.add.existing(this.titleText);
    
      game.input.onDown.add(start, self);
      
      function start(event){
          game.state.start('Play');
      }
          //    this.addMenuOption('Start', function () {
//      game.state.start('Play');
//    });
  }
};

//Phaser.Utils.mixinPrototype(GameMenu.prototype, mixins);