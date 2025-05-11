export let stores = {};
export let categories = {};

// Сохранение данных формы в localStorage
function saveFormData() {
    const storeName = document.getElementById('storeName').value;
    const lastName = document.getElementById('lastName').value;

    if (storeName || lastName) {
        localStorage.setItem('formData', JSON.stringify({ storeName, lastName }));
    } else {
        localStorage.removeItem('formData');
    }
}

// Восстановление данных из localStorage
function loadFormData() {
    const storedData = JSON.parse(localStorage.getItem('formData'));
    if (storedData) {
        document.getElementById('storeName').value = storedData.storeName;
        document.getElementById('lastName').value = storedData.lastName;

        if (storedData.storeName) {
            renderItems(storedData.storeName); // Рендерим товары для сохраненной точки
        }
    }
}

// Загрузка начальных данных
export async function loadInitialData() {
    try {
        const [storesResponse, categoriesResponse] = await Promise.all([
            fetch('stores.json'),
            fetch('categories.json')
        ]);

        if (!storesResponse.ok || !categoriesResponse.ok) {
            throw new Error("Ошибка загрузки данных.");
        }

        stores = await storesResponse.json();
        categories = await categoriesResponse.json();

        console.log("Stores загружены:", stores);
        console.log("Categories загружены:", categories);

        const storeSelect = document.getElementById('storeName');
        Object.keys(stores).forEach(store => {
            const option = document.createElement('option');
            option.value = store;
            option.textContent = store;
            storeSelect.appendChild(option);
        });

        loadFormData(); // Восстанавливаем данные из localStorage
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error.message);
        alert("Не удалось загрузить данные. Проверьте файлы stores.json и categories.json.");
    }
}

// Рендеринг категорий для выбранного магазина
export function renderItems(storeName) {
    const itemsContainer = document.getElementById('itemsContainer');

    while (itemsContainer.firstChild) {
        itemsContainer.firstChild.remove();
    }

    const storeCategories = stores[storeName] || [];

    storeCategories.forEach(category => {
        if (!Array.isArray(category.items)) return;

        const categoryDiv = document.createElement('details');
        categoryDiv.innerHTML = `
            <summary>${category.name}</summary>
            <div class="category-container">
                ${category.items.map(item => `
                    <div class="item-row">
                        <span>${item}</span>
                        <input type="hidden" name="itemName[]" value="${item}">
                        <input type="number" placeholder="Количество" name="quantity[]" min="0" max="1000">
                    </div>
                `).join('')}
            </div>
        `;
        itemsContainer.appendChild(categoryDiv);
    });
}

// Обработчик изменения торговой точки
document.getElementById('storeName').addEventListener('change', function () {
    const selectedStore = this.value;

    if (selectedStore) {
        renderItems(selectedStore); // Рендерим товары для выбранной точки
        saveFormData(); // Сохраняем выбранные данные
    } else {
        document.getElementById('itemsContainer').innerHTML = ''; // Очищаем контейнер, если ничего не выбрано
        saveFormData(); // Очищаем данные в localStorage
    }
});

// Инициализация страницы
document.addEventListener('DOMContentLoaded', loadInitialData);
