import React, { useState } from "react";
import styled from "styled-components";

import CardFront from "../CardGraphics/CardFront";
import CardBack from "../CardGraphics/CardBack";
import { COLORS, DECK } from "../../constants";
import warWallpaper from "../../assets/war_wallpaper.jpg";

const startingDeck = DECK;
let oppDeck = [];
let selfDeck = [];

let oppCurrentCard = "";
let selfCurrentCard = "";
let battleCards = 0;
let oppCardsInBattle = [];
let selfCardsInBattle = [];
let disableButtonStatus = false;
let enableAutoPlay = false;
let interval;
let turn = 0;

const initShuffle = () => {
  for (let i = startingDeck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = startingDeck[i];
    startingDeck[i] = startingDeck[j];
    startingDeck[j] = temp;
  }
  splitDeck();
};

const splitDeck = () => {
  for (let i = 0; i < 26; i++) {
    oppDeck.push(startingDeck[i]);
    selfDeck.push(startingDeck[i + 26]);
  }
};

initShuffle();

const FullDeck = () => {
  const [gameStatus, setGameStatus] = useState("Commence the war!");
  const [gameText, setGameText] = useState("No prisoners.");
  const [colorStatus, setColorStatus] = useState(null);

  let oppRemainingCards = oppDeck.length - battleCards;
  let selfRemainingCards = selfDeck.length - battleCards;
  // let average = (selfDeck.length + oppDeck.length + 2 * battleCards) / 2;

  function toggleAutoPlay() {
    enableAutoPlay = !enableAutoPlay;
    if (enableAutoPlay) {
      interval = setInterval(incrementTurn, 1700);
    } else clearInterval(interval);
  }

  function incrementTurn() {
    turn++;
    oppCurrentCard = oppDeck.shift();
    selfCurrentCard = selfDeck.shift();
    updateDecksAndStatus();
    checkIfGameOver();
  }

  function updateDecksAndStatus() {
    if (oppCurrentCard.value > selfCurrentCard.value) {
      oppDeck.push(oppCurrentCard, selfCurrentCard);
      while (battleCards > 0) {
        oppDeck.push(selfDeck.shift());
        oppDeck.push(oppDeck.shift());
        battleCards--;
      }
      for (let i = 0; i < oppCardsInBattle.length; i++) {
        oppDeck.push(oppCardsInBattle[i]);
        oppDeck.push(selfCardsInBattle[i]);
      }
      oppCardsInBattle = [];
      selfCardsInBattle = [];
      setColorStatus("lost");
      setGameStatus("Battle LOST!");
      setGameText(
        `Cards ${oppCurrentCard.rank} and ${selfCurrentCard.rank}, and any cards at war are placed in the opponents' deck.`
      );
    } else if (oppCurrentCard.value < selfCurrentCard.value) {
      selfDeck.push(selfCurrentCard, oppCurrentCard);
      while (battleCards > 0) {
        selfDeck.push(oppDeck.shift());
        selfDeck.push(selfDeck.shift());
        battleCards--;
      }
      for (let i = 0; i < oppCardsInBattle.length; i++) {
        selfDeck.push(oppCardsInBattle[i]);
        selfDeck.push(selfCardsInBattle[i]);
      }
      oppCardsInBattle = [];
      selfCardsInBattle = [];
      setColorStatus("won");
      setGameStatus("Battle WON!");
      setGameText(
        `Cards ${oppCurrentCard.rank} and ${selfCurrentCard.rank}, and any cards at war are placed in your deck.`
      );
    } else if (
      oppDeck.length > 0 &&
      selfDeck.length > 0 &&
      oppCurrentCard.value === selfCurrentCard.value
    ) {
      oppCardsInBattle.push(oppCurrentCard);
      selfCardsInBattle.push(selfCurrentCard);
      battleCards++;
      setColorStatus(null);
      setGameStatus("War!");
      setGameText("Pull another card to settle this battle, winner takes all.");
    } else if (
      (oppDeck.length === 0 || selfDeck.length === 0) &&
      oppCurrentCard.value === selfCurrentCard.value
    ) {
      oppRemainingCards = oppRemainingCards + battleCards;
      selfRemainingCards = selfRemainingCards + battleCards;
      battleCards = 0;
      oppCardsInBattle = [];
      selfCardsInBattle = [];
    }
  }

  function checkIfGameOver() {
    if (
      (oppCurrentCard.value > selfCurrentCard.value ||
        oppCurrentCard.value === selfCurrentCard.value) &&
      selfDeck.length <= 0
    ) {
      disableButton();
      clearInterval(interval);
      setColorStatus("lost");
      setGameStatus("You've LOST the war!");
      setGameText("Welp, now we're extinct.");
    } else if (
      (oppCurrentCard.value < selfCurrentCard.value ||
        oppCurrentCard.value === selfCurrentCard.value) &&
      oppDeck.length <= 0
    ) {
      disableButton();
      clearInterval(interval);
      setColorStatus("won");
      setGameStatus("You've WON the war!");
      setGameText("Nice.");
    }
  }

  function reset() {
    turn = 0;
    setColorStatus(null);
    setGameStatus("Start");
    setGameText("No prisoners.");
    oppDeck = [];
    selfDeck = [];
    oppCurrentCard = "";
    selfCurrentCard = "";
    battleCards = 0;
    oppCardsInBattle = [];
    selfCardsInBattle = [];
    disableButtonStatus = false;
    enableAutoPlay = false;
    clearInterval(interval);
    initShuffle();
  }

  function disableButton() {
    disableButtonStatus = true;
  }

  // console.log("OPP", oppDeck);
  // console.log("SELF", selfDeck);

  return (
    <GameWrapper>
      <OppSide>
        <CardBack remainingCards={oppRemainingCards} />
        <CardFront card={oppCurrentCard} />
        <CardBack battleCards={battleCards} cardsInBattle={oppCardsInBattle} />
      </OppSide>
      <GameFunctions>
        <GameFunctionsLeft>
          <ResetButton onClick={reset}>Reset</ResetButton>
          <Rounds>
            Round: {turn}
            {/* Avg: {average} */}
          </Rounds>
        </GameFunctionsLeft>
        <GameFunctionsCentre>
          {colorStatus === "won" && <GameStatusWon>{gameStatus}</GameStatusWon>}
          {colorStatus === "lost" && (
            <GameStatusLost>{gameStatus}</GameStatusLost>
          )}
          {!colorStatus && <GameStatusStart>{gameStatus}</GameStatusStart>}
          <LineBreak />
          <GameText>{gameText}</GameText>
        </GameFunctionsCentre>
        <GameFunctionsRight>
          <NextButton onClick={incrementTurn} disabled={disableButtonStatus}>
            Next turn
          </NextButton>
          <AutoPlayButton
            onClick={toggleAutoPlay}
            disabled={disableButtonStatus}
          >
            Auto Play
          </AutoPlayButton>
        </GameFunctionsRight>
      </GameFunctions>
      <SelfSide>
        <CardBack remainingCards={selfRemainingCards} />
        <CardFront card={selfCurrentCard} />
        <CardBack battleCards={battleCards} cardsInBattle={selfCardsInBattle} />
      </SelfSide>
    </GameWrapper>
  );
};

const GameWrapper = styled.div`
  background-size: cover;
  background-image: url(${warWallpaper});
  background-position: center;
  margin: 5px auto;
  height: 77vh;
`;

const OppSide = styled.section`
  display: flex;
  height: 44%;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
`;

const SelfSide = styled.section`
  display: flex;
  height: 44%;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
`;

const GameFunctions = styled.section`
  display: flex;
  height: 12%;
  align-items: center;
  justify-content: center;
`;

const GameFunctionsLeft = styled.div`
  display: flex;
`;

const GameFunctionsCentre = styled.div`
  display: flex;
  flex-flow: wrap;
  justify-content: center;
  text-align: center;
  width: 25%;
  height: 100%;
  margin: 0 10px;
  /* font-size: 2vw; */
`;

const GameFunctionsRight = styled.div`
  display: flex;
`;

const AutoPlayButton = styled.button`
  margin-right: 3vw;
  width: 75px;
  font-family: "Playfair Display", serif;
`;

const NextButton = styled.button`
  margin-right: 3vw;
  width: 80px;
  font-family: "Playfair Display", serif;
`;

const ResetButton = styled.button`
  margin: 0 3vw;
  width: 75px;
  font-family: "Playfair Display", serif;
`;

const GameStatusWon = styled.p`
  color: green;
  height: 40%;
  padding-top: 3%;
`;

const GameStatusLost = styled.p`
  color: red;
  height: 40%;
  padding-top: 3%;
`;

const GameStatusStart = styled.p`
  color: blue;
  height: 40%;
  padding-top: 3%;
`;

const GameText = styled.p`
  display: flex;
  align-items: center;
  height: 60%;
  padding-bottom: 2%;
`;

const LineBreak = styled.div`
  width: 100%;
  height: 0px;
`;

const Rounds = styled.div`
  width: 80px;
  color: white;
  font-family: "Playfair Display", serif;
`;

export default FullDeck;
