import type { ImageRequireSource } from 'react-native';
import { ALERT_TYPE } from '../config/ENV';
import type { IConfigDialog } from '../containers/Dialog';

export const getImage = (type: IConfigDialog['type']): ImageRequireSource => {
  switch (type) {
    case ALERT_TYPE.SUCCESS:
      return require('../assets/success.png');
    case ALERT_TYPE.WARNING:
      return require('../assets/warning.png');
    case ALERT_TYPE.DANGER:
      return require('../assets/danger.png');
  }
};
