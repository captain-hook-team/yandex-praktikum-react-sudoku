import { useState } from 'react';
import { IComment } from '../../../models/Forum';
import { EMOJI } from '../../../constants/constants';
import styles from './CommentList.module.scss';

interface CommentListProps {
  comments: IComment[] | undefined;
  commentsListClass: string;
  commentClass: string;
  handleReaction: (commentId: number, code: EMOJI) => void;
}
type Emoji = {
  code: EMOJI, emoji: string
}

function CommentList(props: CommentListProps) {
  const { comments, commentsListClass, commentClass, handleReaction } = props;
  const reactions: Emoji[] = [
    { code: EMOJI.LIKE, emoji: '👍' },
    { code: EMOJI.DISLIKE, emoji: '👎' },
  ];
  const [hoveredCommentId, setHoveredCommentId] = useState<number | null>(null);

  const getEmojiByCode = (code: string): string => reactions.find((reaction) => reaction.code === code)?.emoji ?? '';

  if (!comments) return <div>Пока что нет комментариев</div>;
  return (
    <ul className={commentsListClass}>
      {comments.map((comment: IComment) => (
        <li
          className={commentClass}
          key={comment.id}
          onMouseEnter={() => setHoveredCommentId(comment.id)}
          onMouseLeave={() => setHoveredCommentId(null)}
        >
          {comment.content}
          {comment?.reaction && (
            <div>{getEmojiByCode(comment.reaction)}</div>
          )}
          {hoveredCommentId === comment.id && (
            <div>
              {reactions.map(({ code, emoji }) => (
                <button
                  key={code}
                  className={styles.reaction}
                  onClick={() => handleReaction(comment.id, code)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export default CommentList;
