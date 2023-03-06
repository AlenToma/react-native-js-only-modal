import { ViewStyle, StyleProp } from 'react-native';

import { Animation, CustomAnimation, Easing } from 'react-native-animatable';

export type Props = {
  children: React.ReactNode[] | React.ReactNode;
  visible: boolean;
  onCloseRequest?: (action?: "BackButton" | "BackDrop") => void;
  hideBackDrop?: boolean;
  backDropStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  easing?: Easing;
  animationIn?: Animation | CustomAnimation;
  animationOut?: Animation | string | CustomAnimation;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  duration?: number;
  onAnimationBegin?: () => void;
  onAnimationEnd?: () => void;
  useNativeDriver?: boolean;
  dimensions?: 'screen' | 'window';
  disableBackHandler?: boolean;
};

export type Size = { width: number; y: number; height: number; x: number };

export type Component = {
  props: Props;
  layoutData?: Size;
  ref?: any;
  onHide?: () => Promise<void>;
};
export type Item = {
  id: string;
  component: Component;
};

export type IContext = {
  update: () => void;
  find: (id: string) => undefined | Item;
  has: (id: string) => boolean;
  remove: (id: string) => void;
  updateProps: (props: Props, id: string) => void;
  push: (item: Item) => void;
  items: Map<string, Item>;
  zIndex: number;
};
