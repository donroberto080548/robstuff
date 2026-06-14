/* Psych! v2.2 UI */
(function(){'use strict';
  const els = {};
  let match = null, selectedBid = null, lastSnapshot = null, overlayMode = null;
  let lastRoundShown = null;

  function init(){fitCanvas();window.addEventListener('resize',fitCanvas);
    cacheElements();
    wireEvents();
    updateArthurMemoryVisibility();
    startNewMatch(true);
  }

  function cacheElements(){
    ['bestOfSelect','showAiPlayedSelect','opponentSelect','arthurMemorySelect','arthurMemoryLabel',
     'confirmSettingsButton','howToButton','aboutButton','roundNumber','upCard','humanPoints','aiPoints','aiPointsName',
     'humanGames','aiGames','pointDelta','matchDelta','matchFormat','humanHand','lockBidButton','undoButton',
     'roundResult','scoreboardBody','scoreboardNote','aiBidHeader','aiScoreHeader','overlay','overlayTitle','overlayBody',
     'overlayContinueButton','runTestsButton','testOutput','upCardImage','lastHumanCard','lastUpCard','lastAiCard','lastAiLabel']
     .forEach(id => els[id] = document.getElementById(id));
  }

  function wireEvents(){
    els.confirmSettingsButton.addEventListener('click', confirmSettings);
    els.lockBidButton.addEventListener('click', lockBid);
    els.undoButton.addEventListener('click', undoLastRound);
    els.overlayContinueButton.addEventListener('click', continueAfterOverlay);
    els.howToButton.addEventListener('click', showHowToPlay);
    els.aboutButton.addEventListener('click', showAboutPsych);
    els.opponentSelect.addEventListener('change', () => { updateArthurMemoryVisibility(); markSettingsPending(); });
    els.bestOfSelect.addEventListener('change', markSettingsPending);
    els.showAiPlayedSelect.addEventListener('change', markSettingsPending);
    els.arthurMemorySelect.addEventListener('change', markSettingsPending);
    els.runTestsButton.addEventListener('click', () => { els.testOutput.textContent = window.PsychTests.run(); });
  }


  function fitCanvas(){
    const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    document.documentElement.style.setProperty('--app-scale', String(scale));
  }

  function opponentName(){ return match && match.opponent === 'arthur' ? 'ArthurAI' : 'RobAI'; }
  function matchLabel(bestOf){ return bestOf === 1 ? 'Single game' : `Best of ${bestOf}`; }

  function updateArthurMemoryVisibility(){
    const isArthur = els.opponentSelect.value === 'arthur';
    els.arthurMemoryLabel.style.display = isArthur ? 'block' : 'none';
  }

  function markSettingsPending(){
    els.confirmSettingsButton.classList.add('attention');
    els.confirmSettingsButton.textContent = 'Confirm Settings / New Match';
  }

  function clearSettingsPending(){
    els.confirmSettingsButton.classList.remove('attention');
    els.confirmSettingsButton.textContent = 'Settings Confirmed';
    window.setTimeout(() => { els.confirmSettingsButton.textContent = 'Confirm Settings / New Match'; }, 1200);
  }

  function confirmSettings(){ startNewMatch(false); }

  function startNewMatch(isInitial=false){
    const bestOf = Number(els.bestOfSelect.value);
    const showAiPlayed = els.showAiPlayedSelect.value === 'yes';
    const opponent = els.opponentSelect.value;
    const arthurMemory = els.arthurMemorySelect.value;
    match = PsychGame.createMatch({ bestOf, showAiPlayed, opponent, arthurMemory });
    selectedBid = null; lastSnapshot = null; overlayMode = null; lastRoundShown = null;
    hideOverlay(); updateArthurMemoryVisibility(); render(); clearLastRoundDisplay();
    if(!isInitial) clearSettingsPending();
    setResult(isInitial ? 'Choose your settings or play with the defaults.' : 'Settings confirmed. New match started. Choose a card and lock in your bid.');
  }

  function snapshot(){ return JSON.stringify(match); }
  function restore(serialized){ match = JSON.parse(serialized); selectedBid = null; render(); }

  function render(){
    const game = match.game, aiName = opponentName();
    els.roundNumber.textContent = game.round;
    els.upCard.innerHTML = formatCardHtml(PsychGame.currentUpCard(game), 'c');
    els.humanPoints.textContent = game.points.human;
    els.aiPoints.textContent = game.points.ai;
    els.aiPointsName.textContent = aiName;
    els.humanGames.textContent = match.wins.human;
    els.aiGames.textContent = match.wins.ai;
    els.matchFormat.textContent = matchLabel(match.bestOf);
    els.aiBidHeader.textContent = `${aiName} Bid`;
    els.aiScoreHeader.textContent = aiName;
    els.lastAiLabel.textContent = aiName;
    els.upCardImage.src = cardPath(PsychGame.currentUpCard(game), 'c');
    els.upCardImage.alt = `${longRank(PsychGame.currentUpCard(game))} of clubs`;
    renderHand(game.hands.human);
    renderScoreboard(false);
    els.lockBidButton.disabled = Boolean(game.gameOver || match.matchOver);
    els.undoButton.disabled = !lastSnapshot || Boolean(game.gameOver || match.matchOver);
  }

  function renderHand(hand){
    els.humanHand.innerHTML = '';
    PsychGame.RANKS.forEach(card => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'card-button';
      const img = document.createElement('img');
      img.src = cardPath(card, 'h');
      img.alt = `${longRank(card)} of hearts`;
      button.appendChild(img);
      if (!hand.includes(card)) button.classList.add('used');
      if (selectedBid === card) button.classList.add('selected');
      button.addEventListener('click', () => {
        if (!hand.includes(card)) return;
        selectedBid = card;
        renderHand(hand);
      });
      els.humanHand.appendChild(button);
    });
  }

  function renderScoreboard(forceRevealAiBids=false){
    const showAi = forceRevealAiBids || match.showAiPlayed;
    const game = match.game, aiName = opponentName();
    els.scoreboardBody.innerHTML = '';
    game.rounds.forEach(round => {
      const tr = document.createElement('tr');
      const aiBid = showAi ? formatCardHtml(round.aiBid, 's') : 'Hidden';
      const winner = round.winner === 'human' ? 'You' : round.winner === 'ai' ? aiName : 'Tie';
      tr.innerHTML = `<td>${round.round}</td><td>${formatCardHtml(round.upCard,'c')}</td><td>${formatCardHtml(round.humanBid,'h')}</td><td>${aiBid}</td><td>${winner}</td><td>${round.total.human}</td><td>${round.total.ai}</td>`;
      els.scoreboardBody.appendChild(tr);
    });
    if (forceRevealAiBids) {
      els.scoreboardNote.textContent = `Review mode: ${aiName}'s played bids are revealed. Its remaining cards were never shown.`;
    } else {
      els.scoreboardNote.textContent = showAi ? `${aiName}'s remaining cards are hidden. Played bids are shown.` : `${aiName}'s remaining cards are hidden. Played bids are hidden until game review.`;
    }
  }

  function chooseAiBid(game){
    const info = {
      upCard: PsychGame.currentUpCard(game),
      round: game.round,
      upDeck: game.upDeck.slice(),
      aiHand: game.hands.ai.slice(),
      humanPoints: game.points.human,
      aiPoints: game.points.ai,
      humanPlayedCards: game.rounds.map(r => r.humanBid),
      aiPlayedCards: game.rounds.map(r => r.aiBid),
      memoryMode: match.arthurMemory
    };
    return match.opponent === 'arthur' ? ArthurAI.chooseBid(info) : RobAI.chooseBid(info);
  }

  function lockBid(){
    const game = match.game, aiName = opponentName();
    if (selectedBid == null || game.gameOver || match.matchOver) {
      if (selectedBid == null) setResult('Choose one of your remaining cards first.');
      return;
    }
    lastSnapshot = snapshot();
    const aiBid = chooseAiBid(game);
    const round = PsychGame.resolveRound(match, selectedBid, aiBid);
    selectedBid = null;
    lastRoundShown = { human: round.humanBid, up: round.upCard, ai: round.aiBid };
    updateLastRoundDisplay(round, false);

    let resultText;
    if (round.winner === 'human') {
      if (match.showAiPlayed) {
        resultText = `You won ${round.pointsAwarded} points. Your ${formatCardHtml(round.humanBid,'h')} beat ${aiName}'s ${formatCardHtml(round.aiBid,'s')} for the ${formatCardHtml(round.upCard,'c')}.`;
      } else {
        resultText = `You won ${round.pointsAwarded} points with ${formatCardHtml(round.humanBid,'h')} for the ${formatCardHtml(round.upCard,'c')}. ${aiName}'s bid is hidden until game review.`;
      }
      flash(els.pointDelta, `You +${round.pointsAwarded}`);
    } else if (round.winner === 'ai') {
      if (match.showAiPlayed) {
        resultText = `${aiName} won ${round.pointsAwarded} points. Its ${formatCardHtml(round.aiBid,'s')} beat your ${formatCardHtml(round.humanBid,'h')} for the ${formatCardHtml(round.upCard,'c')}.`;
      } else {
        resultText = `${aiName} won ${round.pointsAwarded} points for the ${formatCardHtml(round.upCard,'c')}. Its bid is hidden until game review.`;
      }
      flash(els.pointDelta, `${aiName} +${round.pointsAwarded}`);
    } else {
      resultText = match.showAiPlayed
        ? `Tie. Your ${formatCardHtml(round.humanBid,'h')} matched ${aiName}'s ${formatCardHtml(round.aiBid,'s')}. No points awarded.`
        : `Tie. No points awarded. ${aiName}'s bid is hidden until game review.`;
      flash(els.pointDelta, 'Tie');
    }

    setResult(resultText);
    render();
    if (match.game.gameOver) showEndOverlay();
  }

  function updateLastRoundDisplay(round, revealAi){
    if (!round) { clearLastRoundDisplay(); return; }
    setCardImage(els.lastHumanCard, round.humanBid, 'h');
    setCardImage(els.lastUpCard, round.upCard, 'c');
    if (revealAi || match.showAiPlayed) {
      setCardImage(els.lastAiCard, round.aiBid, 's');
      els.lastAiCard.classList.remove('empty-card');
    } else {
      els.lastAiCard.src = cardBackData();
      els.lastAiCard.alt = `${opponentName()} bid hidden`;
      els.lastAiCard.classList.remove('empty-card');
    }
  }

  function clearLastRoundDisplay(){
    [els.lastHumanCard, els.lastUpCard, els.lastAiCard].forEach(img => {
      img.src = transparentGif();
      img.alt = 'No card yet';
      img.classList.add('empty-card');
    });
  }

  function buildReviewTable(game){
    const aiName = opponentName();
    const rows = game.rounds.map(round => {
      const winner = round.winner === 'human' ? 'You' : round.winner === 'ai' ? aiName : 'Tie';
      return `<tr><td>${round.round}</td><td>${formatCardHtml(round.upCard,'c')}</td><td>${formatCardHtml(round.humanBid,'h')}</td><td>${formatCardHtml(round.aiBid,'s')}</td><td>${winner}</td><td>${round.total.human}</td><td>${round.total.ai}</td></tr>`;
    }).join('');
    return `<table class="review-table"><thead><tr><th>Round</th><th>Up</th><th>Your Bid</th><th>${aiName} Bid</th><th>Winner</th><th>You</th><th>${aiName}</th></tr></thead><tbody>${rows}</tbody></table>`;
  }

  function showEndOverlay(){
    const game = match.game, aiName = opponentName();
    const gameWinner = game.winner === 'human' ? 'You' : game.winner === 'ai' ? aiName : 'Tie';
    renderScoreboard(true);
    if (lastRoundShown) updateLastRoundDisplay({humanBid:lastRoundShown.human, upCard:lastRoundShown.up, aiBid:lastRoundShown.ai}, true);
    if (game.winner) flash(els.matchDelta, `${gameWinner} +1`);
    overlayMode = 'end';
    if (match.matchOver) {
      const matchWinner = match.wins.human > match.wins.ai ? 'You' : aiName;
      els.overlayTitle.textContent = 'Match Over';
      els.overlayBody.innerHTML = `<p><strong>${matchWinner}</strong> won the match.</p><p>Match result: You ${match.wins.human} — ${aiName} ${match.wins.ai}</p><p>Final game points: You ${game.points.human} — ${aiName} ${game.points.ai}</p><p>${aiName}'s played bids are revealed below for review.</p>${buildReviewTable(game)}`;
      els.overlayContinueButton.textContent = 'Start New Match';
    } else {
      els.overlayTitle.textContent = `Game ${game.index} Over`;
      els.overlayBody.innerHTML = `<p>Winner: <strong>${gameWinner}</strong></p><p>Points: You ${game.points.human} — ${aiName} ${game.points.ai}</p><p>Match: You ${match.wins.human} — ${aiName} ${match.wins.ai}</p><p>${aiName}'s played bids are revealed below for review.</p>${buildReviewTable(game)}`;
      els.overlayContinueButton.textContent = 'Start Next Game';
    }
    showOverlay();
  }

  function showHowToPlay(){
    overlayMode = 'info';
    els.overlayTitle.textContent = 'How to Play';
    els.overlayBody.innerHTML = `<ol><li>You and the computer each have bid cards from <strong>A</strong> through <strong>K</strong>. Ace is 1, King is 13.</li><li>Each round reveals one clubs up-card. That up-card is worth its face value in points.</li><li>Choose one heart card and lock it in. The computer secretly chooses one spade card.</li><li>The higher bid wins the up-card's point value. A tie scores nothing.</li><li>Used bid cards are gone for the rest of the game.</li><li>The first player to reach <strong>46 points</strong> wins. If all 13 rounds are played, the higher score wins.</li></ol><p>The computer's remaining cards are never shown. You may choose whether its played bids are shown during the game or revealed afterward for review.</p><p>The trick is not to win every round. The trick is to avoid spending more than the round is worth.</p>`;
    els.overlayContinueButton.textContent = 'Close';
    showOverlay();
  }

  function showAboutPsych(){
    overlayMode = 'info';
    els.overlayTitle.textContent = 'About Psych!';
    els.overlayBody.innerHTML = `<p><strong>Psych!</strong> began as <strong>Jujitsu</strong>, a two-player card game described by Jim Fixx in <em>Games for the Super Intelligent</em>. Rob Landeros later adapted Jujitsu into a Commodore 64 BASIC program, with an accompanying article and source-code listing published in <strong>COMPUTE!'s Gazette</strong>, September 1986, Issue 39, Vol. 4, No. 9.</p><p>Years later, when revisiting the idea, Rob renamed the game <strong>Psych!</strong>.</p><p>The rules are almost as stripped down as a card game can get. One suit becomes the deck of point cards. Each player gets a full suit of bidding cards. Each round, one point card is turned up. Both players secretly bid one card. The higher bid wins the value of the up-card. A tie scores nothing. Used bid cards are gone.</p><p><strong>That last part is the game.</strong></p><p>This version includes two computer opponents. <strong>RobAI</strong> is based on the logic of the original BASIC program, cleaned up for modern play. <strong>ArthurAI</strong> is a newer strategic opponent designed to evaluate the game more analytically while still playing fairly. Neither opponent knows your current bid before choosing its own.</p><p><strong>How much are you willing to spend to win this?</strong></p>`;
    els.overlayContinueButton.textContent = 'Close';
    showOverlay();
  }

  function showOverlay(){ els.overlay.classList.add('show'); els.overlay.setAttribute('aria-hidden','false'); }
  function hideOverlay(){ overlayMode = null; els.overlay.classList.remove('show'); els.overlay.setAttribute('aria-hidden','true'); }

  function continueAfterOverlay(){
    if (overlayMode === 'info') { hideOverlay(); return; }
    if (match.matchOver) { startNewMatch(false); return; }
    PsychGame.startNextGame(match);
    selectedBid = null; lastSnapshot = null; hideOverlay(); render(); clearLastRoundDisplay();
    setResult('New game. Choose a card and lock in your bid.');
  }

  function undoLastRound(){
    if (!lastSnapshot) return;
    restore(lastSnapshot);
    lastSnapshot = null;
    setResult('Last round undone.');
    const rounds = match.game.rounds;
    if (rounds.length) {
      const last = rounds[rounds.length - 1];
      updateLastRoundDisplay({humanBid:last.humanBid, upCard:last.upCard, aiBid:last.aiBid}, match.showAiPlayed);
    } else {
      clearLastRoundDisplay();
    }
  }

  function setResult(text){ els.roundResult.innerHTML = text; }
  function flash(el, text){ el.textContent = text; window.setTimeout(() => { el.textContent = ''; }, 1400); }

  function cardPath(rank, suit){ return `assets/cards/${rankCode(rank)}${suit}.png`; }
  function rankCode(rank){ return ({1:'a',11:'j',12:'q',13:'k'})[rank] || String(rank); }
  function longRank(rank){ return ({1:'Ace',11:'Jack',12:'Queen',13:'King'})[rank] || String(rank); }
  function suitSymbol(code){ return ({h:'♥',s:'♠',c:'♣',d:'♦'})[code] || ''; }
  function formatCardText(rank, suit){ return `${PsychGame.rankLabel(rank)}${suitSymbol(suit)}`; }
  function suitClass(code){ return ({h:'suit-heart',d:'suit-diamond',s:'suit-spade',c:'suit-club'})[code] || ''; }
  function formatCardHtml(rank, suit){ return `<span class="card-inline">${PsychGame.rankLabel(rank)}<span class="suit-symbol ${suitClass(suit)}">${suitSymbol(suit)}</span></span>`; }
  function setCardImage(imgEl, rank, suit){ imgEl.src = cardPath(rank, suit); imgEl.alt = `${longRank(rank)} of ${({h:'hearts',s:'spades',c:'clubs',d:'diamonds'})[suit]}`; imgEl.classList.remove('empty-card'); }
  function transparentGif(){ return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='; }
  function cardBackData(){
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="180" height="252" viewBox="0 0 180 252"><rect x="4" y="4" width="172" height="244" rx="12" fill="#efe8d6" stroke="#d8cba7" stroke-width="4"/><rect x="20" y="20" width="140" height="212" rx="8" fill="#0c6b57" stroke="#d8cba7" stroke-width="3"/><g stroke="#d8cba7" stroke-width="2" opacity="0.85"><path d="M20 34h140"/><path d="M20 60h140"/><path d="M20 86h140"/><path d="M20 112h140"/><path d="M20 138h140"/><path d="M20 164h140"/><path d="M20 190h140"/><path d="M20 216h140"/></g><circle cx="90" cy="126" r="36" fill="none" stroke="#f0dfaa" stroke-width="4"/><text x="90" y="136" text-anchor="middle" font-family="Georgia" font-size="26" fill="#f0dfaa">Psych!</text></svg>`);
  }

  window.addEventListener('DOMContentLoaded', init);
})();
