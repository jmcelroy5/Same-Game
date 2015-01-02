var Game = function(el){
	this.el = el;
	this.rows = 0;
	this.columns = 0;
	this.board = [];
	this.colors = ["green","blue","pink","purple"];

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
		console.log("render called..");
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
	console.log("comparing (", y, ",", x, ") with ", color);
	if (this.board[y][x] != color){
		return;
	}
	this.board[y][x] = replacement;
	if (y > 0) {
		this.floodDelete(y-1, x, color, replacement);
	}
	if (y < this.rows - 1) {
		this.floodDelete(y+1, x, color, replacement);
	}
	if (x > 0) {
		this.floodDelete(y, x-1, color, replacement);
	}
	if (x < this.columns - 1) {
		this.floodDelete(y, x+1, color, replacement);
	}
};

Game.prototype.moveDown = function(){
	for (var y = 0; y < this.rows - 1; y++){
		for (var x = 0; x < this.columns; x++){
			var color = this.board[y][x];
			var idx = y+1;
			var oneBelow = this.board[y][idx];
			// console.log("y: ", y, "idx below: ", idx);
			if (this.board[y][x] && !oneBelow){
				while (!oneBelow && idx < this.rows - 1){
					idx ++;
					oneBelow = this.board[idx][y];
				}
				this.board[y][x] = null;
				this.board[idx - 1][x] = color;
			}
		}
	}
	console.log("finished moving down");
};

var GamePiece = function(y,x,color){
	var $piece = $("<div></div>");
	$piece.addClass("piece");
	$piece.css("backgroundColor", color);
	$piece.attr("data-x", x);
	$piece.attr("data-y", y);
	$piece.on("click", function() {
		game.floodDelete(y,x,color,0);
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


