import { ReactNode } from "react";
import { twMerge } from 'tailwind-merge';

export const BigIntroText = ({classNames, children}
   :{children:ReactNode, classNames?:string}
) => <div style={{
   writingMode: 'vertical-rl',
   transform:'rotate(180deg)'
}} className={twMerge(classNames, "text-[400px] font-bold text-gray-900")}>{children}</div>