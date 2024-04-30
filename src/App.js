import { useState, useEffect } from 'react';
import './App.css';
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';
import { SplendidGrandPiano } from "smplr";
import { AudioContext } from "standardized-audio-context";
import useScreenSize from './useScreenSize';
import abcjs from "abcjs"
import muted from './images/volume-mute.svg';
import sound from './images/volume-up.svg'
import { ReactComponent as Muted } from './images/volume-mute.svg'
import { ReactComponent as Sound } from './images/volume-up.svg'
import Navigation from './Navigation';
import {Container, Row, Col} from 'react-bootstrap';


function App() {
  const screenSize = useScreenSize();
  const lowNote = 'c4' // c4 == 60
  const highNote_lg = 'g5' // g5 == 81
  const highNote_sm = 'c5'
  const highNote = {
    'lg': 'g5',
    'md': 'g5',
    'sm': 'c5',
  }
  const firstNote = MidiNumbers.fromNote(lowNote);
  const lastNote = MidiNumbers.fromNote(highNote[getScreenSize()]);
  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote: firstNote,
    lastNote: lastNote,
    keyboardConfig: KeyboardShortcuts.HOME_ROW,
  });

  const [audioEnabled, setAudioEnabled] = useState(false);
  const [note, setNote] = useState("^G");
  const [title, setTitle] = useState("Sight Reader")
  const notes = "ABCDEFG";
  const accidentals = " ^_"
  const clefs = ["treble", "bass"]
  const [key, setKey] = useState("C");
  const [difficulty, setDifficulty] = useState(0); // Easy: 0, Medium: 1, Hard: 2,

  const [context, setContext] = useState(new AudioContext());
  const [piano, setPiano] = useState(new SplendidGrandPiano(context, { decayTime: 0.5 }));
  const [points, setPoints] = useState(0);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [soundIcon, setSoundIcon] = useState(muted);
  const [volume, setVolume] = useState(<Muted className='icon' fill='white' stroke='white'/>);

  
  // Animation
  // 0 = no animation
  // 1 = correct
  // 2 = incorrect
  const [wobble, setWobble] = useState(0)


  useEffect(() => {
    setVolume(<Muted onClick={toggleAudio} className='icon mx-2' fill='white' stroke='white'/>)
  }, [])

  // C' = C up an octave
  // C, = C down an octave
  // Everything divided in lengths of 8. C8 is whole note, C is quarter
  useEffect(() => {
    var abcString = "K:"+key+"\nK: clef=treble\n"+note+"8";
    abcjs.renderAbc("paper", abcString, { 
      scale: getSizedScale(),
      staffwidth: getSizedKeyboard(),
      paddingleft: 50,
      preferredMeasuresPerLine: 4,
      selectionColor: "black",
    });
  }, [note])

  function getScreenSize() {
    if(window.innerWidth >= 992) {
      return "lg"
    } else if(window.innerWidth >= 768) {
      return "md"
    } else {
      return "sm" 
    }
  }
  
  function getSizedScale() {
    let size = getScreenSize()
    switch(size) {
      case 'lg':
        return 3;
      case 'md':
        return 3;
      case 'sm':
        return 2;
      default:
        return 2
    }
  }

  function getSizedKeyboard() {
    let size = getScreenSize()
    switch(size) {
      case 'lg':
        return 600;
      case 'md':
        return (window.innerWidth - 20);
      case 'sm':
        return (window.innerWidth - 20);
      default:
        return (window.innerWidth - 20)
    }
  }

  function checkNote(midiNumber) {
    if((
      (note.includes("_")*-1)+
      (note.includes("^")*1)+
      (MidiNumbers.fromNote(note+"0")-12)) === midiNumber % 12) {
      setTitle("Correct!")
      setPoints(points + 1);
      addCheckAnimation(1);
    } else {
      setTitle("Incorrect.")
      addCheckAnimation(2);
    }
    setScore(Math.floor(100*(points/(total+1))));
    setTotal(total + 1);

    let newAccidental = accidentals.charAt(Math.floor(Math.random()*accidentals.length))
    let newNote = notes.charAt(Math.floor(Math.random()*notes.length))
    setNote(newAccidental+newNote)
  }

  async function addCheckAnimation(correct) {
    let paper = document.getElementById("checker")
    let check = document.createElement("div")
    check.style.opacity = 1;
    if(correct === 1) {
      check.className = "check right";
    } else {
      check.className = "check wrong";
    }

    paper.appendChild(check);
    setInterval(function() {
      var opacity = check.style.opacity;
      if (opacity > 0) {
         opacity -= 0.1;
         check.style.opacity = opacity;
      } else {
        check.remove();
      }
   }, 100);    
  }

  function resetScore() {
    setPoints(0);
    setTotal(0);
    setScore(0);
  }

  const toggleAudio = () => {
    if (context.state === 'suspended') {
      context.resume();
      if(!audioEnabled) {
        piano.load.then(() => {
          console.log("piano loaded");
        });
        setAudioEnabled(true);
      }
      console.log(context.state)
      setContext(context);
      setSoundIcon(sound);
      setVolume(<Sound className='icon mx-2' onClick={toggleAudio} fill='white' stroke='white'/>)
    } else {
      setSoundIcon(muted);
      setAudioEnabled(false);
      context.suspend();
      setContext(context);
      setVolume(<Muted className='icon mx-2' onClick={toggleAudio} fill='white' stroke='white'/>)
    }
  };

  return (
    <>
    <Navigation
      points={points}
      total={total}
      score={score}
      sound={soundIcon}
      toggleAudio={toggleAudio}
      resetScore={resetScore}
      volume={volume}
    />
    <Container responsive className='App'>
    <Row className='mt-5'>
      <div className='staff-container'>
      <div className='staff'>
        <div id="checker"></div>
        <div className='w-100' id="paper"></div>
      </div>
      </div>
    </Row>
    <Row id="pno">
      <Col>
      <Piano 
        className='mx-auto'
        noteRange={{ first: firstNote, last: lastNote }}
        playNote={(midiNumber) => {
          if(audioEnabled) piano.start({ note: midiNumber, velocity: 80, time: 0, duration: 1 });
        }}
        stopNote={(midiNumber) => {
          checkNote(midiNumber)
        }}
        width={getSizedKeyboard()}
        keyboardShortcuts={keyboardShortcuts}
      />
      </Col>
      </Row>
      </Container>
    </>
  );
}

export default App;
