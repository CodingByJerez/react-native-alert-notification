import { ImageRequireSource } from 'react-native';
import { ALERT_TYPE } from '../config/ENV';
import { IConfig } from '../containers/Dialog';

const getImage = (type: IConfig['type']): ImageRequireSource => {
  switch (type) {
    case ALERT_TYPE.SUCCESS:
      return require('../assets/success.png');
    case ALERT_TYPE.WARNING:
      return require('../assets/warning.png');
    case ALERT_TYPE.DANGER:
      return require('../assets/danger.png');
  }
};

export default getImage;
