import { useRef } from 'react';

export function use3DTilt() {
  const ref = useRef(null);
  return {
    ref,
    style: {},
    onMouseMove: () => {},
    onMouseLeave: () => {}
  };
}

export default use3DTilt;
