// Analytics and Data Visualization
class TaskAnalytics {
    constructor(tasks) {
        this.tasks = tasks;
    }

    getProductivityData() {
        const today = new Date();
        const last7Days = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            
            const dayTasks = this.tasks.filter(task => {
                const taskDate = new Date(task.createdAt);
                return taskDate.toDateString() === date.toDateString();
            });
            
            const completed = dayTasks.filter(task => task.completed).length;
            
            last7Days.push({
                date: date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' }),
                completed: completed,
                total: dayTasks.length
            });
        }
        
        return last7Days;
    }

    getCategoryDistribution() {
        const categories = {};
        this.tasks.forEach(task => {
            const category = task.category || 'general';
            categories[category] = (categories[category] || 0) + 1;
        });
        
        return Object.entries(categories).map(([category, count]) => ({
            category,
            count,
            percentage: Math.round((count / this.tasks.length) * 100)
        }));
    }

    getCompletionRate() {
        if (this.tasks.length === 0) return 0;
        const completed = this.tasks.filter(task => task.completed).length;
        return Math.round((completed / this.tasks.length) * 100);
    }

    getOverdueCount() {
        const now = new Date();
        return this.tasks.filter(task => 
            task.dueDate && 
            new Date(task.dueDate) < now && 
            !task.completed
        ).length;
    }
}

// Export for use in main app
window.TaskAnalytics = TaskAnalytics;
