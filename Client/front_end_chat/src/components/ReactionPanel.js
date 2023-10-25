import React, { useState, useEffect } from 'react';
import { getReactions } from '../services/Api';

const ReactionPanel = ({ message, onReact }) => {
    const [reactions, setReactions] = useState([]);

    useEffect(() => {
        // Récupérer les réactions depuis le backend lors du chargement du composant
        const fetchReactions = async () => {
            try {
                const response = await getReactions();

                setReactions(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des réactions :', error);
            }
        };

        fetchReactions();
    }, []);


    return(
        <div className="reaction-panel">
            {reactions.map((reaction) => (
                <button
                    key={reaction._id}
                    className="reaction-emoji"
                    onClick={() => onReact(message, reaction._id)}
                >
                    {reaction.Emoji}
                </button>
            ))}
        </div>
    );
};


export default ReactionPanel;

