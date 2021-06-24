import { useEffect, useState } from 'react';
import { database } from '../services/firebase';

type QuestionProps = {
    id: string;
    author: {
        name: string;
        avatar: string;
    };
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;
};

type FirebaseQuestions = Record<
    string,
    {
        author: {
            name: string;
            avatar: string;
        };
        content: string;
        isHighlighted: boolean;
        isAnswered: boolean;
    }
>;

export function useRoom(roomId: string) {
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState<QuestionProps[]>([]);

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value', (room) => {
            const databaseRoom = room.val();
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

            const parsedQuestion = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isAnswered: value.isAnswered,
                    isHighlighted: value.isHighlighted
                };
            });

            setTitle(databaseRoom.title);
            setQuestions(parsedQuestion);
        });
    }, [roomId]);

    return { questions, title };
}
