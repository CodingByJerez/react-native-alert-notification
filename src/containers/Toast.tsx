import * as React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { ALERT_TYPE } from '../config';
import { ToastRender } from './ToastRender';

//export type IModelFunc = (args: { isDark: boolean; type?: ALERT_TYPE; title?: string; description?: string }) => ReactElement;

export type IConfigToast = {
  autoClose?: number | boolean;

  type?: ALERT_TYPE;
  title?: string;
  textBody?: string;
  titleStyle?: StyleProp<TextStyle>;
  textBodyStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  onShow?: () => void;
  onHide?: () => void;
};

type IProps = {
  isDark: boolean;
  config?: Pick<IConfigToast, 'autoClose' | 'titleStyle' | 'textBodyStyle'>;
};

type IState = {
  overlayClose?: boolean;
  data: null | (IConfigToast & { timeout: number });
};

export class Toast extends React.Component<IProps, IState> {
  /**
   * @type {React.RefObject<Toast>}
   */
  public static instance: React.RefObject<Toast> = React.createRef();

  /**
   * @param {IConfigToast} args
   */
  public static show = (args: IConfigToast): void => {
    Toast.instance.current?._open(args);
  };

  /**
   *
   */
  public static hide = (): void => {
    Toast.instance.current?._close();
  };

  constructor(props: IProps) {
    super(props);
    this.state = {
      data: null,
    };
  }

  /**
   * @param {IConfigToast} args
   * @return {Promise<void>}
   */
  private _open = async (data: IConfigToast): Promise<void> => {
    const { titleStyle, textBodyStyle } = this.props.config || {};
    const timeout: number = typeof data.autoClose === 'number' ? data.autoClose : data.autoClose === false ? 0 : 5000;
    await new Promise<void>((resolve) =>
      this.setState((prevState) => ({ ...prevState, data: { titleStyle, textBodyStyle, ...data, description: data.textBody, timeout } }), resolve)
    );
    this.state.data?.onShow?.();
  };

  /**
   * @return {Promise<void>}
   */
  private _close = async (): Promise<void> => {
    this._closedHandler();
  };

  private _closedHandler = async (): Promise<void> => {
    const onHide = this.state.data?.onHide;
    await new Promise<void>((resolve) => this.setState((prevState) => ({ ...prevState, data: null }), resolve));
    onHide?.();
  };

  public render() {
    const { data } = this.state;
    if (!data) {
      return null;
    }
    const { isDark, config: configGeneral } = this.props;
    return (
      <SafeAreaInsetsContext.Consumer>
        {(insets) => <ToastRender {...data} isDark={isDark} paddingTop={insets?.top} configGeneral={configGeneral} onClose={this._closedHandler} />}
      </SafeAreaInsetsContext.Consumer>
    );
  }
}
