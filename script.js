const Gameboard = (() => {

    // the Gameboard
    const _board = [];
    // HTML Element that contain gameboard
    const container = document.querySelector(".gameboard");
    // Each square for Xs and Os
    const squares = Array.from(container.children);
    
   
    const getBoard = () => {
        return _board;
    };

    const _boardHandler = (e) => {
        const player = GameController.getCurrentPlayer();
        const mark = player.getMark();
        const index = squares.indexOf(e.target);
            
        _addMarkToBoard(e.target, mark, index);
        
        const result = GameController.checkResult();
        if (result) {
            document.querySelector("#result").textContent = result;

            // remove event listener to stop players from continuing playing
            Gameboard.squares.forEach(square => {
                square.removeEventListener("click", _boardHandler);
            })
            document.querySelector(".restartBtn").style.display = "block";
        }

        GameController.changeTurn();
            
    }
    squares.forEach((square, index) => {
   
        square.addEventListener("click", _boardHandler);
    });

    // render mark to the html board and save mark to gameboard
    const _addMarkToBoard = (target, mark, index) => {
        // render mark to the board
        if (!target.textContent) {
            target.textContent = mark;
        }

        // add mark to the gameboard
        if (!_board[index]) {
            _board[index] = mark;
        }
    }

    return {container, squares, getBoard};
})();

// Player object
const Player = (name, mark) => {
    const _mark = mark;

    const getMark = () => {
        return _mark;
    }
    const getName = () => {
        return name;
    }

    return {getName, getMark};
};


const GameController = (() => {

    let _currentTurnPlayer, _nextTurnPlayer;
    const startBtn = document.querySelector(".startBtn");
    const restartBtn = document.querySelector(".restartBtn");

    
    const _start = () => {
        _currentTurnPlayer = Player(window.prompt("Player 1 name: "), "X");
        _nextTurnPlayer = Player(window.prompt("Player 2 name: "), "O");
        
        // add player's names and render to the web
        const nameContainer = document.querySelector(".player-names").children;
        nameContainer[0].textContent += _currentTurnPlayer.getName();
        nameContainer[1].textContent += _nextTurnPlayer.getName();

        startBtn.style.display = "none";
        document.querySelector(".game").style.display = "block";
    }
    startBtn.addEventListener("click", _start);
    restartBtn.addEventListener("click", window.location.reload.bind(window.location));

    const getCurrentPlayer = () => {
        return _currentTurnPlayer;
    };

    const changeTurn = () => {
        [_currentTurnPlayer, _nextTurnPlayer] = [_nextTurnPlayer, _currentTurnPlayer];
    };

    const checkResult = () => {
        const board = Gameboard.getBoard();

        // player will win if they has filled in one of 8 cases
        const winCases = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
      
        for (let i = 0; i < winCases.length; i++) {
            // return the winner's name
            if (board[winCases[i][0]] !== undefined && board[winCases[i][0]] === board[winCases[i][1]] && board[winCases[i][1]] === board[winCases[i][2]]) {
                
                return `${_currentTurnPlayer.getName()} wins!`;
            }
        }
        
        // return tie result if board is full and nobody wins
        if (board.filter(square => square !== undefined).length === 9) {
            return "Tie!";
        }
     
    };
    
    return { getCurrentPlayer, changeTurn, checkResult };

})();



