import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

const apiUrl = 'https://api.frontendexpert.io/api/fe/wordle-words';
const WORD_LENGTH = 5;


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
      const response = await fetch(apiUrl);
      const words = (await response.json()).words;
      const randomWord = words[Math.floor(Math.random()*words.length)];
      const newMap = new Map<string, number>();
      for(let i=0; i< randomWord.length; i++){
        let val = newMap.get(randomWord[i]) || 0;
        newMap.set(randomWord[i], val+1);
      }
      setCharFreqMap(newMap);
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
