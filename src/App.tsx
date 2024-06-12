import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

const apiUrl = 'https://api.frontendexpert.io/api/fe/wordle-words';
const WORD_LENGTH = 5;
const allWords = ["ALBUM","HINGE","MONEY","SCRAP","GAMER","GLASS","SCOUR","BEING","DELVE","YIELD","METAL","TIPSY","SLUNG","FARCE","GECKO","SHINE","CANNY","MIDST","BADGE","HOMER","TRAIN","STORY","HAIRY","FORGO","LARVA","TRASH","ZESTY","SHOWN","HEIST","ASKEW","INERT","OLIVE","PLANT","OXIDE","CARGO","FOYER","FLAIR","AMPLE","CHEEK","SHAME","MINCE","CHUNK","ROYAL","SQUAD","BLACK","STAIR","SCARE","FORAY","COMMA","NATAL","SHAWL","FEWER","TROPE","SNOUT","LOWLY","STOVE","SHALL","FOUND","NYMPH","EPOXY","DEPOT","CHEST","PURGE","SLOSH","THEIR","RENEW","ALLOW","SAUTE","MOVIE","CATER","TEASE","SMELT","FOCUS","TODAY","WATCH","LAPSE","MONTH","SWEET","HOARD","CLOTH","BRINE","AHEAD","MOURN","NASTY","RUPEE","CHOKE","CHANT","SPILL","VIVID","BLOKE","TROVE","THORN","OTHER","TACIT","SWILL","DODGE","SHAKE","CAULK","AROMA","CYNIC","ROBIN","ULTRA","ULCER","PAUSE","HUMOR","FRAME","ELDER","SKILL","ALOFT","PLEAT","SHARD","MOIST","THOSE","LIGHT","WRUNG","COULD","PERKY","MOUNT","WHACK","SUGAR","KNOLL","CRIMP","WINCE","PRICK","ROBOT","POINT","PROXY","SHIRE","SOLAR","PANIC","TANGY","ABBEY","FAVOR","DRINK","QUERY","GORGE","CRANK","SLUMP","BANAL","TIGER","SIEGE","TRUSS","BOOST","REBUS","UNIFY","TROLL","TAPIR","ASIDE","FERRY","ACUTE","PICKY","WEARY","GRIPE","CRAZE","PLUCK","BRAKE","BATON","CHAMP","PEACH","USING","TRACE","VITAL","SONIC","MASSE","CONIC","VIRAL","RHINO","BREAK","TRIAD","EPOCH","USHER","EXULT","GRIME","CHEAT","SOLVE","BRING","PROVE","STORE","TILDE","CLOCK","WROTE","RETCH","PERCH","ROUGE","RADIO","SURER","FINER","VODKA","HERON","CHILL","GAUDY","PITHY","SMART","BADLY","ROGUE","GROUP","FIXER","GROIN","DUCHY","COAST","BLURT","PULPY","ALTAR","GREAT","BRIAR","CLICK","GOUGE","WORLD","ERODE","BOOZY","DOZEN","FLING","GROWL","ABYSS","STEED","ENEMA","JAUNT","COMET","TWEED","PILOT","DUTCH","BELCH","OUGHT","DOWRY","THUMB","HYPER","HATCH","ALONE","MOTOR","ABACK","GUILD","KEBAB","SPEND","FJORD","ESSAY","SPRAY","SPICY","AGATE","SALAD","BASIC","MOULT","CORNY","FORGE","CIVIC","ISLET","LABOR","GAMMA","LYING","AUDIT","ROUND","LOOPY","LUSTY","GOLEM","GONER","GREET","START","LAPEL","BIOME","PARRY","SHRUB","FRONT","WOOER","TOTEM","FLICK","DELTA","BLEED","ARGUE","SWIRL","ERROR","AGREE","OFFAL","FLUME","CRASS","PANEL","STOUT","BRIBE","DRAIN","YEARN","PRINT","SEEDY","IVORY","BELLY","STAND","FIRST","FORTH","BOOBY","FLESH","UNMET","LINEN","MAXIM","POUND","MIMIC","SPIKE","CLUCK","CRATE","DIGIT","REPAY","SOWER","CRAZY","ADOBE","OUTDO","TRAWL","WHELP","UNFED","PAPER","STAFF","CROAK","HELIX","FLOSS","PRIDE","BATTY","REACT","MARRY","ABASE","COLON","STOOL","CRUST","FRESH","DEATH","MAJOR","FEIGN","ABATE","BENCH","QUIET","GRADE","STINK","KARMA","MODEL","DWARF","HEATH","SERVE","NAVAL","EVADE","FOCAL","BLUSH","AWAKE","HUMPH","SISSY","REBUT","CIGAR"]


function App() {
  const [wordGuessList, setWordGuessList] = useState<string[]>(Array(6).fill(null));
  const [selectedWord, setSelectedWord] = useState<string>('hello');
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [charFreqMap, setCharFreqMap] = useState<Map<string, number>>(new Map<string, number>());
  const [correctKeys, setCorrectKeys] = useState<Set<string>>(new Set<string>());
  const [absentKeys, setAbsentKeys] = useState<Set<string>>(new Set<string>());
  const [presentKeys, setPresentKeys] = useState<Set<string>>(new Set<string>());

  useEffect(() => {
    const handleType = (event: KeyboardEvent) => {
      // console.log(selectedWord.indexOf(event.key) === -1);
      // console.log("test");
      const oldGuess = currentGuess;
      if(isGameOver)
        return;
      if(event.key === 'Enter'){
        if(oldGuess.length !== WORD_LENGTH)
          return;
        const index = wordGuessList.findIndex(x => x == null);
        const wordList = [...wordGuessList];
        wordList[index] = currentGuess;
        setWordGuessList(wordList);
        setCurrentGuess('');
      }
      if(event.key === 'Backspace'){
        const guess = oldGuess.slice(0, -1);
        console.log(guess);
        setCurrentGuess(guess);
        return;
      }
      if(currentGuess === selectedWord)
        setIsGameOver(true);
      if(currentGuess.length >= 5){
        return;
      }
      const isLetter = event.key.match(/^[a-z]{1}$/) !== null;
      if(!isLetter)
        return;
      setCurrentGuess(oldGuess => oldGuess + event.key);   
      if(selectedWord.indexOf(event.key) === -1){
        console.log("test");
        const newAbsentKeys = new Set<string>([...absentKeys]);
        newAbsentKeys.add(event.key);
        console.log(newAbsentKeys);
        setAbsentKeys(newAbsentKeys);
      }
      if(selectedWord.indexOf(event.key) === currentGuess.length-1){
        const newCorrectKeys = new Set<string>([...correctKeys]);
        newCorrectKeys.add(event.key);
        if(presentKeys.has(event.key)){
          const newPresentKeys = new Set<string>([...presentKeys]);
          newPresentKeys.delete(event.key);
          setPresentKeys(newPresentKeys);
        }
        setCorrectKeys(newCorrectKeys);
      } else {
        const newPresentKeys = new Set<string>([...presentKeys]);
        newPresentKeys.add(event.key);
        setPresentKeys(newPresentKeys);
      }
      console.log(correctKeys.size);
      console.log(presentKeys.size);
      console.log(absentKeys.size);
    }    

    window.addEventListener('keydown', handleType);

    // Clean up function
    return () => window.removeEventListener('keydown', handleType);

  }, [currentGuess, isGameOver, selectedWord, wordGuessList])
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
  useEffect(() => {
    const fetchWord = async () => {
      let words = allWords;
      try{
        const response = await fetch(apiUrl);
        words = (await response.json()).words;
      } catch(err){
        console.log(err);
      }
      const randomWord = words[Math.floor(Math.random()*words.length)];
      const newMap = new Map<string, number>();
      for(let i=0; i< randomWord.length; i++){
        let val = newMap.get(randomWord[i]) || 0;
        newMap.set(randomWord[i], val+1);
      }
      setCharFreqMap(newMap);
      console.log(randomWord);
      setSelectedWord(randomWord.toLowerCase());
    }
    fetchWord();
  }, [])

  return (
    <div className="App">
      <div className='title'>
        <h1>WORDLE</h1>
      </div>
      {/* <p>{selectedWord}</p> */}
      <div className='board'>
        {
          wordGuessList.map((guess, i) =>{
            const isCurrentGuess = i === wordGuessList.findIndex(x => x == null); 
            return (
              <Line key={i} word={isCurrentGuess ? currentGuess : (guess ?? '')} 
                selectedWord={selectedWord} isCurrentGuess={isCurrentGuess} selectedWordFrequency={charFreqMap}/>
            )
          })
        }
      </div>
      {/* <div className='instructions'>
        
      </div>
      <div className='keyboard'>
        
      </div> */}
    </div>
  );
}

function Line({word, selectedWord, isCurrentGuess, selectedWordFrequency}: {word:string, selectedWord: string, isCurrentGuess: boolean, selectedWordFrequency: Map<string, number>}){
  const tiles = [];
  for(let i=0; i< WORD_LENGTH; i++){
    const char = word[i];
    let classname = "";
    if(!isCurrentGuess && char !== undefined ){
      if(selectedWord[i] === char){
        classname += " match";
      } else if(selectedWord.indexOf(char) !== -1){
        classname += " found";
      } else {
        classname += " notfound";
      }
    }
    tiles.push(
      <div key={i} className={`${classname} character`}>{char}</div>
    )
  }

  return (
    <div className='word'>
      {tiles}
    </div>
  );
}


export default App;
