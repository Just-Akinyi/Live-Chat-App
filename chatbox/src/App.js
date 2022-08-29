// import './App.css';

import firebase from 'firebase/app';
// for database
import 'firebase/firestore';
//for user authentication
import 'firebase/auth';

import {userAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

//to initialize and configure the project
firebase.initializeApp({
  apiKey: "AIzaSyBEUkwc7lXTMkMVj0rAM2GHEnhYkMqYkAY",
  authDomain: "chatbox-96c02.firebaseapp.com",
  projectId: "chatbox-96c02",
  storageBucket: "chatbox-96c02.appspot.com",
  messagingSenderId: "493065076072",
  appId: "1:493065076072:web:797ade6975a6b509f9eadd",
  measurementId: "G-XDE5HK617K"
});
const auth = firebase.auth();
const firestore = firebase.firestore();

const [user] =userAuthState(auth);

function SignIn(){
  const SignInWithGoogle = () =>{
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.SignInWithPopup(provider);

    return(
    <button onClick={SignInWithGoogle}>Sign In With Google</button>
  )};
};

function SignOut(){
  return auth.currentUser && (
    <button onClick={()=>auth.SignOut()}>Sign Out</button>
  )
};

function ChatRoom(){
  const dummy = useRef();
  //query documents in a collection
  const messagesRef =  firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt'.limit(25));

  const [messages] = useCollectionData(query,{idField: 'id'});
  const [formValue, setFormValue] = useState('');
  const sendMessage = async(e)=> {
    e.preventDefault();
    const {uid,photoURL} = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimeStamp(),
      uid,
      photoURL
    });
    setFormValue('');
    dummy.current.scrollIntoView({behaviour: 'smooth'});
    return(
      <>
      <main>
        {message && messages.map(msg=><ChatMessage key={msg.id} message = {msg}></ChatMessage>)};
        <div>ref={dummy}</div>
        <form onSubmit={sendMessage}>
          <input value={formValue} onChange={(e)=>setFormValue(e.target.value)}/>
          <button type='submit'>Submit</button>
        </form>
      </main>
      </>
    )
  };
}

function ChatMessage(props){
  const {text,uid, photoURL} = props.message;
  const messageClass = uid === auth.currentUser.id ? 'sent' : 'received'
  return(
    <>
    <div className={`message ${messageClass}`}></div>
    <img src={photoURL}/>
    <p>{text}</p>
    </>
  )
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <section>
          {user ? <ChatRoom/> : <SignIn/>}
        </section>
      </header>
    </div>
  );
}

export default App;
