import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex h-screen bg-app text-primary overflow-hidden font-sans selection:bg-brand/30">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 relative">
                <Header />

                <main className="flex-1 overflow-y-auto relative p-6">
                    <div className="mx-auto max-w-[1920px] h-full">
                        {children}
                    </div>
                </main>

                {/* Optional: Background Ambient Glow if needed, currently in body CSS */}
            </div>
        </div>
    );
};
