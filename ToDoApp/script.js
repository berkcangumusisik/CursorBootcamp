// Bu kod, bir Todo uygulamasının ana işlevselliğini sağlar.
// Uygulama, görev ekleme, düzenleme, silme, zamanlayıcı ve kronometre özelliklerini içerir.
// Ayrıca çoklu dil desteği ve karanlık mod özelliği de mevcuttur.

// Sayfa yüklendiğinde çalışacak ana fonksiyon
document.addEventListener('DOMContentLoaded', () => {
    // HTML elementlerini seç
    // Bu elementler, kullanıcı arayüzündeki çeşitli bileşenleri temsil eder
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoDetails = document.getElementById('todo-details');
    const todoList = document.getElementById('todo-list');
    const editModal = document.getElementById('edit-modal');
    const editTodoInput = document.getElementById('edit-todo-input');
    const editTodoDetails = document.getElementById('edit-todo-details');
    const saveEditBtn = document.getElementById('save-edit');
    const cancelEditBtn = document.getElementById('cancel-edit');
    const themeToggle = document.getElementById('theme-toggle');
    const languageSelect = document.getElementById('language-select');
    const timerInput = document.getElementById('timer-input');
    const startTimerBtn = document.getElementById('start-timer');
    const stopTimerBtn = document.getElementById('stop-timer');
    const startStopwatchBtn = document.getElementById('start-stopwatch');
    const timerDisplay = document.getElementById('timer-display');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const stopStopwatchBtn = document.getElementById('stop-stopwatch');
    const resetStopwatchBtn = document.getElementById('reset-stopwatch');
    const stopwatchDisplay = document.getElementById('stopwatch-display');

    // Global değişkenler
    // Bu değişkenler, uygulamanın genel durumunu takip etmek için kullanılır
    let currentEditingTodo = null; // Şu anda düzenlenen görevin referansını tutar
    let currentLanguage = 'tr'; // Mevcut dil ayarını tutar
    let timerInterval; // Zamanlayıcı için interval referansını tutar
    let stopwatchInterval; // Kronometre için interval referansını tutar
    let seconds = 0; // Kronometre ve zamanlayıcı için saniye sayacı
    let isStopwatchRunning = false; // Kronometrenin çalışıp çalışmadığını kontrol eder

    // Çeviri nesnesi
    // Bu nesne, uygulamanın çoklu dil desteği için gerekli çevirileri içerir
    const translations = {
        tr: {
            // Türkçe çeviriler
            title: 'Todo Listesi',
            addTodo: 'Ekle',
            editTodo: 'Todo Düzenle',
            save: 'Kaydet',
            cancel: 'İptal',
            delete: 'Sil',
            edit: 'Düzenle',
            newTodo: 'Yeni görev ekle',
            todoDetails: 'Görev detayları (isteğe bağlı)',
            startTimer: 'Zamanlayıcıyı Başlat',
            stopTimer: 'Zamanlayıcıyı Durdur',
            minutes: 'Dakika',
            todo: 'Todo',
            timer: 'Zamanlayıcı',
            stopwatch: 'Kronometre',
            start: 'Başlat',
            stop: 'Durdur',
            reset: 'Sıfırla',
            complete: 'Tamamla',
            undo: 'Geri Al'
        },
        en: {
            // İngilizce çeviriler
            title: 'Todo List',
            addTodo: 'Add',
            editTodo: 'Edit Todo',
            save: 'Save',
            cancel: 'Cancel',
            delete: 'Delete',
            edit: 'Edit',
            newTodo: 'Add new task',
            todoDetails: 'Task details (optional)',
            startTimer: 'Start Timer',
            stopTimer: 'Stop Timer',
            minutes: 'Minutes',
            todo: 'Todo',
            timer: 'Timer',
            stopwatch: 'Stopwatch',
            start: 'Start',
            stop: 'Stop',
            reset: 'Reset',
            complete: 'Complete',
            undo: 'Undo'
        }
    };

    // Dil değiştirme fonksiyonu
    // Bu fonksiyon, kullanıcı arayüzündeki tüm metinleri seçilen dile göre günceller
    function updateLanguage() {
        // HTML elementlerinin içeriklerini güncelle
        document.getElementById('title').textContent = translations[currentLanguage].title;
        document.getElementById('add-todo').textContent = translations[currentLanguage].addTodo;
        document.getElementById('edit-title').textContent = translations[currentLanguage].editTodo;
        document.getElementById('save-edit').textContent = translations[currentLanguage].save;
        document.getElementById('cancel-edit').textContent = translations[currentLanguage].cancel;
        document.getElementById('todo-input').placeholder = translations[currentLanguage].newTodo;
        document.getElementById('todo-details').placeholder = translations[currentLanguage].todoDetails;
        document.getElementById('start-timer').textContent = translations[currentLanguage].startTimer;
        document.getElementById('stop-timer').textContent = translations[currentLanguage].stopTimer;
        document.getElementById('timer-input').placeholder = translations[currentLanguage].minutes;
        document.querySelectorAll('.tab-button')[0].textContent = translations[currentLanguage].todo;
        document.querySelectorAll('.tab-button')[1].textContent = translations[currentLanguage].timer;
        document.querySelectorAll('.tab-button')[2].textContent = translations[currentLanguage].stopwatch;
        document.getElementById('start-stopwatch').textContent = translations[currentLanguage].start;
        document.getElementById('stop-stopwatch').textContent = translations[currentLanguage].stop;
        document.getElementById('reset-stopwatch').textContent = translations[currentLanguage].reset;

        // Butonların metinlerini güncelle
        document.querySelectorAll('.delete-btn').forEach(btn => btn.textContent = translations[currentLanguage].delete);
        document.querySelectorAll('.edit-btn').forEach(btn => btn.textContent = translations[currentLanguage].edit);

        document.querySelectorAll('.complete-btn').forEach(btn => {
            const todoItem = btn.closest('.todo-item');
            const isCompleted = todoItem.querySelector('.todo-text').classList.contains('completed');
            btn.textContent = isCompleted ? translations[currentLanguage].undo : translations[currentLanguage].complete;
        });
    }

    // Dil seçimi değiştiğinde çalışacak olay dinleyicisi
    languageSelect.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        updateLanguage();
    });

    // Tema değiştirme butonu için olay dinleyicisi
    // Bu fonksiyon, karanlık mod ve aydınlık mod arasında geçiş yapar
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });

    // Tab geçişlerini yöneten fonksiyon
    // Bu fonksiyon, kullanıcı farklı bir sekmeye tıkladığında çağrılır
    function switchTab(tabName) {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        const activeTab = document.querySelector(`.tab-button[data-tab="${tabName}"]`);
        const activeContent = document.getElementById(`${tabName}-tab`);

        activeTab.classList.add('active');
        activeContent.classList.add('active');

        // Tab içeriğini yükle
        loadTabContent(tabName);
    }

    // Tab içeriğini yükleyen fonksiyon
    // Bu fonksiyon, seçilen sekmenin içeriğini hazırlar
    function loadTabContent(tabName) {
        switch(tabName) {
            case 'todo':
                // Todo listesini yükle (zaten yüklü olduğu için bir şey yapmaya gerek yok)
                break;
            case 'timer':
                // Zamanlayıcıyı sıfırla
                clearInterval(timerInterval);
                timerDisplay.textContent = '00:00:00';
                break;
            case 'stopwatch':
                // Kronometreyi sıfırla
                clearInterval(stopwatchInterval);
                isStopwatchRunning = false;
                seconds = 0;
                stopwatchDisplay.textContent = formatTime(seconds);
                break;
        }
    }

    // Tab butonlarına tıklama olayı ekle
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    // Zamanı biçimlendiren yardımcı fonksiyon
    // Bu fonksiyon, saniye cinsinden verilen süreyi saat:dakika:saniye formatına çevirir
    function formatTime(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Zamanlayıcıyı başlatma butonu için olay dinleyicisi
    startTimerBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        const minutes = parseInt(timerInput.value);
        if (minutes > 0) {
            seconds = minutes * 60;
            timerInterval = setInterval(() => {
                seconds--;
                timerDisplay.textContent = formatTime(seconds);
                if (seconds <= 0) {
                    clearInterval(timerInterval);
                    alert(currentLanguage === 'tr' ? 'Süre doldu!' : 'Time is up!');
                }
            }, 1000);
        }
    });

    // Zamanlayıcıyı durdurma butonu için olay dinleyicisi
    stopTimerBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
    });

    // Kronometreyi başlatma butonu için olay dinleyicisi
    startStopwatchBtn.addEventListener('click', () => {
        if (!isStopwatchRunning) {
            isStopwatchRunning = true;
            stopwatchInterval = setInterval(() => {
                seconds++;
                stopwatchDisplay.textContent = formatTime(seconds);
            }, 1000);
        }
    });

    // Kronometreyi durdurma butonu için olay dinleyicisi
    stopStopwatchBtn.addEventListener('click', () => {
        clearInterval(stopwatchInterval);
        isStopwatchRunning = false;
    });

    // Kronometreyi sıfırlama butonu için olay dinleyicisi
    resetStopwatchBtn.addEventListener('click', () => {
        clearInterval(stopwatchInterval);
        isStopwatchRunning = false;
        seconds = 0;
        stopwatchDisplay.textContent = formatTime(seconds);
    });

    // Todo formu gönderildiğinde çalışacak olay dinleyicisi
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTodo();
    });

    // Yeni todo ekleme fonksiyonu
    // Bu fonksiyon, kullanıcının girdiği görev metnini alır ve listeye yeni bir görev ekler
    function addTodo() {
        const todoText = todoInput.value.trim();
        const todoDetailsText = todoDetails.value.trim();
        if (todoText !== '') {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="todo-item">
                    <span class="todo-text">${todoText}</span>
                    <p class="todo-details">${todoDetailsText}</p>
                    <div class="todo-actions">
                        <button class="complete-btn">${translations[currentLanguage].complete}</button>
                        <button class="edit-btn">${translations[currentLanguage].edit}</button>
                        <button class="delete-btn">${translations[currentLanguage].delete}</button>
                    </div>
                </div>
            `;
            li.style.opacity = '0';
            todoList.appendChild(li);
            todoInput.value = '';
            todoDetails.value = '';

            // Animasyon için opacity'yi ayarla
            setTimeout(() => {
                li.style.opacity = '1';
            }, 10);

            // Tamamlama butonu için olay dinleyicisi
            const completeBtn = li.querySelector('.complete-btn');
            completeBtn.addEventListener('click', () => {
                li.querySelector('.todo-text').classList.toggle('completed');
                li.querySelector('.todo-details').classList.toggle('completed');
                completeBtn.textContent = li.querySelector('.todo-text').classList.contains('completed')
                    ? translations[currentLanguage].undo
                    : translations[currentLanguage].complete;
            });

            // Silme butonu için olay dinleyicisi
            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                showConfirmDialog(
                    currentLanguage === 'tr' ? 'Bu görevi silmek istediğinizden emin misiniz?' : 'Are you sure you want to delete this task?',
                    () => {
                        li.style.opacity = '0';
                        li.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            li.remove();
                        }, 300);
                    }
                );
            });

            // Düzenleme butonu için olay dinleyicisi
            const editBtn = li.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => {
                currentEditingTodo = li;
                editTodoInput.value = li.querySelector('.todo-text').textContent;
                editTodoDetails.value = li.querySelector('.todo-details').textContent;
                editModal.style.display = 'block';
            });
        }
    }

    // Onay dialogu gösteren fonksiyon
    // Bu fonksiyon, kullanıcıya bir onay mesajı gösterir ve kullanıcının seçimine göre işlem yapar
    function showConfirmDialog(message, onConfirm) {
        const dialog = document.createElement('div');
        dialog.className = 'confirm-dialog';
        dialog.innerHTML = `
            <p>${message}</p>
            <div class="confirm-dialog-buttons">
                <button id="confirm-yes">${currentLanguage === 'tr' ? 'Evet' : 'Yes'}</button>
                <button id="confirm-no">${currentLanguage === 'tr' ? 'Hayır' : 'No'}</button>
            </div>
        `;
        document.body.appendChild(dialog);

        document.getElementById('confirm-yes').addEventListener('click', () => {
            onConfirm();
            document.body.removeChild(dialog);
        });

        document.getElementById('confirm-no').addEventListener('click', () => {
            document.body.removeChild(dialog);
        });
    }

    // Düzenleme kaydetme butonu için olay dinleyicisi
    saveEditBtn.addEventListener('click', () => {
        if (currentEditingTodo) {
            currentEditingTodo.querySelector('.todo-text').textContent = editTodoInput.value;
            currentEditingTodo.querySelector('.todo-details').textContent = editTodoDetails.value;
            editModal.style.display = 'none';
            currentEditingTodo = null;
        }
    });

    // Düzenleme iptal butonu için olay dinleyicisi
    cancelEditBtn.addEventListener('click', () => {
        editModal.style.display = 'none';
        currentEditingTodo = null;
    });

    // Modal dışına tıklandığında modalı kapatma
    window.addEventListener('click', (event) => {
        if (event.target === editModal) {
            editModal.style.display = 'none';
            currentEditingTodo = null;
        }
    });

    // Dil güncellemesini çağır
    updateLanguage();

    // Sayfa yüklendiğinde varsayılan olarak 'todo' tabını göster
    switchTab('todo');
});

// Not: Bu kod, modern web tarayıcılarında çalışacak şekilde tasarlanmıştır.
// Eski tarayıcılarda bazı özellikler çalışmayabilir.
// Ayrıca, bu uygulama tarayıcı hafızasını kullanır, bu yüzden sayfayı yenilediğinizde veriler kaybolacaktır.
// Kalıcı veri saklamak için bir veritabanı veya local storage kullanılması önerilir.