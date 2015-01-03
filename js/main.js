var Game = function(el){
	this.el = el;
	this.rows = 0;
	this.columns = 0;
	this.board = [];
	this.colors = ["green","blue","pink","purple"];
	this.counter = 0;
	this.holes = 0;

	this.init = function(rows,cols){
		// Generate a matrix of n columns and n rows
		// and fill each spot with a random color
		this.rows = rows;
		this.columns = cols;
		for (var x = 0; x < this.rows; x++){
			this.board.push([]);
			for (var y = 0; y < this.columns; y++){
				this.board[x].push(this.pickColor());
			}
		}
	};

	this.render = function(){
		// render circles according to colors in board
		this.el.empty();
		for (var x = 0; x < this.rows; x++){
			for (var y = 0; y < this.columns; y++){
				var color = this.board[x][y];
				if (color){
					var $piece = new GamePiece(x,y,color);
					this.el.append($piece);
				}
				else {
					var $placeholder = new nullPiece();
					this.el.append($placeholder);
				}
				
			}
		}
	};

	this.pickColor = function(){
		// helper function to randomly pick colors for game elements
		var idx = Math.floor(Math.random() * this.colors.length);
		return this.colors[idx];
	};
	
};

Game.prototype.floodDelete = function (y,x,color,replacement){
	// Takes (x,y) coords and color of clicked element and
	// recursively replaces surrounding elements of same color
	if (this.board[y][x] != color){
		// check south to see if a hole has been made
		if (y < this.rows - 1 && this.board[y][x] && !this.board[y+1][x]) {
			game.holes += 1;
		}
		return;
	}
	this.board[y][x] = replacement;
	this.counter += 1;
	if (y > 0) {
		// check north
		this.floodDelete(y-1, x, color, replacement);
	}
	if (y < this.rows - 1) {
		// check south
		this.floodDelete(y+1, x, color, replacement);
	}
	if (x > 0) {
		// check west
		this.floodDelete(y, x-1, color, replacement);
	}
	if (x < this.columns - 1) {
		// check east
		this.floodDelete(y, x+1, color, replacement);
	}
};

Game.prototype.moveDown = function(){

	var holes = this.holes;
	while (holes > 0){
		for (var x = 0; x < this.columns; x++){
			for (var y = 0; y < this.rows - 1; y++){
				if (this.board[y][x] && !this.board[y+1][x]){
					var items_to_shift_down = [];
					var idx = y;
					while (idx >= 0 && this.board[idx][x]){
						var color = this.board[idx][x];
						items_to_shift_down.push(color);
						this.board[idx][x] = 0;
						idx --;
					}
					idx = y+1;
					for (var i = 0; i < items_to_shift_down.length; i++){
						this.board[idx][x] = items_to_shift_down[i];
						idx--;
					}
					holes --;
				}
			}
		}
	}

};

var GamePiece = function(y,x,color){
	var $piece = $("<div></div>");
	$piece.addClass("piece");
	$piece.css("backgroundColor", color);
	$piece.attr("data-x", x);
	$piece.attr("data-y", y);
	$piece.on("click", function() {
		game.counter = 0;
		game.holes = 0;
		game.floodDelete(y,x,color,0);
		console.log(game.counter, " removed");
		console.log(game.holes, " holes made");
		game.moveDown();
		game.render();
	});
	return $piece;
};

var nullPiece = function(){
	var $piece = $("<div></div>");
	$piece.addClass("piece");
	$piece.css("backgroundColor", "gray");
	return $piece;
};

var game = new Game($("#gameboard"));
game.init(8,10);
game.render();


