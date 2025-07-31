'use client';

import { Parallax } from 'react-scroll-parallax';
import { BigIntroText } from '../lib/text';

export default function Main() {
  return (
    <>
    <Parallax scale={[1 ,1]} translateY={[90, 0]} speed={-10}>
      <BigIntroText>Felix Averlant</BigIntroText>
    </Parallax>

    </>
  );
}