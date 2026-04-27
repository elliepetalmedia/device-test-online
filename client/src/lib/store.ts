import { useState, useEffect } from 'react';

export interface TestResult {
    tool: string;
    status: 'passed' | 'failed' | 'tested';
    details?: Record<string, any>;
    timestamp: number;
}

class TestStore {
    private results: Record<string, TestResult> = {};
    private listeners: Set<() => void> = new Set();

    private logStorageIssue(action: string, error: unknown) {
        if (import.meta.env.DEV) {
            console.warn(`[testStore] Failed to ${action}`, error);
        }
    }

    constructor() {
        try {
            const stored = localStorage.getItem('device_test_results');
            if (stored) {
                this.results = JSON.parse(stored);
            }
        } catch (error) {
            this.logStorageIssue("read local session results", error);
        }
    }

    getResults() {
        return this.results;
    }

    addResult(tool: string, status: 'passed' | 'failed' | 'tested', details?: Record<string, any>) {
        this.results[tool] = { tool, status, details, timestamp: Date.now() };
        this.save();
        this.notify();
    }

    clear() {
        this.results = {};
        this.save();
        this.notify();
    }

    subscribe(listener: () => void) {
        this.listeners.add(listener);
        return () => { this.listeners.delete(listener); };
    }

    private save() {
        try {
            localStorage.setItem('device_test_results', JSON.stringify(this.results));
        } catch (error) {
            this.logStorageIssue("write local session results", error);
        }
    }

    private notify() {
        this.listeners.forEach(l => l());
    }
}

export const testStore = new TestStore();

export function useTestStore() {
    const [results, setResults] = useState(testStore.getResults());

    useEffect(() => {
        return testStore.subscribe(() => {
            setResults({ ...testStore.getResults() });
        });
    }, []);

    return results;
}
