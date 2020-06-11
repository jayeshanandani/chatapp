

import React from 'react'
import Svg, {
  Rect, Defs, G, Circle, Path,
} from 'react-native-svg'

export default function (props) {
  return (
    <Svg viewBox="0 0 70 70" height={props.height} width={props.width} fill={props.color}>
      <Defs />
      <G id="Layer_2" data-name="Layer 2">
        <G id="Layer_1-2" data-name="Layer 1">
          <Circle className="cls-1" cx={35} cy={35} r={35} />
          <Circle className="cls-2" cx={35} cy={35} r="26.64" />
          <Path
            className="cls-3"
            d="M44.88 27.09H39v4h-8v-4h-5.88a2 2 0 0 0-2 2v14.47a2 2 0 0 0 2 2h19.76a2 2 0 0 0 2-2V29.07a2 2 0 0 0-2-1.98zM35 33.68a2.64 2.64 0 1 1-2.64 2.64A2.64 2.64 0 0 1 35 33.68zm3.84 9.22h-7.68a.65.65 0 0 1-.64-.82A2.64 2.64 0 0 1 33 40.27h.34a4.24 4.24 0 0 0 3.28 0H37a2.64 2.64 0 0 1 2.51 1.82.65.65 0 0 1-.67.82zm-1.2-17.12a1.32 1.32 0 0 0-1.32-1.32h-2.64a1.32 1.32 0 0 0-1.32 1.32v4h5.27z"
          />
        </G>
      </G>
    </Svg>
  )
}
