import { stores, renderItems } from './script.js';

let uploadedFile = null;

// Кэширование DOM-элементов
const storeNameSelect = document.getElementById('storeName');
const uploadFileInput = document.getElementById('uploadFile');
const loadButton = document.getElementById('loadButton');
const fileError = document.getElementById('fileError');

// Обработчик выбора файла
export function handleFileSelection(event) {
    const file = event.target.files[0];
    const selectedStore = storeNameSelect.value;

    if (!selectedStore) {
        showError("Пожалуйста, выберите торговую точку перед загрузкой файла.");
        hideLoadButton();
        return;
    }

    if (!file || !file.name.endsWith('.txt')) {
        showError("Ошибка: Загрузите файл с расширением '.txt'.");
        hideLoadButton();
        return;
    }

    uploadedFile = file;
    showLoadButton();
}

// Обработка нажатия на кнопку "Загрузить на торговую точку"
export function processUploadedFile() {
    const selectedStore = storeNameSelect.value;

    if (!uploadedFile) {
        showError("Файл не выбран.");
        return;
    }

    if (!selectedStore) {
        showError("Пожалуйста, выберите торговую точку.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        const fileContent = e.target.result.trim();
        const lines = fileContent.split('\n').map(line => line.trim());

        if (!lines.some(line => line.startsWith('#'))) {
            showError("Ошибка: Файл имеет некорректный формат. Категории должны начинаться с '#'.");
            return;
        }

        if (!stores[selectedStore]) {
            stores[selectedStore] = [];
        } else {
            stores[selectedStore].splice(0, stores[selectedStore].length);
        }

        let currentCategory = null;

        lines.forEach(line => {
            if (line.startsWith('#')) {
                const categoryName = line.slice(1).trim();
                if (categoryName) {
                    currentCategory = { name: categoryName, items: [] };
                    stores[selectedStore].push(currentCategory);
                }
            } else if (currentCategory && line.trim() !== '') {
                currentCategory.items.push(line.trim());
            }
        });

        renderItems(selectedStore); // Перерисовываем интерфейс
        showSuccessMessage();

        // Сохраняем данные в localStorage
        saveFormData();
    };

    reader.onerror = function () {
        showError("Ошибка чтения файла. Попробуйте снова.");
    };

    reader.readAsText(uploadedFile);
}

// Управление видимостью кнопки "Загрузить"
function showLoadButton() {
    loadButton.style.display = 'block';
}

function hideLoadButton() {
    loadButton.style.display = 'none';
}

// Вывод ошибок
function showError(message) {
    fileError.textContent = message;
    fileError.style.display = 'block';
}

// Сброс ошибок
function clearError() {
    fileError.style.display = 'none';
}

// Вывод успешного сообщения
function showSuccessMessage() {
    alert("Список товаров успешно обновлен!");
    clearError();
}

// Сброс загрузки файла
function resetFileUpload() {
    uploadedFile = null;
    uploadFileInput.value = '';
    hideLoadButton();
}
