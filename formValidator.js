export function validateForm() {
    const storeNameSelect = document.getElementById('storeName');
    const lastNameInput = document.getElementById('lastName');

    let isValid = true;

    // Проверка выбора торговой точки
    if (storeNameSelect.value === "") {
        document.getElementById('storeNameError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('storeNameError').style.display = 'none';
    }

    // Проверка ввода фамилии сотрудника
    if (lastNameInput.value.trim() === "") {
        document.getElementById('lastNameError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('lastNameError').style.display = 'none';
    }

    return isValid;
}

export function validateOrder(formData) {
    const itemNames = formData.getAll('itemName[]');
    const quantities = formData.getAll('quantity[]');

    for (let i = 0; i < itemNames.length; i++) {
        const itemName = itemNames[i];
        const quantity = parseInt(quantities[i], 10);

        // Проверяем, что количество — число
        if (!isNaN(quantity) && quantity > 0) {
            // Если товар содержит "Кратное 4шт", проверяем кратность
            if (itemName.includes("Кратное 4шт") && quantity % 4 !== 0) {
                showError(`Ошибка: Количество для товара "${itemName}" должно быть кратно 4.`);
                return false;
            }
        } else if (!isNaN(quantity) && quantity < 0) {
            // Запрещаем отрицательные значения
            showError(`Ошибка: Количество для товара "${itemName}" не может быть отрицательным.`);
            return false;
        }
    }

    // Разрешаем отправку формы, даже если выбран только один товар
    return true;
}

function showError(message) {
    const errorContainer = document.getElementById('orderError');
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
}

function clearError() {
    const errorContainer = document.getElementById('orderError');
    errorContainer.style.display = 'none';
}
