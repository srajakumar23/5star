export interface OfflineLead {
    id?: number;
    parentName: string;
    parentMobile: string;
    studentName: string;
    campus: string;
    gradeInterested: string;
    referralCode?: string;
    timestamp: number;
    synced: boolean;
}

const DB_NAME = 'AchariyaOfflineDB';
const STORE_NAME = 'leads';

export const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (event: any) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        };
        request.onsuccess = (event: any) => resolve(event.target.result);
        request.onerror = (event: any) => reject(event.target.error);
    });
};

export const saveOfflineLead = async (lead: Omit<OfflineLead, 'id' | 'timestamp' | 'synced'> & { referralCode?: string }) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add({
            ...lead,
            timestamp: Date.now(),
            synced: false
        });
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
};

export const getUnsyncedLeads = async (): Promise<OfflineLead[]> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => {
            const leads = request.result as OfflineLead[];
            resolve(leads.filter(l => !l.synced));
        };
        request.onerror = () => reject(request.error);
    });
};

export const markLeadSynced = async (id: number) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id); // Deleting instead of marking to keep DB clean
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
};
