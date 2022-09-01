import * as React from 'react';
import { Animated, Image, LayoutChangeEvent, PanResponder, Platform, StyleSheet, Text, View, StyleProp, TextStyle } from 'react-native';
import { Color, getImage } from '../service';
import { ALERT_TYPE } from '../config';

interface IProps {
  isDark: boolean;
  paddingTop?: number;
  type?: ALERT_TYPE;
  title?: string;
  description?: string;
  timeout: number;
  onPress?: () => void;
  onClose(): void;
  configGeneral: any;

  titleStyle?: StyleProp<TextStyle>;
  textBodyStyle?: StyleProp<TextStyle>;
}

interface IState {
  isInit: boolean;
  styles: ReturnType<typeof __styles>;
}

export class ToastRender extends React.Component<IProps, IState> {
  private _heightContainer: number;
  private _positionToast: Animated.Value;
  private _pressStart: null | { startY: number; startAt: number };
  private _countdown: null | Function;

  constructor(props: IProps) {
    super(props);
    this._heightContainer = 0;
    this._pressStart = null;
    this._positionToast = new Animated.Value(0);
    this._countdown = null;
    this.state = {
      isInit: false,
      styles: __styles(props.isDark),
    };
  }

  public componentDidUpdate = async (prevProps: Readonly<IProps>, prevState: Readonly<IState>): Promise<void> => {
    if (!prevState.isInit && this.state.isInit) {
      await new Promise((resolve) => this._animatedTiming(0).start(resolve));
      this._autoCloseHandler();
    }
    if (prevProps.isDark !== this.props.isDark) {
      this.setState({ ...prevState, styles: __styles(this.props.isDark) });
    }
  };

  public componentWillUnmount = (): void => {
    this._countdown?.();
  };

  private _animatedTiming = (toValue: number) => {
    return Animated.timing(this._positionToast, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    });
  };

  private _autoCloseHandler = (): void => {
    this._countdown?.();
    if (this.props.timeout) {
      this._countdown = (() => {
        const _timeout = setTimeout(() => this._animatedTiming(-this._heightContainer).start(this.props.onClose), this.props.timeout);
        return () => clearTimeout(_timeout);
      })();
    }
  };

  private _layoutHandler = (event: LayoutChangeEvent) => {
    if (this.state.isInit) {
      return;
    }
    const { height } = event.nativeEvent.layout;
    this._heightContainer = height;
    this._positionToast.setValue(-height);
    this.setState((prevState) => ({ ...prevState, isInit: true }));
  };

  private _panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => false,
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderMove: (_, { dy }) => {
      if (dy < 0) {
        this._positionToast.setValue(dy);
      }
    },
    onPanResponderTerminationRequest: () => true,
    onPanResponderStart: (_, { dy: startY }) => {
      this._pressStart = { startY, startAt: Date.now() };
      this._countdown?.();
    },
    onPanResponderEnd: async (_, { dy }) => {
      let heightContainer = this._heightContainer;
      const { startY, startAt } = this._pressStart!;
      this._pressStart = null;
      if (startAt + 500 >= Date.now() && Math.abs(dy - startY) < 7) {
        this.props?.onPress?.();
        this._autoCloseHandler();
      } else if (dy < -(heightContainer / 3)) {
        this._animatedTiming(-heightContainer).start(this.props.onClose);
      } else {
        this._animatedTiming(0).start(this._autoCloseHandler);
      }
    },
  });

  private _ModelRender = () => {
    const { type, title, description, titleStyle, textBodyStyle } = this.props;
    const { styles } = this.state;
    // if (model) {
    //   return model({ isDark, type, title, description });
    // }
    return (
      <View style={styles.cardContainer}>
        {type && (
          <React.Fragment>
            <View style={styles.backendImage} />
            <Image source={getImage(type)} resizeMode="contain" style={StyleSheet.flatten([styles.image, styles[`${type}Image`]])} />
          </React.Fragment>
        )}
        <View style={styles.labelContainer}>
          {title && <Text style={StyleSheet.flatten([styles.titleLabel, titleStyle])}>{title}</Text>}
          {description && <Text style={StyleSheet.flatten([styles.descLabel, textBodyStyle])}>{description}</Text>}
        </View>
      </View>
    );
  };

  public render() {
    const paddingTop = this.props.paddingTop || 0;
    const { isInit, styles } = this.state;
    const { _ModelRender } = this;
    return (
      <Animated.View
        collapsable={false}
        onLayout={this._layoutHandler}
        {...this._panResponder.panHandlers}
        style={StyleSheet.flatten([styles.container, { paddingTop, zIndex: isInit ? 99999 : -1, transform: [{ translateY: this._positionToast }] }])}
      >
        <_ModelRender />
      </Animated.View>
    );
  }
}

const __styles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      left: 0,
      right: 0,
    },

    cardContainer: {
      flexDirection: 'row',
      paddingHorizontal: 12,
      paddingTop: 12,
      paddingBottom: 12,
      backgroundColor: Color.get('card', isDark),
      ...Platform.select({
        ios: {
          borderRadius: 12,
          marginHorizontal: 12,
        },
        android: {
          marginTop: 6,
          marginHorizontal: 6,
          borderRadius: 6,
        },
      }),
    },

    labelContainer: {
      overflow: 'hidden',
      flex: 1,
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
