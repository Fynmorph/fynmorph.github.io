// NOTE: this example uses the xiangqi.js library:
// https://github.com/lengyanyu258/xiangqi.js



function print(e, type){
	// switch (type) {
	// case 1:  
	// css = "background-color:#f66; font-weight:bold"
	// break
	// case 2:     
	// css = "background-color:#fcc"
	// break;
	// case 3:   
	// css = "background-color:#fee"
	// size= '5'
	// break;
	// default: 
	// css = "background-color:#fff"
	// }
	// console.log("%c" + e, css);
}

let board = null;
let $board = $('#myBoard');
let game = new Xiangqi();
let squareToHighlight = null;
let squareClass = 'square-2b8ce';

function removeGreySquares () {
	$('#myBoard .square-2b8ce').removeClass('highlight');
}

function removeHighlights (color) {
	$board.find('.' + squareClass)
	.removeClass('highlight-' + color);
}

function greySquare (square) {
	let $square = $('#myBoard .square-' + square);

	$square.addClass('highlight');
}

function onDragStart (source, piece, position, orientation) {
	// do not pick up pieces if the game is over
	if (game.game_over()) return false;

	// only pick up pieces for Red
	if (piece.search(/^b/) !== -1) return false;
}

function makeRandomMove () {

	// game over
	if (game.game_over() ){
		alert('Game over');return;
	} 

	var move = getBestMove(game);
	game.move(move);


	// highlight black's move
	removeHighlights('black');
	$board.find('.square-' + move.from).addClass('highlight-black');
	squareToHighlight = move.to;

	// update the board to the new position
	board.position(game.fen());
}

var minimaxRoot =function(depth, game, color) {

	var newGameMoves = game.moves({verbose: true});
	//use any negative large number
	var bestValue = -10000;
	var bestMoveFound;

	for(var i = 0; i < newGameMoves.length; i++) {
		var newGameMove = newGameMoves[i]
		game.move(newGameMove);
		print("CURRENT BRANCH:",1);
		print(game.ascii(),1);
		var boardValue = -negaMax(depth - 1, game, -10000, 10000, color);
		if(boardValue > bestValue) {
			bestValue = boardValue;
			bestMoveFound = newGameMove;
			print("BLACK NEW TACTIC " + (color * bestValue) + "\n" + game.ascii() + " from move: " + newGameMove.iccs ,1);
		}
		// if(boardValue == bestValue) {
		// if( Math.random() < 0.2 ){ bestMoveFound = newGameMove; }
		// }
		game.undo();
	}
	return bestMoveFound;
};

var negaMax = function(depth, game, alpha, beta, color){
	positionCount++;
	
	if (depth === 0) {
		return Quiesce( alpha, beta, 0, -color); // minus pour le minimax des noirs
	}
	var bestValue = -9999;
	var allMoves = game.moves();
	for(var i = 0; i < allMoves.length; i++) {
		var move = allMoves[i];
		game.move(move);
		
		if (game.in_checkmate()){ bestValue = 9999; }
		
		else{
			cValue = -negaMax( depth - 1 , game, -beta, -alpha, -color);
			if (bestValue < cValue){
				bestValue = cValue;
				var bestMove = move;
			}
		}
		game.undo(); 

		alpha = Math.max(alpha, bestValue);

		if (alpha >= beta)
		{
			break;
		}

	}
	print("for depth:"+depth+" returned "+ (-color * bestValue) + " from move: " + bestMove,1);
	return bestValue;
}

var Quiesce= function( alpha, beta, depth, color){
	print(depth + ": QUIET");
	depth += 1;
	positionCount2++;
	var bestValue = color * evaluateBoard(game.board()); // minus pour le minimax des noirs

	alpha = Math.max(alpha, bestValue);

	if(alpha >= beta){
		return bestValue;
	}

	var allMoves = game.moves({verbose: true});

	for (var i = 0; i < allMoves.length; i++) {
		var move = allMoves[i]
		if(move.flags === "c"){
			game.move(move);
			score = -Quiesce( -beta, -alpha , depth, -color);
			game.undo();

			bestValue = Math.max(bestValue, score);
			alpha = Math.max(alpha, bestValue);
			if (alpha >= beta)
			{
				break;
			}
		}
	}
	//print("quiesce best score was :" + color * bestValue, 2);

	return bestValue;
}

// var Quiesce= function( alpha, beta, depth, color ){
// return color * evaluateBoard(game.board());
// }

var getBestMove = function (game) {

	positionCount2 = 0;
	positionCount = 0;
	var depth = parseInt($('#search-depth').find(':selected').text());

	var d = new Date().getTime();
	var bestMove = minimaxRoot(depth, game, -1);
	var d2 = new Date().getTime();
	var moveTime = (d2 - d);
	var positionsPerS = ( positionCount * 1000 / moveTime);

	$('#position-count').text(positionCount);
	$('#position-count2').text(positionCount2);
	$('#time').text(moveTime/1000 + 's');
	$('#positions-per-s').text(positionsPerS);
	return bestMove;
};


var evaluateBoard = function (board) {
	var totalEvaluation = 0;
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 9; j++) {
			totalEvaluation = totalEvaluation + getPieceValue(board[i][j], i ,j);
		}
	}
	print("score:" + (totalEvaluation) + "\n" + game.ascii(),3); 
	return totalEvaluation;
};

var reverseArray = function(array) {
	return array.slice().reverse();
};

var pEvalRed =
[
[10.0,  10.0,  10.0,  10.0,  10.0,  10.0,  10.0,  10.0, 10.0],
[10.0,  10.0,  11.0,  15.0,  20.0,  15.0,  11.0,  10.0, 10.0],
[8.0,  10.0,  11.0,  15.0,  15.0,  15.0,  11.0,  10.0, 8.0],
[7.0,  9.0,  10.0,  11.0,  11.0,  11.0,  10.0,  9.0, 7.0],
[6.0,  8.0,  9.0,  10.0,  10.0,  10.0,  9.0,  8.0, 6.0],
[1.0,  2.0,  3.0,  4.0,  4.0,  4.0,  3.0,  2.0, 1.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0]
];

var pEvalBlack = reverseArray(pEvalRed);

var rEvalRed =
[
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[-2.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -2.0],

];

var rEvalBlack = reverseArray(rEvalRed);

var nEvalRed =
[
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  -2.0,  0.0,  0.0,  0.0,  0.0,  0.0,  -2.0, 0.0],

];

var nEvalBlack = reverseArray(nEvalRed);

var cEvalRed =
[
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],

];

var cEvalBlack = reverseArray(cEvalRed);

var bEvalRed =
[
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  2.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],

];

var bEvalBlack = reverseArray(bEvalRed);

var aEvalRed =
[
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  2.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],

];

var aEvalBlack = reverseArray(aEvalRed);

var kEvalRed =
[
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  2.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  2.0,  0.0,  0.0,  0.0, 0.0],
[0.0,  0.0,  0.0,  0.0,  2.0,  0.0,  0.0,  0.0, 0.0],

];

var kEvalBlack = reverseArray(kEvalRed);


var getPieceValue = function (piece, x, y) {
	if (piece === null) {
		return 0;
	}
	var getAbsoluteValue = function (piece, isRed, x ,y) {
		if (piece.type === 'p') { //PAWN
			return 10 + ( isRed ? pEvalRed[x][y] : pEvalBlack[x][y] );
		} else if (piece.type === 'r') { //ROOK/CHARIOT
			return 100 +( isRed ? rEvalRed[x][y] : rEvalBlack[x][y] );
		} else if (piece.type === 'c') { //CANNON
			return 45 +( isRed ? cEvalRed[x][y] : cEvalBlack[x][y] );
		} else if (piece.type === 'n') {
			return 40 +( isRed ? nEvalRed[x][y] : nEvalBlack[x][y] );
		} else if (piece.type === 'b') {
			return 25 +( isRed ? bEvalRed[x][y] : bEvalBlack[x][y] );
		} else if (piece.type === 'a') {
			return 20 +( isRed ? aEvalRed[x][y] : aEvalBlack[x][y] );
		} else if (piece.type === 'k') {
			return 900 +( isRed ? kEvalRed[x][y] : kEvalBlack[x][y] );
		}
		throw "Unknown piece type: " + piece.type;
	};

	var absoluteValue = getAbsoluteValue(piece, piece.color === 'r', x ,y);
	return piece.color === 'r' ? absoluteValue : -absoluteValue;
};


function onDrop (source, target) {
	// see if the move is legal
	let move = game.move({
from: source,
to: target,
promotion: 'q' // NOTE: always promote to a queen for example simplicity
	});

	// illegal move
	if (move === null) return 'snapback';

	// highlight red's move
	removeHighlights('red');
	$board.find('.square-' + source).addClass('highlight-red');
	$board.find('.square-' + target).addClass('highlight-red');

	// make random move for black
	window.setTimeout(makeRandomMove, 250);
}

function onMouseoverSquare (square, piece) {
	// get list of possible moves for this square
	let moves = game.moves({
square: square,
verbose: true
	});

	// exit if there are no moves available for this square
	if (moves.length === 0) return;

	// highlight the square they moused over
	greySquare(square);

	// highlight the possible squares for this piece
	for (let i = 0; i < moves.length; i++) {
		greySquare(moves[i].to);
	}
}

function onMouseoutSquare (square, piece) {
	removeGreySquares();
}

function onMoveEnd () {
	$board.find('.square-' + squareToHighlight)
	.addClass('highlight-black');
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
	board.position(game.fen());
}

let config = {
draggable: true,
position: 'start',
onDragStart: onDragStart,
onDrop: onDrop,
onMouseoutSquare: onMouseoutSquare,
onMouseoverSquare: onMouseoverSquare,
onSnapEnd: onSnapEnd
};
board = Xiangqiboard('myBoard', config);