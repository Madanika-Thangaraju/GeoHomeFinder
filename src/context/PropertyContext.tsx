import React, { createContext, ReactNode, useContext, useState } from 'react';

interface PropertyContextType {
    savedIds: number[];
    toggleSave: (id: number) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ children }: { children: ReactNode }) {
    const [savedIds, setSavedIds] = useState<number[]>([1]); // Initialized with some data

    const toggleSave = (id: number) => {
        setSavedIds(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    return (
        <PropertyContext.Provider value={{ savedIds, toggleSave }}>
            {children}
        </PropertyContext.Provider>
    );
}

export function useProperties() {
    const context = useContext(PropertyContext);
    if (context === undefined) {
        throw new Error('useProperties must be used within a PropertyProvider');
    }
    return context;
}
