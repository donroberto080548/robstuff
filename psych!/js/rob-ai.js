/* Psych! V2.1 RobAI. Based on the original BASIC version, cleaned up. */
(function(){'use strict';
  function randomInt(min,max,random=Math.random){return Math.floor(random()*(max-min+1))+min;}
  function highest(hand){return Math.max(...hand);} function lowest(hand){return Math.min(...hand);}
  function nextHigher(hand,value){return hand.slice().sort((a,b)=>a-b).find(card=>card>value)||null;}
  function clampBidToLegal(hand,desired){if(hand.includes(desired))return desired;const sorted=hand.slice().sort((a,b)=>a-b);const above=sorted.find(card=>card>=desired);return above||sorted[sorted.length-1]||null;}
  function averageRemainingUpCard(upDeck,round){const remaining=upDeck.slice(round);return remaining.length?remaining.reduce((a,b)=>a+b,0)/remaining.length:0;}
  function highestRemainingUpCard(upDeck,round){const remaining=upDeck.slice(round);return remaining.length?Math.max(...remaining):0;}
  function chooseBid(info,random=Math.random){const up=info.upCard,round=info.round,aiHand=info.aiHand.slice();const humanKnownHand=info.humanPlayedCards?PsychGame.RANKS.filter(card=>!info.humanPlayedCards.includes(card)):PsychGame.RANKS.slice();if(!aiHand.length)throw new Error('RobAI has no cards left.');const aiHigh=highest(aiHand),aiLow=lowest(aiHand),humanHighEstimate=highest(humanKnownHand);if(humanHighEstimate>=aiHigh&&info.humanPoints+up>=PsychGame.TARGET_POINTS)return aiHigh;if(round>=PsychGame.MAX_ROUNDS)return aiHigh;const remainingHighUp=highestRemainingUpCard(info.upDeck,round),remainingAverageUp=averageRemainingUpCard(info.upDeck,round);if(up<=4){const cheapWin=nextHigher(aiHand,Math.min(up+1,13));if(cheapWin&&cheapWin<=6&&random()<0.35)return cheapWin;return aiLow;}if(up>=10){if(random()<0.18&&aiHand.length>3)return aiLow;const efficientWin=nextHigher(aiHand,up-1);return efficientWin||aiHigh;}if(up>=remainingHighUp){const winCard=nextHigher(aiHand,up-1);return winCard||aiHigh;}if(remainingAverageUp>up+2)return aiLow;const noise=randomInt(-1,3,random);const desired=Math.max(1,Math.min(13,up+noise));return clampBidToLegal(aiHand,desired);}
  window.RobAI={chooseBid};
})();
