import React from 'react';
import Typography from '@material-ui/core/Typography';
import { MuiColor } from '../utils/Types';

type Variant = "button" | "caption" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "inherit" | 
  "subtitle1" | "subtitle2" | "body1" | "body2" | "overline" | "srOnly";

interface TypingTextMessage {
  getText: () => string;
  color?: MuiColor;
}

interface TypingTextProps {
   messages: TypingTextMessage[];
   variant?: Variant;
   component?: Variant;
   className?: string;
   gutterBottom?: boolean;
   align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
}

const TYPING_DELAY_MS = 50;
const NEXT_MESSAGE_DELAY_MS = 5000; 

const TypingText: React.FC<TypingTextProps> = (props: TypingTextProps): JSX.Element => {
  const { messages, variant, className, gutterBottom, align } = props;
  const [msgIndex, setMsgIndex] = React.useState<number>(0);
  const [textIndex, setTextIndex] = React.useState<number>(0);
  const [output, setOutput] = React.useState<string>(messages[msgIndex].getText());
  const [color, setColor] = React.useState<MuiColor>(messages[msgIndex].color);

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

  React.useEffect(() => {
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