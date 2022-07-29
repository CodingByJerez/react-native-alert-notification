import * as React from 'react';
import { ReactElement, useContext } from 'react';
import RN, { View } from 'react-native';
import { SafeAreaInsetsContext, SafeAreaProvider } from 'react-native-safe-area-context';
import { Dialog, IConfigDialog, IConfigToast, Toast } from '../index';
import { Color, IColors } from '../service';

type IProps = {
  dialogConfig?: Pick<IConfigDialog, 'closeOnOverlayTap' | 'autoClose'>;
  toastConfig?: Pick<IConfigToast, 'autoClose' | 'titleStyle' | 'textBodyStyle'>;
  theme?: 'light' | 'dark';
  colors?: [IColors, IColors] /** ['light_colors' , 'dark_colors'] */;
  children: ReactElement | ReactElement[];
};

const Root: React.FunctionComponent<IProps> = ({ theme, colors, children, dialogConfig, toastConfig }) => {
  const colorScheme = RN.useColorScheme?.();
  const safeAreaInsetsContext = useContext(SafeAreaInsetsContext);
  Color.colorsCustom = colors;

  const isDark = (theme ?? colorScheme) === 'dark';

  if (safeAreaInsetsContext === null) {
    return (
      <SafeAreaProvider>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <View style={{ flex: 1 }}>
          <Dialog ref={Dialog.instance} isDark={isDark} config={dialogConfig} />
          <Toast ref={Toast.instance} isDark={isDark} config={toastConfig} />
          {children}
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{ flex: 1 }}>
      <Dialog ref={Dialog.instance} isDark={isDark} config={dialogConfig} />
      <Toast ref={Toast.instance} isDark={isDark} config={toastConfig} />
      {children}
    </View>
  );
};

export default Root;
