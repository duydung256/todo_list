// Cloud Sync and Backup functionality
class CloudSync {
    constructor() {
        this.syncInterval = null;
        this.lastSyncTime = localStorage.getItem('lastSyncTime') || null;
    }

    // Simulate cloud backup (in real app, this would connect to Firebase, etc.)
    async backupToCloud(tasks) {
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const backup = {
                tasks: tasks,
                timestamp: new Date().toISOString(),
                version: '1.0'
            };
            
            // Store in localStorage as cloud simulation
            localStorage.setItem('cloudBackup', JSON.stringify(backup));
            localStorage.setItem('lastSyncTime', backup.timestamp);
            
            return { success: true, timestamp: backup.timestamp };
        } catch (error) {
            console.error('Backup failed:', error);
            return { success: false, error: error.message };
        }
    }

    async restoreFromCloud() {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const backup = localStorage.getItem('cloudBackup');
            if (!backup) {
                return { success: false, error: 'No backup found' };
            }
            
            const data = JSON.parse(backup);
            return { success: true, tasks: data.tasks, timestamp: data.timestamp };
        } catch (error) {
            console.error('Restore failed:', error);
            return { success: false, error: error.message };
        }
    }

    startAutoSync(tasks, onSync) {
        // Auto sync every 5 minutes
        this.syncInterval = setInterval(async () => {
            const result = await this.backupToCloud(tasks);
            if (result.success && onSync) {
                onSync(result);
            }
        }, 5 * 60 * 1000);
    }

    stopAutoSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }
}

window.CloudSync = CloudSync;
