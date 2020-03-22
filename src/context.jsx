import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import app from 'firebase/app';
import firebase from 'firebase';
import 'firebase/auth';

export const FirebaseContext = createContext({});

export const FirebaseProvider = props => {
  const { children } = props;
  const auth = app.auth();

  const [userCredential, setUserCredential] = useState(null);
  const [uid, setUid] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [IDToken, setIDToken] = useState(null);
  const [waitingForLogin, setWaitingForLogin] = useState(true);

  const signOut = async () => {
    await auth.signOut();
    setUserCredential(null);
  };

  const getIDToken = async () => {
    try {
      return await firebase
        .auth()
        .currentUser.getIdToken(true)
        .then(idToken => idToken)
        .catch(async () => {
          await signOut();
          setUid(null);
          return null;
        });
    } catch {
      setUid(null);
      return null;
    }
  };

  const signInPopup = async () => {
    const data = await firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        const authUser = await auth.signInWithPopup(provider);
        const tIDToken = await getIDToken();
        if (tIDToken) {
          setUserCredential(authUser);
          setUid(authUser.uid);
          setDisplayName(authUser.displayName);
          setIDToken(tIDToken);
          return [authUser, tIDToken];
        }
        setUid(null);
        return null;
      });
    return data;
  };

  const trySignInSilent = () => {
    auth.onAuthStateChanged(async user => {
      const tIDToken = await getIDToken();
      if (tIDToken) {
        if (user) {
          setUserCredential(user);
          setUid(user.uid);
          setDisplayName(user.displayName);
          setIDToken(tIDToken);
        } else {
          setUserCredential(null);
          setUid(null);
        }
      } else {
        setUserCredential(null);
        setUid(null);
      }
      setWaitingForLogin(false);
    });
  };

  useEffect(() => {
    trySignInSilent();
    // eslint-disable-next-line
  }, []);

  // Make the context object:
  const firebaseContext = {
    displayName,
    uid,
    userCredential,
    signInPopup,
    signOut,
    waitingForLogin,
    IDToken,
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
  authCredential: PropTypes.object,
};

FirebaseContext.defaultProps = {
  userLocs: null,
};
