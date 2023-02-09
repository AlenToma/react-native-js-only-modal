import * as React from 'react';
import { useState, useEffect, useRef, useContext } from 'react';
import * as Animatable from 'react-native-animatable';
import { View, StyleSheet, Dimensions, BackHandler } from 'react-native';
import uuid from 'react-uuid';
import { Size, Props, Item, IContext } from './typings';
const ContextProvider = React.createContext({} as IContext);
const screenSize = (dimensions?: 'screen' | 'window') => {
  const size = {
    width: Dimensions.get(dimensions ?? 'window').width,
    height: Dimensions.get(dimensions ?? 'window').height,
  } as Size;
  return size;
};

const Provider = ({
  children,
  zIndex,
}: {
  children: React.ReactNode | React.ReactNode[];
  zIndex?: number;
}) => {
  const data = {
    items: new Map(),
    update: () => { },
    find: (id: string) => {
      return data.items.get(id);
    },
    has: (id: string) => data.items.has(id),
    remove: (id: string) => {
      data.items.delete(id);
    },
    updateProps: (props: Props, id: string) => {
      const item = data.find(id);
      if (item) item.component.props = props;
    },
    push: (item: Item) => {
      data.items.set(item.id, item);
    },
    zIndex: zIndex || 90000,
  } as IContext;

  useEffect(() => {
    return () => {
      data.items.clear();
      data.update();
    }
  }, [])


  return (
    <ContextProvider.Provider value={data}>
      {children}
      <ModalContainer />
    </ContextProvider.Provider>
  );
};

const ModalContainer = () => {
  const [_, setUpdater] = useState(0);
  const [items] = useState(new Map<string, Item>());
  const context = useContext(ContextProvider);

  context.update = () => setUpdater((x) => (x > 1000 ? 0 : x) + 1);
  context.items = items;
  const rItem = [] as Item[];
  items.forEach((x) => {
    rItem.push(x);
  });

  return (
    <>
      {rItem.map((x, index) => (
        <InternalModal
          key={index}
          item={x}
          zIndex={context.zIndex}
          index={index}
        />
      ))}
    </>
  );
};

const InternalModal = ({
  item,
  index,
  zIndex,
}: {
  item: Item;
  index: number;
  zIndex: number;
}) => {
  const [size, setSize] = useState(screenSize(item.component.props.dimensions));
  const backDropRef = useRef<any>();
  const getBounds = (pos: any, native: any) => {
    return {
      x: pos.x,
      x2: pos.x + pos.width,
      y: pos.y,
      y2: pos.y + pos.height,
      pageX: native.nativeEvent.pageX,
      pageY: native.nativeEvent.pageY,
    };
  };
  item.component.onHide = async () => {
    try {
      if (backDropRef.current)
        await backDropRef.current.animate(
          'fadeOut',
          item.component.props.duration
        );
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const d = Dimensions.addEventListener('change', () => {
      setSize(screenSize(item.component.props.dimensions));
    });
    const onBackPressed = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (item.component.props.disableBackHandler !== true)
          item.component.props.onCloseRequest?.('BackButton');
        return true;
      }
    );
    return () => {
      d.remove();
      onBackPressed.remove();
    };
  }, []);

  const procent = ($this: number, value: number) => {
    return ($this / 100) * value;
  };


  const styleSizeProps = {

  } as any;
  const stringSizeToNumber = (s: any, pValue: number) => {
    if (!s) return s;
    if (typeof s === 'string' && s.indexOf('%') !== -1)
      return procent(pValue, parseFloat(s.replace(/%/g, '').trim()));

    return s;
  };
  const styleSize = (style: any) => {
    if (!style) return;
    if (Array.isArray(style)) style.forEach((x) => styleSize(x));
    else {
      const keys = Object.keys(style);
      const assignValue = (k: string, value: string) => {
        if (keys.find(x => x === k))
          styleSizeProps[k] = value;
      }
      assignValue("width", stringSizeToNumber(style.width, size.width));
      assignValue("minWidth", stringSizeToNumber(style.minWidth, size.width));
      assignValue("minHeight", stringSizeToNumber(style.minHeight, size.height));
      assignValue("height", stringSizeToNumber(style.height, size.height));
    }
  };

  const viewStyle = () => {
    styleSize(item.component.props.style);
    let dstyle = Array.isArray(item.component.props.style)
      ? item.component.props.style
      : [item.component.props.style];
    dstyle = [...dstyle, { zIndex: 2, ...styleSizeProps }];
    return dstyle;
  };

  const isOutSide = (e: any) => {
    if (item.component.layoutData) {
      const bounds = getBounds(item.component.layoutData, e);
      if (
        bounds.pageX < bounds.x ||
        bounds.pageX > bounds.x2 ||
        bounds.pageY < bounds.y ||
        bounds.pageY > bounds.y2
      ) {
        return true;
      }
    }
    return false;
  };

  const onLayout = (e: any) => {
    if (!item.component.layoutData)
      item.component.layoutData = e.nativeEvent.layout;
     else item.component.layoutData = {...e.nativeEvent.layout,
       width: Math.max(e.nativeEvent.layout.width ?? 0, e.nativeEvent.layout.width),
       height: Math.max(e.nativeEvent.layout.height ?? 0, e.nativeEvent.layout.height)
      }
  }

  return (
    <>
      {item.component.props.hideBackDrop != true ? (
        <Animatable.View
          ref={(c) => (backDropRef.current = c)}
          pointerEvents="box-none"
          duration={item.component.props.duration}
          animation={'fadeIn'}
          style={{
            ...styles.modal,
            ...size,
            zIndex: (zIndex - 1) * (index + 1),
          }}>
          <View
            pointerEvents="box-none"
            style={[
              styles.backDrop,
              {
                minHeight: size.height,
                minWidth: size.width,
              },
              item.component.props.backDropStyle,
              {
                opacity:
                  ((item.component.props.backDropStyle as any)?.opacity ??
                    styles.backDrop.opacity) +
                  (index + 1) / 100,
              },
            ]}
          />
        </Animatable.View>
      ) : null}
      <Animatable.View
        ref={(c: any) => (item.component.ref = c)}
        easing={item.component.props.easing}
        direction={item.component.props.direction}
        duration={item.component.props.duration}
        animation={item.component.props.animationIn}
        onAnimationBegin={item.component.props.onAnimationBegin}
        onAnimationEnd={item.component.props.onAnimationEnd}
        style={[
          styles.modal,
          {
            zIndex: zIndex * (index + 1),
            ...size,
          },
          item.component.props.containerStyle,
        ]}
        onResponderRelease={(e: any) => {
          if (isOutSide(e)) item.component.props.onCloseRequest?.('BackDrop');
        }}
        onStartShouldSetResponder={(e: any) => {
          return isOutSide(e);
        }}>
        <View onLayout={onLayout} style={{ flexDirection: 'column', ...styleSizeProps, backgroundColor: "transparent" }}>
          <View onLayout={onLayout} {...item.component.props} style={viewStyle()} />
        </View>
      </Animatable.View>
    </>
  );
};

const Modal = ({
  visible,
  children,
  onCloseRequest,
  style,
  hideBackDrop,
  animationIn,
  animationOut,
  duration,
  direction,
  containerStyle,
  backDropStyle,
  useNativeDriver,
  easing,
  dimensions,
  disableBackHandler,
}: Props) => {
  const rId = useRef(uuid());
  const context = useContext(ContextProvider);
  if (!animationIn) animationIn = 'slideInDown';
  if (!animationOut) animationOut = 'slideOutUp';

  if (duration === undefined) duration = 100;
  useEffect(() => {
    const id = new String(rId.current).toString();
    if (visible) {
      const props = {
        visible,
        children,
        onCloseRequest,
        style,
        hideBackDrop,
        animationIn,
        animationOut,
        duration,
        direction,
        containerStyle,
        backDropStyle,
        useNativeDriver,
        easing,
        dimensions,
        disableBackHandler,
      };
      if (!context.has(id)) {
        context.push({
          id: id,
          component: {
            props: props,
          },
        });
      } else context.updateProps(props, id);
      context.update();
    } else {
      const item = context.find(id);
      rId.current = uuid(); // forget the current element
      if (item && item.component.ref) {
        item.component.ref.animate(animationOut, duration).then(async () => {
          if (item.component.onHide) await item.component.onHide?.();
          context.remove(id);
          context.update();
        });
      } else {
        context.remove(id);
        context.update();
      }
    }
  });

  useEffect(() => {
    return () => {
      context.remove(rId.current);
      context.update();
    };
  }, []);

  return null as JSX.Element | null;
};

const styles = StyleSheet.create({
  backDrop: {
    backgroundColor: '#000',
    opacity: 0.7,
    left: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  modal: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: '100%',
    minHeight: '100%',
  },
});

export { Modal, Provider };
