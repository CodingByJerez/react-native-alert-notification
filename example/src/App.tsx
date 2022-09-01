import React from 'react';
// @ts-ignore
import {AlertNotificationRoot} from 'react-native-alert-notification';
import Page from './Page';

const App = () => {
  return (
    <AlertNotificationRoot>
      <Page />
    </AlertNotificationRoot>
  );
};

export default App;
