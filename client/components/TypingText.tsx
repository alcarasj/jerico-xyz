import React, { FC, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { MuiColor } from '../utils/Types';

type Variant = "inherit" | "button" | "overline" | "caption" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2" | "body1" | "body2";

interface TypingTextMessage {
  getText: () => string; // This is a function so that time can be displayed live real-time.
  color?: MuiColor;
}

interface Props {
  readonly messages: TypingTextMessage[];
  readonly variant?: Variant;
  readonly component?: Variant;
  readonly className?: string;
  readonly gutterBottom?: boolean;
  readonly align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
}

const TYPING_DELAY_MS = 50;
const NEXT_MESSAGE_DELAY_MS = 5000; 

const TypingText: FC<Props> = (props: Props): JSX.Element => {
  const { messages, variant, className, gutterBottom, align } = props;
  const [msgIndex, setMsgIndex] = useState<number>(0);
  const [textIndex, setTextIndex] = useState<number>(0);
  const [output, setOutput] = useState<string>(messages[msgIndex].getText());
  const [color, setColor] = useState<MuiColor>(messages[msgIndex].color);

  const startTyping = () => {
    setTimeout(() => {
      if (textIndex > 0 ) {
        setOutput(messages[msgIndex].getText().substring(0, textIndex));
      }
      setColor(messages[msgIndex].color);
      if (textIndex < messages[msgIndex].getText().length) {
        setTextIndex(textIndex + 1);
      } else {
        let remainingTimeMs = NEXT_MESSAGE_DELAY_MS;
        setTimeout(() => {
          setTextIndex(0);
          setMsgIndex(msgIndex < messages.length - 1 ? msgIndex + 1 : 0);
        }, NEXT_MESSAGE_DELAY_MS);
        do {
          setTimeout(() => {
            setOutput(messages[msgIndex].getText());
          }, remainingTimeMs);
          remainingTimeMs -= 1000;
        } while (remainingTimeMs > 0)
      }
    }, TYPING_DELAY_MS);
  };

  useEffect(() => {
    startTyping();
  }, [textIndex])

  return (
    <Typography
      gutterBottom={gutterBottom}
      variant={variant}
      color={color}
      className={className}
      align={align}
    >
      { output }
    </Typography>
  );
}

export default TypingText;