import { Dimensions } from 'react-native';

const WINDOWS = Dimensions.get('window');
const WIDTH = WINDOWS.width;
const HEIGHT = WINDOWS.height;

enum ACTION {
  OPEN,
  CLOSE,
}

enum ALERT_TYPE {
  SUCCESS = 'SUCCESS',
  DANGER = 'DANGER',
  WARNING = 'WARNING',
}

enum TOAST_POSITION {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
}

const ENV = {
  AUTO_CLOSE: 5000,
  WINDOWS: {
    WIDTH,
    HEIGHT,
  },
  COLORS: {
    label: {
      ios: 'label',
      android: ['@android:color/primary_text_light', '@android:color/primary_text_dark'],
      default: ['rgb(229,229,231)', 'rgb(32,32,35)'],
    },
    card: {
      ios: 'systemGray6',
      android: ['@android:color/background_light', '@android:color/background_dark'],
      default: ['rgb(216,216,220)', 'rgb(54,54,56)'],
    },
    overlay: {
      ios: 'black',
      android: ['@android:color/background_dark', '@android:color/background_dark'],
      default: ['#000000', '#000000'],
    },
    success: {
      ios: 'systemGreen',
      android: ['@android:color/holo_green_light', '@android:color/holo_green_dark'],
      default: ['rgb(52,199,85)', 'rgb(48,209,88)'],
    },
    danger: {
      ios: 'systemRed',
      android: ['@android:color/holo_red_light', '@android:color/holo_red_dark'],
      default: ['rgb(255,59,48)', 'rgb(255,69,58)'],
    },
    warning: {
      ios: 'systemOrange',
      android: ['@android:color/holo_orange_light', '@android:color/holo_orange_dark'],
      default: ['rgb(255,149,0)', 'rgb(255,159,10)'],
    },
  },
};

export { ENV, ALERT_TYPE, TOAST_POSITION, ACTION };
