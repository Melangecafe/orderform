import { validateForm } from './formValidator.js';

document.addEventListener('DOMContentLoaded', () => {
    const whatsappButton = document.querySelector('.green-button');

    if (whatsappButton) {
        whatsappButton.addEventListener('click', shareTextViaWhatsApp);
    }
});

function shareTextViaWhatsApp() {
    console.log("Кнопка 'Поделиться в WhatsApp' нажата");

    const form = document.getElementById('orderForm');
    const formData = new FormData(form);

    // Валидация формы
    if (!validateForm(formData)) {
        showError("Ошибка: Пожалуйста, заполните форму корректно.");
        return;
    }

    // Генерация данных заказа
    const orderData = generateOrderData(formData);

    // Формирование текста для WhatsApp
    let whatsappMessage = `*Заказ для точки: ${formData.get('storeName')}*\n`;
    whatsappMessage += `Сотрудник: ${formData.get('lastName')}\n\n`;

    // Добавляем строку "Выпечка"
    whatsappMessage += `Товар\n`;

    // Разбиение данных на группы (бывшие категории)
    const groupedOrderData = groupItemsByCategory(orderData);

    groupedOrderData.forEach(group => {
        group.items.forEach(item => {
            whatsappMessage += `- ${item.name}: *${item.quantity} порц.*\n`;
        });
        whatsappMessage += '\n'; // Пустая строка между группами
    });

    // Удаляем последнюю пустую строку
    whatsappMessage = whatsappMessage.trim();

    // Кодирование сообщения для URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappLink = `https://wa.me/?text=${encodedMessage}`;

    // Открытие ссылки WhatsApp
    window.open(whatsappLink, '_blank');

    clearFormData();
    showSuccessMessage();
}

function showError(message) {
    const errorContainer = document.getElementById('orderError');
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
}

function showSuccessMessage() {
    alert("Данные успешно отправлены в WhatsApp!");
    clearError();
}

function generateOrderData(formData) {
    const itemNames = formData.getAll('itemName[]');
    const quantities = formData.getAll('quantity[]');
    const categories = formData.getAll('category[]');

    const orderData = [];

    for (let i = 0; i < itemNames.length; i++) {
        const category = categories[i];
        const itemName = itemNames[i];
        const quantity = parseInt(quantities[i], 10);

        if (quantity > 0) {
            orderData.push({ category, name: itemName, quantity });
        }
    }

    return orderData;
}

function groupItemsByCategory(orderData) {
    const groupedData = {};

    orderData.forEach(item => {
        const category = item.category;
        if (!groupedData[category]) {
            groupedData[category] = [];
        }
        groupedData[category].push(item);
    });

    return Object.keys(groupedData).map(category => ({
        items: groupedData[category]
    }));
}

function clearFormData() {
    document.getElementById('storeName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('itemsContainer').innerHTML = '';
}
