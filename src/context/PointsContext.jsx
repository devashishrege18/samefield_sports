import React, { createContext, useState, useContext, useEffect } from 'react';

const PointsContext = createContext();

export const usePoints = () => useContext(PointsContext);

export const PointsProvider = ({ children }) => {
    const [points, setPoints] = useState(9150);
    const [notifications, setNotifications] = useState([]);

    const addPoints = (amount, reason) => {
        setPoints(prev => prev + amount);

        const id = Date.now();
        const notification = { id, amount, reason };

        setNotifications(prev => [...prev, notification]);

        // Remove notification after 3 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    };

    return (
        <PointsContext.Provider value={{ points, addPoints, notifications }}>
            {children}
        </PointsContext.Provider>
    );
};
