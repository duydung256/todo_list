document.addEventListener('DOMContentLoaded', function () {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    document.getElementById('current-date').textContent = now.toLocaleDateString('ja-JP', options);

    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const dueDateInput = document.getElementById('due-date-input');
    const priorityInput = document.getElementById('priority-input');
    const categoryInput = document.getElementById('category-input');
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const taskList = document.getElementById('task-list');
    const emptyState = document.getElementById('empty-state');
    const taskCount = document.getElementById('task-count');
    const clearCompleted = document.getElementById('clear-completed');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const exportBtn = document.getElementById('export-tasks');
    const importBtn = document.getElementById('import-tasks');
    const importFile = document.getElementById('import-file');
    const addTagsBtn = document.getElementById('add-tags-btn');
    const tagsInputContainer = document.getElementById('tags-input-container');
    const tagsInput = document.getElementById('tags-input');
    const bulkActionsBtn = document.getElementById('bulk-actions-btn');
    const bulkActionsPanel = document.getElementById('bulk-actions-panel');
    const fabBtn = document.getElementById('fab-btn');
    const quickAddModal = document.getElementById('quick-add-modal');
    const shortcutsModal = document.getElementById('shortcuts-modal');

    const allTasksBtn = document.getElementById('all-tasks');
    const activeTasksBtn = document.getElementById('active-tasks');
    const completedTasksBtn = document.getElementById('completed-tasks');

    const currentMonthEl = document.getElementById('current-month');
    const calendarDaysEl = document.getElementById('calendar-days');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const upcomingTasksEl = document.getElementById('upcoming-tasks');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let searchTerm = '';
    let sortBy = 'created';
    let bulkMode = false;
    let selectedTasks = new Set();
    let draggedTaskId = null;
    
    // Timer variables
    let timerInterval = null;
    let timerSeconds = 25 * 60; // 25 minutes
    let isTimerRunning = false;
    let isBreakTime = false;
    let sessionCount = parseInt(localStorage.getItem('sessionCount')) || 0;
    let dailySessions = parseInt(localStorage.getItem('dailySessions_' + new Date().toDateString())) || 0;

    // Dark mode functionality
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
        darkModeToggle.innerHTML = '<i class="fas fa-sun text-yellow-500"></i>';
    }

    darkModeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('darkMode', isDark);
        darkModeToggle.innerHTML = isDark ? 
            '<i class="fas fa-sun text-yellow-500"></i>' : 
            '<i class="fas fa-moon text-gray-600"></i>';
    });

    function renderTasks() {
        taskList.innerHTML = '';
        let filtered = tasks.filter(task => {
            const matchesFilter = currentFilter === 'all' || 
                (currentFilter === 'active' && !task.completed) || 
                (currentFilter === 'completed' && task.completed);
            
            const matchesSearch = searchTerm === '' || 
                task.text.toLowerCase().includes(searchTerm.toLowerCase());
            
            return matchesFilter && matchesSearch;
        });

        // Sort tasks
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'dueDate':
                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                case 'priority':
                    const priorityOrder = { high: 3, normal: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                case 'alphabetical':
                    return a.text.localeCompare(b.text);
                default:
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });

        if (filtered.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
            filtered.forEach(task => {
                const taskElement = document.createElement('div');
                const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
                
                taskElement.className = `task-item bg-white p-3 rounded-md border border-gray-200 flex items-center justify-between ${
                    task.completed ? 'completed opacity-75' : ''
                } priority-${task.priority || 'normal'} ${isOverdue ? 'overdue' : ''} ${
                    selectedTasks.has(task.id) ? 'selected' : ''
                }`;
                taskElement.dataset.id = task.id;
                taskElement.draggable = true;

                taskElement.addEventListener('dragstart', (e) => {
                    draggedTaskId = task.id;
                    e.currentTarget.classList.add('dragging');
                });

                taskElement.addEventListener('dragend', (e) => {
                    e.currentTarget.classList.remove('dragging');
                    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
                });

                const categoryBadge = task.category ? 
                    `<span class="category-badge category-${task.category} mr-2">${getCategoryLabel(task.category)}</span>` : '';
                
                const dueDateBadge = task.dueDate ? 
                    `<span class="text-xs text-gray-500 mr-2">${formatDate(task.dueDate)}</span>` : '';

                const tagsBadges = task.tags && task.tags.length > 0 ? 
                    task.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';

                const bulkCheckbox = bulkMode ? 
                    `<input type="checkbox" class="task-checkbox mr-2" ${selectedTasks.has(task.id) ? 'checked' : ''}>` : '';

                taskElement.innerHTML = `
                    <div class="flex items-center">
                        ${bulkCheckbox}
                        <button class="complete-btn mr-3 w-6 h-6 rounded-full border-2 ${task.completed ? 'border-red-400 bg-red-400 text-white' : 'border-gray-300'} flex items-center justify-center">
                            ${task.completed ? '<i class="fas fa-check text-xs"></i>' : ''}
                        </button>
                        <div class="flex flex-col">
                            <span class="${task.completed ? 'text-gray-400' : 'text-gray-700'}">${task.text}</span>
                            <div class="flex items-center mt-1">
                                ${categoryBadge}
                                ${dueDateBadge}
                                ${task.priority === 'high' ? '<i class="fas fa-exclamation text-red-500 text-xs mr-2"></i>' : ''}
                                ${tagsBadges}
                            </div>
                            ${task.subtasks && task.subtasks.length > 0 ? 
                                `<div class="text-xs text-gray-500 mt-1">${task.subtasks.filter(st => st.completed).length}/${task.subtasks.length} サブタスク完了</div>` : ''
                            }
                        </div>
                    </div>
                    <div class="flex items-center">
                        <button class="add-subtask-btn text-gray-400 hover:text-blue-400 mr-2" title="サブタスク追加"><i class="fas fa-plus text-xs"></i></button>
                        <button class="start-timer-btn text-gray-400 hover:text-green-400 mr-2" title="タイマー開始"><i class="fas fa-play text-xs"></i></button>
                        <button class="edit-btn text-gray-400 hover:text-red-400 mr-2"><i class="fas fa-pencil-alt"></i></button>
                        <button class="delete-btn text-gray-400 hover:text-red-400"><i class="fas fa-trash-alt"></i></button>
                    </div>
                `;
                taskList.appendChild(taskElement);

                // Add bulk selection event
                const checkbox = taskElement.querySelector('.task-checkbox');
                if (checkbox) {
                    checkbox.addEventListener('change', (e) => {
                        e.stopPropagation();
                        if (e.target.checked) {
                            selectedTasks.add(task.id);
                            taskElement.classList.add('selected');
                        } else {
                            selectedTasks.delete(task.id);
                            taskElement.classList.remove('selected');
                        }
                    });
                }
            });
        }

        updateTaskCount();
        updateStatistics();
        renderCalendar();
        renderUpcomingTasks();
    }

    function updateTaskCount() {
        const activeCount = tasks.filter(t => !t.completed).length;
        taskCount.textContent = `${activeCount} 未完了タスク`;
        clearCompleted.style.display = tasks.some(t => t.completed) ? 'block' : 'none';
    }

    function showNotification(msg) {
        notificationMessage.textContent = msg;
        notification.classList.remove('translate-y-10', 'opacity-0');
        notification.classList.add('translate-y-0', 'opacity-100');
        setTimeout(() => {
            notification.classList.remove('translate-y-0', 'opacity-100');
            notification.classList.add('translate-y-10', 'opacity-0');
        }, 3000);
    }

    taskForm.addEventListener('submit', e => {
        e.preventDefault();
        const text = taskInput.value.trim();
        if (!text) return showNotification('タスクを入力してください');

        const newTask = {
            id: Date.now(),
            text,
            completed: false,
            createdAt: new Date().toISOString(),
            dueDate: dueDateInput.value || null,
            priority: priorityInput.value || 'normal',
            category: categoryInput.value || 'general',
            tags: tagsInput.value ? tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
            subtasks: [],
            timeSpent: 0
        };

        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        taskInput.value = '';
        dueDateInput.value = '';
        priorityInput.value = 'normal';
        categoryInput.value = 'general';
        tagsInput.value = '';
        tagsInputContainer.classList.add('hidden');
        
        renderTasks();
        showNotification('タスクを追加しました');
    });

    taskList.addEventListener('click', e => {
        const taskElement = e.target.closest('.task-item');
        if (!taskElement) return;
        const id = parseInt(taskElement.dataset.id);
        const index = tasks.findIndex(t => t.id === id);
        if (index === -1) return;

        if (e.target.closest('.complete-btn')) {
            tasks[index].completed = !tasks[index].completed;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
            showNotification(tasks[index].completed ? 'タスクを完了しました' : 'タスクを未完了に戻しました');
        }

        if (e.target.closest('.delete-btn')) {
            tasks.splice(index, 1);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
            showNotification('タスクを削除しました');
        }

        if (e.target.closest('.edit-btn')) {
            const newText = prompt('タスクを編集:', tasks[index].text);
            if (newText && newText.trim() !== '') {
                tasks[index].text = newText.trim();
                localStorage.setItem('tasks', JSON.stringify(tasks));
                renderTasks();
                showNotification('タスクを更新しました');
            }
        }
    });

    allTasksBtn.addEventListener('click', () => {
        currentFilter = 'all';
        updateFilterButtons();
        renderTasks();
    });

    activeTasksBtn.addEventListener('click', () => {
        currentFilter = 'active';
        updateFilterButtons();
        renderTasks();
    });

    completedTasksBtn.addEventListener('click', () => {
        currentFilter = 'completed';
        updateFilterButtons();
        renderTasks();
    });

    function updateFilterButtons() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('text-red-500', 'border-b-2', 'border-red-500', 'font-medium');
            btn.classList.add('text-gray-500', 'hover:text-gray-700');
        });

        const activeBtn = {
            all: allTasksBtn,
            active: activeTasksBtn,
            completed: completedTasksBtn
        }[currentFilter];

        activeBtn.classList.add('text-red-500', 'border-b-2', 'border-red-500', 'font-medium');
        activeBtn.classList.remove('text-gray-500', 'hover:text-gray-700');
    }

    clearCompleted.addEventListener('click', () => {
        tasks = tasks.filter(t => !t.completed);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        showNotification('完了したタスクをクリアしました');
    });

    function renderCalendar() {
        const monthOptions = { year: 'numeric', month: 'long' };
        currentMonthEl.textContent = new Date(currentYear, currentMonth).toLocaleDateString('ja-JP', monthOptions);

        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

        calendarDaysEl.innerHTML = '';

        for (let i = firstDay - 1; i >= 0; i--) {
            const d = document.createElement('div');
            d.className = 'calendar-day text-center py-1 text-gray-300';
            d.textContent = prevMonthDays - i;
            calendarDaysEl.appendChild(d);
        }

        const today = new Date();

        for (let i = 1; i <= daysInMonth; i++) {
            const d = document.createElement('div');
            d.className = 'calendar-day text-center py-1 cursor-pointer relative';

            const hasTasks = tasks.some(t => {
                const td = new Date(t.createdAt);
                return td.getDate() === i && td.getMonth() === currentMonth && td.getFullYear() === currentYear;
            });

            if (hasTasks) d.classList.add('has-tasks');
            if (i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
                d.classList.add('today');
            }

            d.textContent = i;
            d.dataset.day = i;
            d.dataset.month = currentMonth;
            d.dataset.year = currentYear;

            d.addEventListener('click', () => {
                const day = parseInt(d.dataset.day);
                const month = parseInt(d.dataset.month);
                const year = parseInt(d.dataset.year);

                const filtered = tasks.filter(t => {
                    const td = new Date(t.createdAt);
                    return td.getDate() === day && td.getMonth() === month && td.getFullYear() === year;
                });

                taskList.innerHTML = '';
                if (filtered.length === 0) {
                    emptyState.style.display = 'block';
                } else {
                    emptyState.style.display = 'none';
                    filtered.forEach(task => {
                        const el = document.createElement('div');
                        el.className = `task-item bg-white p-3 rounded-md border border-gray-200 flex items-center justify-between ${task.completed ? 'completed opacity-75' : ''}`;
                        el.dataset.id = task.id;
                        el.innerHTML = `
                            <div class="flex items-center">
                                <button class="complete-btn mr-3 w-6 h-6 rounded-full border-2 ${task.completed ? 'border-red-400 bg-red-400 text-white' : 'border-gray-300'} flex items-center justify-center">
                                    ${task.completed ? '<i class="fas fa-check text-xs"></i>' : ''}
                                </button>
                                <span class="${task.completed ? 'text-gray-400' : 'text-gray-700'}">${task.text}</span>
                            </div>
                            <div class="flex items-center">
                                <button class="edit-btn text-gray-400 hover:text-red-400 mr-2"><i class="fas fa-pencil-alt"></i></button>
                                <button class="delete-btn text-gray-400 hover:text-red-400"><i class="fas fa-trash-alt"></i></button>
                            </div>`;
                        taskList.appendChild(el);
                    });
                }

                updateTaskCount();
            });

            calendarDaysEl.appendChild(d);
        }

        const totalCells = 42;
        const added = firstDay + daysInMonth;
        for (let i = 1; i <= totalCells - added; i++) {
            const d = document.createElement('div');
            d.className = 'calendar-day text-center py-1 text-gray-300';
            d.textContent = i;
            calendarDaysEl.appendChild(d);
        }
    }

    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
        renderUpcomingTasks();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
        renderUpcomingTasks();
    });

    function renderUpcomingTasks() {
        upcomingTasksEl.innerHTML = '';
        const today = new Date();
        const next3 = [];

        for (let i = 0; i < 3; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            next3.push(d);
        }

        const upcoming = tasks.filter(t => {
            if (t.completed) return false;
            const td = new Date(t.createdAt);
            return next3.some(d => td.getDate() === d.getDate() && td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear());
        });

        if (upcoming.length === 0) {
            upcomingTasksEl.innerHTML = `<div class="text-center py-4 text-gray-400 text-sm">近日のタスクはありません</div>`;
            return;
        }

        upcoming.forEach(task => {
            const el = document.createElement('div');
            el.className = 'bg-gray-50 p-2 rounded text-sm flex items-center';
            const td = new Date(task.createdAt);
            const dayName = td.toLocaleDateString('ja-JP', { weekday: 'short' });
            el.innerHTML = `<div class="bg-red-100 text-red-600 text-xs px-2 py-1 rounded mr-2">${dayName}</div><span class="truncate">${task.text}</span>`;
            upcomingTasksEl.appendChild(el);
        });
    }

    // Helper functions
    function getCategoryLabel(category) {
        const labels = {
            work: '仕事',
            personal: '個人',
            shopping: '買い物',
            health: '健康',
            general: '一般'
        };
        return labels[category] || '一般';
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const diffTime = date - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return '今日';
        if (diffDays === 1) return '明日';
        if (diffDays === -1) return '昨日';
        if (diffDays < 0) return `${Math.abs(diffDays)}日前`;
        return `${diffDays}日後`;
    }

    function updateStatistics() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const overdue = tasks.filter(t => 
            t.dueDate && new Date(t.dueDate) < new Date() && !t.completed
        ).length;
        
        document.getElementById('total-tasks').textContent = total;
        document.getElementById('completed-tasks').textContent = completed;
        document.getElementById('pending-tasks').textContent = pending;
        document.getElementById('overdue-tasks').textContent = overdue;
        
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
        document.getElementById('progress-percentage').textContent = `${progress}%`;
        document.getElementById('progress-bar').style.width = `${progress}%`;
    }

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value;
        renderTasks();
    });

    // Sort functionality
    sortSelect.addEventListener('change', (e) => {
        sortBy = e.target.value;
        renderTasks();
    });

    // Export functionality
    exportBtn.addEventListener('click', () => {
        const dataStr = JSON.stringify(tasks, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tasks_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        showNotification('タスクをエクスポートしました');
    });

    // Import functionality
    importBtn.addEventListener('click', () => {
        importFile.click();
    });

    importFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedTasks = JSON.parse(e.target.result);
                if (Array.isArray(importedTasks)) {
                    tasks = [...tasks, ...importedTasks.map(task => ({
                        ...task,
                        id: Date.now() + Math.random()
                    }))];
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                    renderTasks();
                    showNotification('タスクをインポートしました');
                } else {
                    showNotification('無効なファイル形式です');
                }
            } catch (error) {
                showNotification('ファイルの読み込みに失敗しました');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' && e.target.type === 'text') return;
        
        switch (e.key.toLowerCase()) {
            case 'n':
                if (!e.ctrlKey) {
                    fabBtn.click();
                    e.preventDefault();
                }
                break;
            case 'f':
                if (e.ctrlKey) {
                    searchInput.focus();
                    e.preventDefault();
                }
                break;
            case 'a':
                if (e.ctrlKey) {
                    document.getElementById('select-all-tasks').click();
                    e.preventDefault();
                }
                break;
            case 'd':
                if (e.ctrlKey) {
                    clearCompleted.click();
                    e.preventDefault();
                }
                break;
            case 'm':
                if (e.ctrlKey) {
                    darkModeToggle.click();
                    e.preventDefault();
                }
                break;
            case 'e':
                if (e.ctrlKey) {
                    exportBtn.click();
                    e.preventDefault();
                }
                break;
            case '?':
                shortcutsModal.classList.remove('hidden');
                e.preventDefault();
                break;
            case 'escape':
                quickAddModal.classList.add('hidden');
                shortcutsModal.classList.add('hidden');
                break;
        }
    });

    // Quick Add Modal
    fabBtn.addEventListener('click', () => {
        quickAddModal.classList.remove('hidden');
        document.getElementById('quick-task-input').focus();
    });

    document.getElementById('close-modal').addEventListener('click', () => {
        quickAddModal.classList.add('hidden');
    });

    document.getElementById('cancel-quick-add').addEventListener('click', () => {
        quickAddModal.classList.add('hidden');
    });

    document.getElementById('close-shortcuts').addEventListener('click', () => {
        shortcutsModal.classList.add('hidden');
    });

    // Quick add form submission
    document.getElementById('quick-add-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const text = document.getElementById('quick-task-input').value.trim();
        if (!text) return;

        const newTask = {
            id: Date.now(),
            text,
            completed: false,
            createdAt: new Date().toISOString(),
            dueDate: document.getElementById('quick-due-date').value || null,
            priority: document.getElementById('quick-priority').value || 'normal',
            category: document.getElementById('quick-category').value || 'general',
            tags: [],
            subtasks: [],
            timeSpent: 0
        };

        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        showNotification('タスクを追加しました');
        
        // Reset form
        document.getElementById('quick-add-form').reset();
        quickAddModal.classList.add('hidden');
    });

    // Tags functionality
    addTagsBtn.addEventListener('click', () => {
        tagsInputContainer.classList.toggle('hidden');
        if (!tagsInputContainer.classList.contains('hidden')) {
            tagsInput.focus();
        }
    });

    // Bulk actions
    bulkActionsBtn.addEventListener('click', () => {
        bulkMode = !bulkMode;
        bulkActionsPanel.classList.toggle('hidden');
        document.body.classList.toggle('bulk-mode', bulkMode);
        
        if (!bulkMode) {
            selectedTasks.clear();
            document.querySelectorAll('.task-item').forEach(item => {
                item.classList.remove('selected');
            });
        }
        renderTasks();
    });

    document.getElementById('close-bulk-actions').addEventListener('click', () => {
        bulkMode = false;
        bulkActionsPanel.classList.add('hidden');
        document.body.classList.remove('bulk-mode');
        selectedTasks.clear();
        renderTasks();
    });

    // Timer functionality
    function updateTimerDisplay() {
        const minutes = Math.floor(timerSeconds / 60);
        const seconds = timerSeconds % 60;
        document.getElementById('timer-display').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        const totalSeconds = isBreakTime ? 5 * 60 : 25 * 60;
        const progress = ((totalSeconds - timerSeconds) / totalSeconds) * 100;
        document.getElementById('timer-progress').style.width = `${progress}%`;
    }

    document.getElementById('start-timer').addEventListener('click', () => {
        if (!isTimerRunning) {
            isTimerRunning = true;
            document.getElementById('timer-display').classList.add('timer-active');
            
            timerInterval = setInterval(() => {
                timerSeconds--;
                updateTimerDisplay();
                
                if (timerSeconds <= 0) {
                    // Timer finished
                    isTimerRunning = false;
                    clearInterval(timerInterval);
                    document.getElementById('timer-display').classList.remove('timer-active');
                    
                    if (!isBreakTime) {
                        // Work session completed
                        sessionCount++;
                        dailySessions++;
                        localStorage.setItem('sessionCount', sessionCount);
                        localStorage.setItem('dailySessions_' + new Date().toDateString(), dailySessions);
                        
                        document.getElementById('session-count').textContent = sessionCount;
                        document.getElementById('daily-sessions').textContent = dailySessions;
                        
                        // Start break
                        isBreakTime = true;
                        timerSeconds = 5 * 60; // 5 minute break
                        document.getElementById('timer-status').textContent = '休憩時間';
                        showNotification('作業セッション完了！5分休憩してください。');
                    } else {
                        // Break completed
                        isBreakTime = false;
                        timerSeconds = 25 * 60;
                        document.getElementById('timer-status').textContent = '作業時間';
                        showNotification('休憩終了！新しい作業セッションを開始してください。');
                    }
                    updateTimerDisplay();
                }
            }, 1000);
        }
    });

    document.getElementById('pause-timer').addEventListener('click', () => {
        if (isTimerRunning) {
            isTimerRunning = false;
            clearInterval(timerInterval);
            document.getElementById('timer-display').classList.remove('timer-active');
        }
    });

    document.getElementById('reset-timer').addEventListener('click', () => {
        isTimerRunning = false;
        clearInterval(timerInterval);
        document.getElementById('timer-display').classList.remove('timer-active');
        timerSeconds = isBreakTime ? 5 * 60 : 25 * 60;
        updateTimerDisplay();
    });

    // Initialize timer display
    document.getElementById('session-count').textContent = sessionCount;
    document.getElementById('daily-sessions').textContent = dailySessions;
    updateTimerDisplay();

    // Drag and Drop functionality
    function allowDrop(ev) {
        ev.preventDefault();
        ev.currentTarget.classList.add('drag-over');
    }

    function drop(ev) {
        ev.preventDefault();
        ev.currentTarget.classList.remove('drag-over');
        
        if (draggedTaskId) {
            const draggedIndex = tasks.findIndex(t => t.id === draggedTaskId);
            const targetElement = ev.target.closest('.task-item');
            
            if (targetElement && draggedIndex !== -1) {
                const targetId = parseInt(targetElement.dataset.id);
                const targetIndex = tasks.findIndex(t => t.id === targetId);
                
                if (targetIndex !== -1) {
                    // Reorder tasks
                    const draggedTask = tasks.splice(draggedIndex, 1)[0];
                    tasks.splice(targetIndex, 0, draggedTask);
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                    renderTasks();
                    showNotification('タスクの順序を変更しました');
                }
            }
        }
        draggedTaskId = null;
    }

    // Make drag and drop global functions
    window.allowDrop = allowDrop;
    window.drop = drop;

    renderTasks();
});
