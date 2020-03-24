import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import app from 'firebase/app';
import firebase from 'firebase';
import 'firebase/auth';

export const FirebaseContext = createContext({});

export const FirebaseProvider = props => {
  const { children } = props;
  const auth = app.auth();

  const authDefaultState = {
    uid: null,
    displayName: null,
    IDToken: null,
    waitingForLogin: true,
  };

  const [authData, setAuthData] = useState(authDefaultState);

  const signOut = async () => {
    await auth.signOut();
    console.log('setting auth data to default');
    setAuthData(authDefaultState);
  };

  const getIDToken = async () => {
    try {
      return await firebase
        .auth()
        .currentUser.getIdToken(true)
        .then(idToken => idToken)
        .catch(async () => {
          await signOut();
          return null;
        });
    } catch {
      return null;
    }
  };

  const signInPopup = () => {
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
      });
  };

  const listenAuth = async () => {
    const unsubAuthState = auth.onAuthStateChanged(async authUser => {
      const tIDToken = await getIDToken();
      if (tIDToken) {
        if (authUser) {
          console.log(
            'setting auth data',
            JSON.stringify({
              uid: authUser.uid,
              displayName: authUser.displayName,
              IDToken: tIDToken,
              waitingForLogin: false,
            }),
          );
          setAuthData({
            uid: authUser.uid,
            displayName: authUser.displayName,
            IDToken: tIDToken,
            waitingForLogin: false,
          });
          return true;
        }
        console.log('setting auth data to default, post attempted login');
        setAuthData({ ...authDefaultState, waitingForLogin: false });
      } else {
        console.log('setting auth data to default, post attempted login');
        setAuthData({ ...authDefaultState, waitingForLogin: false });
      }
      return false;
    });
    return unsubAuthState;
  };

  useEffect(() => {
    listenAuth();
    // eslint-disable-next-line
  }, []);

  // Make the context object:
  const firebaseContext = {
    signInPopup,
    signOut,
    authData,
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
