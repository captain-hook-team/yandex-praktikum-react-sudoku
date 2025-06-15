import { FC, FormEvent, useState } from 'react';
import { PiPaperPlaneRightBold } from 'react-icons/pi';

interface CommentFormProps {
  onSubmit: (text: string) => void;
  formButtonClass: string;
  formClass: string;
  inputClass: string;
}

const PaperPlaneIcon = PiPaperPlaneRightBold as FC<{ size: number }>;

function CommentForm(props: CommentFormProps) {
  const { onSubmit, formClass, formButtonClass, inputClass } = props;
  const [text, setText] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(text.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className={formClass}>
      <input
        type="text"
        placeholder="Написать комментарий"
        className={inputClass}
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <button type="submit" className={formButtonClass}>
        <PaperPlaneIcon size={25} />
      </button>
    </form>
  );
}

export default CommentForm;
