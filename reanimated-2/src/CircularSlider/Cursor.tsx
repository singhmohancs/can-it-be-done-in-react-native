import * as React from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { canvas2Polar, polar2Canvas } from "../components/AnimatedHelpers";
import { StyleGuide } from "../components";

interface CursorProps {
  r: number;
  theta: any;
  strokeWidth: number;
}

const Cursor = ({ r, theta, strokeWidth }: CursorProps) => {
  const center = { x: r, y: r };
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.offsetX = x.value;
      ctx.offsetY = y.value;
    },
    onActive: (event, ctx) => {
      x.value = event.translationX + ctx.offsetX;
      y.value = event.translationY + ctx.offsetY;
    },
  });
  const polar = useDerivedValue(() => {
    const value = canvas2Polar({ x: x.value, y: y.value }, center).theta;
    theta.value = value < 0 ? value + 2 * Math.PI : value;
    return value;
  });
  const style = useAnimatedStyle(() => {
    const { x: translateX, y: translateY } = polar2Canvas(
      { theta: polar.value, radius: r },
      center
    );
    return {
      transform: [
        {
          translateX,
        },
        {
          translateY,
        },
      ],
    };
  });
  return (
    <PanGestureHandler
      onHandlerStateChange={onGestureEvent}
      {...{ onGestureEvent }}
    >
      <Animated.View
        style={[
          {
            ...StyleSheet.absoluteFillObject,
            width: strokeWidth,
            height: strokeWidth,
            borderRadius: strokeWidth / 2,
            borderColor: "white",
            borderWidth: 5,
            backgroundColor: StyleGuide.palette.primary,
          },
          style,
        ]}
      />
    </PanGestureHandler>
  );
};

export default Cursor;