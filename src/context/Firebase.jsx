import { createContext, useContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const FirebaseContext = createContext(null);

 const firebaseConfig = {
 apiKey: "AIzaSyDq2yGddyl2Uf643tofwzd-JvtVhEnjIps",
 authDomain: "bookstore-691ba.firebaseapp.com",
projectId: "bookstore-691ba",
storageBucket: "bookstore-691ba.appspot.com",
messagingSenderId: "689426207880",
appId: "1:689426207880:web:f5531b887c771754053b3d",
databaseURL:"https://bookstore-691ba-default-rtdb.firebaseio.com",

   };
  export const app = initializeApp(firebaseConfig)

  export const useFirebase = () => useContext(FirebaseContext);

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

const googleProvider = new GoogleAuthProvider();

export const FirebaseProvider = (props) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
   onAuthStateChanged(firebaseAuth, (user) => {
     if (user) setUser(user);
     else setUser(null);
   });
 }, []);
 const signupUserWithEmailAndPassword = (email, password) =>
   createUserWithEmailAndPassword(firebaseAuth, email, password);

 const singinUserWithEmailAndPass = (email, password) =>
   signInWithEmailAndPassword(firebaseAuth, email, password);

 const signinWithGoogle = () => signInWithPopup(firebaseAuth, googleProvider);

 const handleCreateNewListing = async (name, isbn, price, coverPic) => {
   const imageRef = ref(storage, `uploads/images/${Date.now()}-${coverPic.name}`);
   const uploadResult = await uploadBytes(imageRef, coverPic);
   return await addDoc(collection(firestore, "books"), {
     name,
     isbn,
     price,
     imageURL: uploadResult.ref.fullPath,
     userID: user?.uid ?? 'Shweta',
     userEmail: user?.email ?? "shweta@gmail.com",
     displayName: user?.displayName ?? "Shweta",
     photoURL: user?.photoURL ?? null,
   });
 };

 const listAllBooks = () => {
   return getDocs(collection(firestore, "books"));
 };

 const getBookById = async (id) => {
   const docRef = doc(firestore, "books", id);
   const result = await getDoc(docRef);
   return result;
 };

 const getImageURL = (path) => {
   return getDownloadURL(ref(storage, path));
 };

 const placeOrder = async (bookId, qty) => {
   const collectionRef = collection(firestore, "books", bookId, "orders");
   const result = await addDoc(collectionRef, {
     userID: user.uid,
     userEmail: user.email,
     displayName: user.displayName,
     photoURL: user.photoURL,
     qty: Number(qty),
   });
   return result;
 };

 const fetchMyBooks = async (userId) => {
   const collectionRef = collection(firestore, "books");
   const q = query(collectionRef, where("userID", "==", userId));

   const result = await getDocs(q);
   return result;
 };

 const getOrders = async (bookId) => {
   const collectionRef = collection(firestore, "books", bookId, "orders");
   const result = await getDocs(collectionRef);
   return result;
 };

 const isLoggedIn = user ? true : false;

 return (
   <FirebaseContext.Provider
     value={{
       signinWithGoogle,
       signupUserWithEmailAndPassword,
       singinUserWithEmailAndPass,
       handleCreateNewListing,
       listAllBooks,
       getImageURL,
       getBookById,
       placeOrder,
       fetchMyBooks,
       getOrders,
       isLoggedIn,
       user,
     }}
   >
     {props.children}
   </FirebaseContext.Provider>
 );
};