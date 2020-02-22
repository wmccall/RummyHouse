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
    // eslint-disable-next-line
  }, []);

  const [userCredential, setUserCredential] = useState(null);
  const [IDToken, setIDToken] = useState(null);
  const [waitingForLogin, setWaitingForLogin] = useState(true);

  const getIDToken = async () => {
    try {
      return await firebase
        .auth()
        .currentUser.getIdToken(true)
        .then(idToken => idToken)
        .catch(async _ => {
          await signOut();
          return null;
        });
    } catch {
      return null;
    }
  };

  const signInPopup = async () => {
    const data = await firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(async () => {
        var provider = new firebase.auth.GoogleAuthProvider();
        const authUser = await auth.signInWithPopup(provider);
        var tIDToken = await getIDToken();
        if (tIDToken) {
          setUserCredential(authUser);
          setIDToken(tIDToken);
          return [authUser, tIDToken];
        } else {
          return null;
        }
      });
    return data;
  };

  const signOut = async () => {
    await auth.signOut();
    setUserCredential(null);
  };

  const isLoggedIn = !!userCredential;

  const trySignInSilent = () => {
    auth.onAuthStateChanged(async user => {
      var tIDToken = await getIDToken();
      if (tIDToken) {
        if (user) {
          setUserCredential(user);
          setIDToken(tIDToken);
        } else {
          setUserCredential(null);
        }
      } else {
        setUserCredential(null);
      }
      setWaitingForLogin(false);
    });
  };

  // Make the context object:
  const firebaseContext = {
    userCredential,
    signInPopup,
    signOut,
    waitingForLogin,
    isLoggedIn,
    IDToken,
    firebase
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
