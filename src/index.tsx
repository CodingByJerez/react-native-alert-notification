import { ALERT_TYPE } from './config/ENV';
import { Dialog, IConfigDialog, IConfigToast, Root } from './containers';
import { Toast } from './containers';

export { Dialog, Toast, Root };
export { Dialog as AlertNotificationDialog, Toast as AlertNotificationToast, Root as AlertNotificationRoot, ALERT_TYPE, IConfigDialog, IConfigToast };

export default { Dialog, Toast, Root, ALERT_TYPE };
