Jumper.Title = function (game) {
var score;
var scoreH;
};
Jumper.Title.prototype = {
    create: function () {
		score = null;
		scoreH = null;
		this.game.add.sprite(0,0, 'background');
		var title = this.game.add.sprite(368/2,-100,'playerLeft');
		title.anchor.setTo(0.5,0.5);
		this.game.add.tween(title).to({ y: 100 },2000, Phaser.Easing.Elastic.InOut, true, 0);
		var playButton = this.game.add.button(368/2,850,"play",this.play,this,1,0)
		playButton.anchor.setTo(0.5,0.5);
		this.game.add.tween(playButton).to({ y: 400 },2000, Phaser.Easing.Elastic.InOut, true, 0);
    },
	play : function () {
		this.game.state.start( 'Play' );
	},
	
};