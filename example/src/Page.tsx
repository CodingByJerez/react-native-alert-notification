import React from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
} from 'react-native';
// @ts-ignore
import {ALERT_TYPE, Dialog, Toast} from 'react-native-alert-notification';

const _textBody = (page: string): string =>
  `congratulations you can observe the ${page} notification :)`;

const DATA = [
  {
    title: 'DIALOG BOX',
    data: [
      {
        title: 'success',
        onPress: () =>
          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'success',
            button: 'ok',
            textBody: _textBody('success'),
          }),
      },
      {
        title: 'warning',
        onPress: () =>
          Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: 'warning',
            button: 'ok',
            textBody: _textBody('warning'),
          }),
      },
      {
        title: 'danger',
        onPress: () =>
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'danger',
            button: 'ok',
            textBody: _textBody('danger'),
          }),
      },
      {
        title: 'no button',
        onPress: () =>
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'danger',
            textBody: _textBody('danger'),
          }),
      },
      {
        title: 'callback Press Button',
        onPress: () =>
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'Press Button',
            textBody: _textBody('danger'),
            button: 'action',
            onPressButton: () =>
              Dialog.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'callback',
                button: 'cool',
                textBody: _textBody('CALLBACK'),
              }),
          }),
      },
      {
        title: 'disable closeOnOverlayTap',
        onPress: () =>
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'closeOnOverlayTap',
            textBody: _textBody('closeOnOverlayTap'),
            button: 'close',
            closeOnOverlayTap: false,
          }),
      },
      {
        title: 'auto close countdown',
        onPress: () =>
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'countdown',
            textBody: _textBody('auto close countdown bay default 5000ms'),
            closeOnOverlayTap: false,
            autoClose: true, // or time in ms
          }),
      },
      {
        title: 'callback show and hide',
        onPress: () =>
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'show and hide callback',
            textBody: _textBody('callback show and hide'),
            button: 'close',
            onShow: () => Alert.alert('show is call after end animation'),
            onHide: () => Alert.alert('hide is call after end animation'),
          }),
      },
    ],
  },

  {
    title: 'TOAST NOTIFICATION',
    data: [
      {
        title: 'success',
        onPress: () =>
          Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'success',
            textBody: _textBody('success'),
          }),
      },
      {
        title: 'warning',
        onPress: () =>
          Toast.show({
            type: ALERT_TYPE.WARNING,
            title: 'warning',
            textBody: _textBody('warning'),
          }),
      },
      {
        title: 'danger',
        onPress: () =>
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: 'danger',
            textBody: _textBody('danger'),
          }),
      },
      {
        title: 'callback Press card',
        onPress: () =>
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: 'Press card',
            textBody: _textBody('Press card'),
            onPress: () =>
              Toast.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Press card callback',
                textBody: _textBody('Press card callback'),
              }),
          }),
      },
      {
        title: 'Auto close Change duration',
        onPress: () =>
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: 'countdown',
            textBody: _textBody('auto close countdown by default 5000ms'),
            autoClose: 10000, // or time in ms by default 5000
            // onPress: () => Toast.hide(),
          }),
      },
      {
        title: 'disable auto close',
        onPress: () =>
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: 'countdown',
            textBody: _textBody('auto close is disable'),
            autoClose: false,
          }),
      },
      {
        title: 'callback show and hide',
        onPress: () =>
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: 'show and hide callback',
            textBody: _textBody('callback show and hide'),
            autoClose: 2000,
            onShow: () => Alert.alert('show is call after end animation'),
            onHide: () => Alert.alert('hide is call after end animation'),
          }),
      },
    ],
  },
];

const Page = () => {
  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={DATA}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item}) => <Button {...item} />}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.header}>{title}</Text>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginTop: 24,
    alignSelf: 'center',
  },
});

export default Page;
