var Highscore = function() {};

WebFontConfig = {

    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Revalia']
    }

};

function createText(){
    text = game.add.text(game.world.centerX, 100, "Game Over\n ");
    text.anchor.setTo(0.5);

    text.font = 'Revalia';
    text.fontSize = 40;

    //  x0, y0 - x1, y1
    grd = text.context.createLinearGradient(0, 0, 0, text.canvas.height);
    grd.addColorStop(0, '#8ED6FF');   
    grd.addColorStop(1, '#004CB3');
    text.fill = grd;

    text.align = 'center';
    text.stroke = '#000000';
    text.strokeThickness = 2;
    text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

    text.inputEnabled = true;
    text.input.enableDrag();

    text.events.onInputOver.add(over, this);
    text.events.onInputOut.add(out, this);
};

function out() {

    text.fill = grd;

};

function over() {

    text.fill = '#006600';

};

Highscore.prototype = {
    
    preload: function() {
        this.load.image('background', 'Sunrise-clipart-2.jpg');
          game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    },
    
    init: function () {
        this.titleText = game.make.text(game.world.centerX, 100, " Game Over ", {
          font: 'bold 40pt TheMinion',
          fill: '#76EE00',
          align: 'center'
        });
        this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
        this.titleText.anchor.set(0.5);
        this.optionCount = 1;
        this.titleText.font = 'Revalia';
        
        this.instruText = game.make.text(game.world.centerX, 250, "Your score: " + scoreText + "\nYour Highscore: " + localStorage.getItem("Highscore") , {
          font: '16pt Revalia',
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
        this.playLabel.setShadow(3, 3, 'rgba(0,0,0,0.7)', 1);
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
