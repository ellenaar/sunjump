var Info = function() {};

Info.prototype = {
    
    preload: function() {
        this.load.image('background', 'Pictures/Sunrise-clipart-2.jpg');
    },
    
    init: function () {
        this.titleText = game.make.text(game.world.centerX, 80, " Info ", {
          font: 'bold 40pt TheMinion',
          fill: '#76EE00',
          align: 'center'
        });
        this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
        this.titleText.anchor.set(0.5);
        this.optionCount = 1;
        
        this.instruText = game.make.text(game.world.centerX, 250, " You are a lobbyist. Jump on solar panels to reach the decision makers. Watch out for bad soil that has been ruined by peat overuse. \n Press P to pause the game. \n Press M to switch on/off the music. ", {
          font: '16pt TheMinion',
          fill: '#00000',
            align: 'center',
            wordWrap: true,
            wordWrapWidth: 250
            
        });
        this.instruText.anchor.set(0.5);
        
        this.playLabel = game.make.text(game.world.centerX, 420, " Menu ", { 
        font: '50px Arial', 
        fill: '#76EE00',
        align: 'center'});
        this.playLabel.setShadow(2, 2, 'rgba(0,0,0,0.7)', 5);
        this.playLabel.anchor.set(0.5);
    },
    
    create: function () {
        game.stage.disableVisibilityChange = true;
        game.add.sprite(0, 0, 'background');
        game.add.existing(this.titleText);
        game.add.existing(this.instruText);
        var text = game.add.existing(this.playLabel);

      // game.input.onDown.add(start, self);
     // game.input.activePointer.isDown.add(start, self);
        // .addKey(Phaser.Keyboard.UP).onDown.add(start, self);
      text.inputEnabled = true;
      text.events.onInputOver.add(over, this);
      text.events.onInputOut.add(out, this);
      text.events.onInputDown.add(start, self);
      
      function start(event){
          game.state.start('Menu');
      }
      
      function over(item){
          item.alpha=.5;
      }
      
      function out(item){
          item.alpha=1;
      }
      
    
  }
};
