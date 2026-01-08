import React from 'react';
import { useBacktestStore } from '../../stores/backtestStore';
import { SessionBuilder } from './SessionBuilder';
import { ActiveSession } from './ActiveSession';
import { SessionSummary } from './SessionSummary';

export const BacktestPage: React.FC = () => {
    const { currentSession } = useBacktestStore();

    if (!currentSession) {
        return <SessionBuilder />;
    }

    if (currentSession.status === 'ACTIVE') {
        return <ActiveSession />;
    }

    if (currentSession.status === 'COMPLETED' || currentSession.status === 'ABORTED') {
        return <SessionSummary />;
    }

    return <SessionBuilder />;
};
