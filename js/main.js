var Game = function(el){
	this.el = el;
	this.board = [];
	this.colors = ["green","blue","pink","purple"];
	this.counter = 0;
	this.holes = 0;

	this.init = function(rows,cols){
		// Generate a matrix of n columns and n rows
		// and fill each spot with a random color
		this.rows = rows;
		this.columns = cols;
		this.height = rows - 1;
		this.width = cols - 1;
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
				// check below for a hole
				if (this.board[y][x] && !this.board[y+1][x]){
					var itemsToShiftDown = [];
					var idx = y;
					while (idx >= 0 && this.board[idx][x]){
						// move up the column, adding colors to array
						var color = this.board[idx][x];
						itemsToShiftDown.push(color);
						this.board[idx][x] = 0;
						idx --;
					}
					// start at the hole
					idx = y+1;
					// move back up the column, assigning colors to the open spaces 
					for (var i = 0; i < itemsToShiftDown.length; i++){
						this.board[idx][x] = itemsToShiftDown[i];
						idx--;
					}
					holes --;
				}
			}
		}
	}

};

Game.prototype.moveOver = function(){
	// check the bottom row for empty spots
	var lastRow = this.board[this.rows-1];
	var emptyCol = lastRow.indexOf(0);
	if (emptyCol > -1){
		for (var x = emptyCol + 1; x < this.columns; x++){
			for (var y = 0; y < this.rows; y++){
				var current = this.board[y][x]; // get the color
				this.board[y][x] = 0; // clear it
				this.board[y][x-1] = current; // shift left
			}
		}
	}

};

// TODO: Scoreboard

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
		game.moveDown();
		game.moveOver();
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


