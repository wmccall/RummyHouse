import React, { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import app from "firebase/app";
import firebase from "firebase";
import "firebase/auth";

export const FirebaseContext = createContext({});

export const FirebaseProvider = props => {
  const { children } = props;
  const auth = app.auth();

  useEffect(() => {
    trySignInSilent();
  }, []);

  const [userCredential, setUserCredential] = useState(null);

  const signInPopup = async () => {
    console.log("pop up signin");
    const authUser = firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(async () => {
        var provider = new firebase.auth.GoogleAuthProvider();
        const authUser = await auth.signInWithPopup(provider);
        setUserCredential(authUser);
        console.log(authUser);
        return authUser;
      });
    return authUser;
  };

  const signOut = async () => {
    console.log("log out");
    await auth.signOut();
  };

  const trySignInSilent = () => {
    auth.onAuthStateChanged(function(user) {
      if (user) {
        console.log("logged in");
        console.log(user);
        setUserCredential(user);
      } else {
        console.log("NOT logged in");
      }
    });
  };

  // Make the context object:
  const firebaseContext = {
    userCredential,
    signInPopup,
    signOut
  };

  // pass the value in provider and return
  return (
    <FirebaseContext.Provider value={firebaseContext}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const { Consumer } = FirebaseContext;

FirebaseContext.propTypes = {
  authCredential: PropTypes.object
};

FirebaseContext.defaultProps = {
  userLocs: null
};
