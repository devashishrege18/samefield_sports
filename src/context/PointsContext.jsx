import React, { createContext, useState, useContext, useEffect } from 'react';

const PointsContext = createContext();

export const usePoints = () => useContext(PointsContext);

export const PointsProvider = ({ children }) => {
    const [points, setPoints] = useState(() => {
        const saved = localStorage.getItem('samefield_xp');
        return saved ? parseInt(saved, 10) : 9150;
    });
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'samefield_xp' && e.newValue) {
                setPoints(parseInt(e.newValue, 10));
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const addPoints = (amount, reason) => {
        setPoints(prev => {
            const newPoints = prev + amount;
            localStorage.setItem('samefield_xp', newPoints);
            return newPoints;
        });

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
