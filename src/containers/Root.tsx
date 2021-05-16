import * as React from 'react';
import { useColorScheme, View } from 'react-native';
import { Dialog, Toast, IConfigDialog, IConfigToast } from '../index';
import { SafeAreaProvider, SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { useContext } from 'react';
import { Color, IColors } from '../service';

type IProps = {
  dialogConfig?: Pick<IConfigDialog, 'closeOnOverlayTap' | 'autoClose'>;
  toastConfig?: Pick<IConfigToast, 'autoClose'>;
  theme?: 'light' | 'dark';
  colors?: [IColors, IColors] /** ['light_colors' , 'dark_colors'] */;
};

const Root: React.FunctionComponent<IProps> = ({ theme, colors, children, dialogConfig, toastConfig }) => {
  const colorScheme = useColorScheme();
  const safeAreaInsetsContext = useContext(SafeAreaInsetsContext);
  Color.colorsCustom = colors;

  const isDark = (theme ?? colorScheme) === 'dark';

  if (safeAreaInsetsContext === null) {
    return (
      <SafeAreaProvider>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <View style={{ flex: 1 }}>
          {children}
          <Dialog ref={Dialog.instance} isDark={isDark} config={dialogConfig} />
          <Toast ref={Toast.instance} isDark={isDark} config={toastConfig} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{ flex: 1 }}>
      {children}
      <Dialog ref={Dialog.instance} isDark={isDark} config={dialogConfig} />
      <Toast ref={Toast.instance} isDark={isDark} config={toastConfig} />
    </View>
  );
};

export default Root;
