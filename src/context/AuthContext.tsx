import React, { createContext, ReactNode, useContext, useState } from 'react';

export type UserRole = 'owner' | 'tenant';

export interface User {
    name: string;
    email: string;
    phone: string;
    location: string;
    memberSince: string;
    role: UserRole;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, role: UserRole) => void;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (email: string, role: UserRole) => {
        // Simulated login - in a real app, this would come from an API
        setUser({
            name: email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
            email: email,
            phone: '+91 98765 43210',
            location: 'Coimbatore, Tamil Nadu',
            memberSince: 'December 2025',
            role: role,
        });
    };

    const logout = () => {
        setUser(null);
    };

    const updateUser = (userData: Partial<User>) => {
        setUser(prev => prev ? { ...prev, ...userData } : null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
