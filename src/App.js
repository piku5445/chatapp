
import React, { useEffect } from "react";
import { Box,Button, Container, VStack, Input, HStack } from "@chakra-ui/react";
import Message from "./Components/message.jsx";
import {onAuthStateChanged,getAuth,GoogleAuthProvider,signInWithPopup,signOut } from "firebase/auth"
import { useState ,useRef} from "react";
import {app} from "./firebase.js"
import { getFirestore, collection, addDoc, serverTimestamp,onSnapshot ,query,orderBy,deleteDoc,getDocs,writeBatch} from "firebase/firestore"

const auth=getAuth(app);
const db= getFirestore(app)
const logoutHandler=()=> signOut(auth)
const loginhandler=()=>{
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
}

function App() {
  
  const [user,setuser]=useState(false)
  const [message,setmessage]=useState("")
  const[messages,setmessages]=useState([])
  const divForScroll=useRef(null)
  const submitHandler=async(e)=>{
    e.preventDefault()
    try{
  await addDoc(collection(db,"messages"),{
  text:message,
  uid:user.uid,
  uri:user.photoURL,
  createdAt:serverTimestamp()
  })
  setmessage("")
  divForScroll.current.scrollIntoView({behaviour:"smooth"});
    }
    catch(error){
  alert(error)
    }
  
  }

  
  useEffect(() => {
    //console.log(user)

    const unsubscribe =   onAuthStateChanged(auth, (data) => {
    setuser(data)
  })
  const q = query(collection(db, "messages"), orderBy('createdAt', "asc"));
  const unsubscribeForMessage=onSnapshot(
  //  collection(db,"messages"),
  q,
    (snap)=>{
      setmessages(
      snap.docs.map((item) => {
      const id=item.id
      return {id,...item.data() }
    })
  );
  console.log("Messages Fetched", snap.docs.map(doc => doc.data()))

  });
  return ()=>{
    unsubscribe()
    unsubscribeForMessage()
  }
},[]);
const clearAllData=async ()=>{
 // const querySnapshot = await getDocs(collection(db, "messages"));
  const batch=writeBatch(db)
  const q = query(collection(db, "messages"));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc)=>{
    batch.delete(doc.ref)
  })
  await batch.commit()

  console.log("all message deleted successfully")
}

//   useEffect(()=>{
// onAuthStateChanged(auth,(data)=>{
//   console.log(data)
// })
//   })
  return (
    <Box bg="red.50" minH="100vh">
      {
        user?(
          <Container bg="white" h="100vh" py={4}>
        <VStack h="full" p={4} spacing={4}>
          <Button onClick={logoutHandler} colorScheme="red" w="full">
            Logout
          </Button>
          
            {/* <Message user="me" text="sample message"  />
            <Message text="sample message" />
            <Message text="sample message" />
            <Message text="sample message" />
            <Message text="sample message" />
            <Message text="sample message" /> */}
            <VStack h="full" w="full" spacing={4} align="stretch" overflow={"auto"} css={{"&::-webkit-scrollbar":{
              display:"none"
            }}}>
            {
              messages.map(item=>{
                return (<Message 
                key={item.id}
                text={item.text} 
                uri={item.uri} 
                user={item.uid === user.uid ? "me" : "other" 

                }
                />
              );
              })
            }
            {/* <Message user="me" text="sample message" /> */}
            <div ref={divForScroll}>

          </div>
          </VStack>
          
          <form  onSubmit={submitHandler} style={{ width: "100%" }}>
            <HStack border={"1px black"} textColor={"black"}>
              <Input value={message} placeholder={"Enter the message"} onChange={(e)=>setmessage(e.target.value)} />
              <Button colorScheme="purple" type="submit">
                Send
              </Button>
            </HStack>
          </form>
          <Button onClick={clearAllData} colorScheme="red">Clear all messages</Button>
        </VStack>
      </Container>
        ):<VStack  justifyContent={"center"} h="100v">
          <Button onClick={loginhandler}  colorScheme={"blue"}>
            sign with google
          </Button>
        </VStack>
      }
    </Box>
  );
}

export default App;