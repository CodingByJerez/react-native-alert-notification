import * as React from 'react';
import { Animated, Image, Pressable, StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import ENV, { ACTION, ALERT_TYPE } from '../config/ENV';
import { getImage } from '../service';
import Color from '../service/color';

export type IConfig = {
  type?: ALERT_TYPE;
  // position?: TOAST_POSITION;
  title?: string;
  textBody?: string;
  titleStyle?: StyleProp<TextStyle>;
  textBodyStyle?: StyleProp<TextStyle>;
  autoClose?: number | boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  onShow?: () => void;
  onHide?: () => void;
};

type IProps = {
  isDark: boolean;
  config?: Pick<IConfig, 'autoClose' | 'titleStyle' | 'textBodyStyle'>;
};

type IState = {
  styles: ReturnType<typeof __styles>;
  cardHeight: number;
  overlayClose?: boolean;
  visible: boolean;
  config?: IConfig;
};
class Toast extends React.Component<IProps, IState> {
  /**
   * @type {React.Context<EdgeInsets | null>}
   */
  static contextType = SafeAreaInsetsContext;

  /**
   * @type {React.RefObject<Toast>}
   */
  public static instance: React.RefObject<Toast> = React.createRef();

  /**
   * @param {IConfig} args
   */
  public static show = (args: IConfig): void => {
    Toast.instance.current?._open(args);
  };

  /**
   *
   */
  public static hide = (): void => {
    Toast.instance.current?._close();
  };

  /**
   * @type {React.ContextType<typeof SafeAreaInsetsContext>}
   */
  //@ts-ignore
  public context: React.ContextType<typeof SafeAreaInsetsContext>;

  /**
   * @type {Animated.Value}
   * @private
   */
  private _positionToast: Animated.Value;

  /**
   * @type {number}
   * @private
   */
  private _cardHeight: number;

  /**
   * @type {NodeJS.Timeout}
   * @private
   */
  private _timeout?: NodeJS.Timeout;

  /**
   * @param {IProps} props
   * @param {React.ContextType<typeof SafeAreaInsetsContext>} context
   */
  constructor(props: IProps, context: React.ContextType<typeof SafeAreaInsetsContext>) {
    super(props, context);
    this._cardHeight = 0;
    this._positionToast = new Animated.Value(-500);
    this.state = {
      styles: __styles(props.isDark),
      visible: false,
      cardHeight: 0,
    };
  }

  /**
   * @param {Readonly<IProps>} prevProps
   */
  public componentDidUpdate = (prevProps: Readonly<IProps>): void => {
    if (prevProps.isDark !== this.props.isDark) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState((prevState) => ({
        ...prevState,
        styles: __styles(this.props.isDark),
      }));
    }
  };

  /**
   * @param {IConfig} args
   * @return {Promise<void>}
   */
  private _open = async (args: IConfig): Promise<void> => {
    if (this.state.visible) {
      if (this._timeout) {
        clearTimeout(this._timeout);
      }
      await this._startAnimation(ACTION.CLOSE);
    }
    this._positionToast = new Animated.Value(-500);
    await new Promise<void>((resolve) => this.setState((prevState) => ({ ...prevState, visible: true, config: args }), resolve));
    await this._startAnimation(ACTION.OPEN);

    const autoClose = this.state.config?.autoClose !== undefined ? this.state.config?.autoClose : this.props.config?.autoClose;
    if (autoClose || autoClose === undefined) {
      const duration = typeof autoClose === 'number' ? autoClose : ENV.AUTO_CLOSE;
      this._timeout = setTimeout(() => this._close(), duration);
    }
    this.state.config?.onShow?.();
  };

  /**
   * @return {Promise<void>}
   */
  private _close = async (): Promise<void> => {
    await this._startAnimation(ACTION.CLOSE);
    const onHide = this.state.config?.onShow;
    await new Promise<void>((resolve) => this.setState((prevState) => ({ ...prevState, visible: false, config: undefined }), resolve));
    onHide?.();
  };

  /**
   * @param {ACTION} action
   * @return {Promise<void>}
   */
  private _startAnimation = (action: ACTION): Promise<void> => {
    return new Promise((resolve) => {
      Animated.timing(this._positionToast, {
        toValue: action === ACTION.OPEN ? this.context?.top ?? 0 : -this._cardHeight,
        duration: 250,
        useNativeDriver: true,
      }).start(() => resolve());
    });
  };

  /**
   * @return {JSX.Element}
   */
  private _CardRender = (): JSX.Element => {
    const { styles } = this.state;
    const { config } = this.props;

    if (this.state.config) {
      const { type, title, textBody, onPress, onLongPress, titleStyle: titleCustomStyle, textBodyStyle: textBodyCustomStyle } = this.state.config;

      const titleStyle = titleCustomStyle || config?.titleStyle;
      const textBodyStyle = textBodyCustomStyle || config?.textBodyStyle;
      return (
        <Animated.View
          onLayout={({
            nativeEvent: {
              layout: { height },
            },
          }) => (this._cardHeight = height)}
          style={StyleSheet.flatten([styles.cardRow, { transform: [{ translateY: this._positionToast }] }])}
        >
          <Pressable style={styles.cardContainer} onPress={onPress} onLongPress={onLongPress}>
            {type && (
              <>
                <View style={styles.backendImage} />
                <Image source={getImage(type)} resizeMode="contain" style={StyleSheet.flatten([styles.image, styles[`${type}Image`]])} />
              </>
            )}
            {/* eslint-disable-next-line react-native/no-inline-styles */}
            <View style={{ overflow: 'hidden', flex: 1 }}>
              {title && <Text style={StyleSheet.flatten([styles.titleLabel, titleStyle])}>{title}</Text>}
              {textBody && <Text style={StyleSheet.flatten([styles.descLabel, textBodyStyle])}>{textBody}</Text>}
            </View>
          </Pressable>
        </Animated.View>
      );
    }
    return <></>;
  };

  /**
   * @return {JSX.Element}
   */
  public render = (): JSX.Element => {
    const { visible } = this.state;
    const { _CardRender } = this;
    if (!visible) {
      return <></>;
    }
    return <_CardRender />;
  };
}

const __styles = (isDark: boolean) =>
  StyleSheet.create({
    backgroundContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: '#00000070',
    },

    container: {
      position: 'absolute',
      backgroundColor: '#00000030',
      top: 0,
      left: 0,
      right: 0,
    },

    cardRow: {
      zIndex: 9999,
      position: 'absolute',
      left: 0,
      right: 0,
    },

    cardContainer: {
      flexDirection: 'row',
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingTop: 12,
      paddingBottom: 12,
      marginHorizontal: 12,
      marginBottom: 12,
      backgroundColor: Color.get('card', isDark),
    },

    titleLabel: {
      fontWeight: 'bold',
      fontSize: 18,
      color: Color.get('label', isDark),
    },
    descLabel: {
      color: Color.get('label', isDark),
    },
    backendImage: {
      position: 'absolute',
      alignSelf: 'center',
      height: 12,
      width: 12,
      backgroundColor: '#FBFBFB',
      borderRadius: 100,
      left: 12 + 7,
    },
    image: {
      alignSelf: 'center',
      width: 25,
      aspectRatio: 1,
      marginRight: 12,
    },

    [`${ALERT_TYPE.SUCCESS}Image`]: {
      tintColor: Color.get('success', isDark),
    },
    [`${ALERT_TYPE.DANGER}Image`]: {
      tintColor: Color.get('danger', isDark),
    },
    [`${ALERT_TYPE.WARNING}Image`]: {
      tintColor: Color.get('warning', isDark),
    },
  });

export default Toast;
