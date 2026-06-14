/* Psych! V2.1 game engine. No DOM code. */
(function(){'use strict';
  const RANKS=Object.freeze([1,2,3,4,5,6,7,8,9,10,11,12,13]);
  const TARGET_POINTS=46, MAX_ROUNDS=13;
  function shuffle(values, random=Math.random){const a=values.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  function rankLabel(value){return ({1:'A',11:'J',12:'Q',13:'K'}[value]||String(value));}
  function createHand(){return RANKS.slice();}
  function removeCard(hand,card){const idx=hand.indexOf(card);if(idx===-1)throw new Error('Illegal bid: card is not in hand: '+card);return hand.slice(0,idx).concat(hand.slice(idx+1));}
  function createMatch(options={}){const match={bestOf:options.bestOf||1,showAiPlayed:options.showAiPlayed!==false,opponent:options.opponent||'rob',arthurMemory:options.arthurMemory||'perfect',wins:{human:0,ai:0},games:[],game:null,matchOver:false};match.game=createGame(1);return match;}
  function createGame(index=1){return {index,round:1,upDeck:shuffle(RANKS),hands:{human:createHand(),ai:createHand()},points:{human:0,ai:0},rounds:[],gameOver:false,winner:null};}
  function currentUpCard(game){return game.upDeck[game.round-1];}
  function matchTarget(bestOf){return Math.floor(bestOf/2)+1;}
  function resolveRound(match,humanBid,aiBid){const game=match.game;if(game.gameOver||match.matchOver)throw new Error('Cannot resolve a round after the game or match has ended.');if(!game.hands.human.includes(humanBid))throw new Error('Human bid is not legal: '+humanBid);if(!game.hands.ai.includes(aiBid))throw new Error('AI bid is not legal: '+aiBid);const upCard=currentUpCard(game);let winner=null,pointsAwarded=0;if(humanBid>aiBid){winner='human';pointsAwarded=upCard;game.points.human+=upCard;}else if(aiBid>humanBid){winner='ai';pointsAwarded=upCard;game.points.ai+=upCard;}game.hands.human=removeCard(game.hands.human,humanBid);game.hands.ai=removeCard(game.hands.ai,aiBid);const roundRecord={round:game.round,upCard,humanBid,aiBid,winner,pointsAwarded,total:{human:game.points.human,ai:game.points.ai}};game.rounds.push(roundRecord);const reachedTarget=game.points.human>=TARGET_POINTS||game.points.ai>=TARGET_POINTS;const exhausted=game.round>=MAX_ROUNDS;if(reachedTarget||exhausted){endGame(match);}else{game.round+=1;}return roundRecord;}
  function endGame(match){const game=match.game;if(game.points.human>game.points.ai){game.winner='human';match.wins.human+=1;}else if(game.points.ai>game.points.human){game.winner='ai';match.wins.ai+=1;}else{game.winner=null;}game.gameOver=true;match.games.push({index:game.index,winner:game.winner,points:{...game.points},rounds:game.rounds.slice()});const target=matchTarget(match.bestOf);if(match.wins.human>=target||match.wins.ai>=target)match.matchOver=true;}
  function startNextGame(match){if(!match.game.gameOver)throw new Error('Current game is not over.');if(match.matchOver)throw new Error('Current match is over. Start a new match instead.');match.game=createGame(match.games.length+1);}
  window.PsychGame={RANKS,TARGET_POINTS,MAX_ROUNDS,createMatch,createGame,resolveRound,startNextGame,currentUpCard,rankLabel,matchTarget,shuffle};
})();
