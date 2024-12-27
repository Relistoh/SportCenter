document.addEventListener('DOMContentLoaded', function () {
    // Навигация
    const navLinks = document.querySelectorAll('nav a');
    const windows = document.querySelectorAll('.window');

    // Обработчики для навигации
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const targetId = this.getAttribute('data-target');

            // Скрыть все окна
            windows.forEach(function (window) {
                window.classList.add('hidden');
            });

            // Показать выбранное окно
            document.getElementById(targetId).classList.remove('hidden');
        });
    });

    // Обработчик для формы входа
    // const loginForm = document.getElementById('login-form');
    // loginForm.addEventListener('submit', function (event) {
    //     event.preventDefault();
    //
    //     const username = document.getElementById('username').value;
    //     const password = document.getElementById('password').value;
    //
    //     // Проверка логина и пароля
    //     if (username === 'trainer' && password === 'password') {
    //         // Скрыть форму входа
    //         //document.getElementById('login').classList.add('hidden');
    //         // Показать панель тренера
    //         document.getElementById('trainer-panel').classList.remove('hidden');
    //
    //     } else {
    //         // Если неверные данные
    //         alert('Неверный логин или пароль');
    //     }
    // });

    // Функция для добавления занятия в расписание
    const addScheduleForm = document.getElementById('add-schedule-form');
    addScheduleForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const activity = document.getElementById('activity').value;
        const day = document.getElementById('day').value;
        const time = document.getElementById('time').value;

        // Создаем новую строку для расписания
        const newRow = document.createElement('div');
        newRow.classList.add('schedule-row');
        newRow.innerHTML = `
            <span>${activity}</span>
            <span>${day}</span>
            <span>${time}</span>
        `;

        // Добавляем строку в расписание
        document.getElementById('schedule-table').appendChild(newRow);
    });
});

// scripts.js

// Создаем массив объектов ObjInf
const ObjInf = [
  {
    id: '1',
    description: 'Фитнес - Понедельник, 18:00',
    createdAt: new Date('2024-12-20T18:00:00'),
    author: 'Тренер А',
    photoLink: 'https://example.com/fitness.jpg',
  },
  {
    id: '2',
    description: 'Йога - Вторник, 19:00',
    createdAt: new Date('2024-12-21T19:00:00'),
    author: 'Тренер Б',
    photoLink: 'https://example.com/yoga.jpg',
  },
  {
    id: '3',
    description: 'Бассейн - Среда, 20:00',
    createdAt: new Date('2024-12-22T20:00:00'),
    author: 'Тренер В',
    photoLink: '',
  },
  // Добавьте ещё 17 объектов для выполнения условия
];

class ScheduleManager {
  #ObjInf; // Приватное поле для хранения объектов

  constructor(Objs = []) {
    this.#ObjInf = [...Objs]; // Инициализация массива объектов
  }

  // Получить объекты с фильтрацией, сортировкой и пагинацией
  getObjs(skip = 0, top = 10, filterConfig = {}) {
    let filteredObjs = [...this.#ObjInf];

    // Применение фильтров
    if (filterConfig.author) {
      filteredObjs = filteredObjs.filter((obj) =>
        obj.author.toLowerCase().includes(filterConfig.author.toLowerCase())
      );
    }

    if (filterConfig.description) {
      filteredObjs = filteredObjs.filter((obj) =>
        obj.description.toLowerCase().includes(filterConfig.description.toLowerCase())
      );
    }

    // Сортировка по дате создания (по убыванию)
    filteredObjs.sort((a, b) => b.createdAt - a.createdAt);

    // Пагинация
    return filteredObjs.slice(skip, skip + top);
  }

  // Получить объект по ID
  getObj(id) {
    return this.#ObjInf.find((obj) => obj.id === id) || null;
  }

  // Проверка объекта на валидность
  validateObj(Obj) {
    if (
      !Obj.id ||
      typeof Obj.id !== 'string' ||
      !Obj.description ||
      typeof Obj.description !== 'string' ||
      Obj.description.length >= 200 ||
      !Obj.createdAt ||
      !(Obj.createdAt instanceof Date) ||
      !Obj.author ||
      typeof Obj.author !== 'string' ||
      Obj.author.trim() === ''
    ) {
      return false;
    }
    return true;
  }

  // Добавить объект
  addObj(Obj) {
    if (this.validateObj(Obj)) {
      this.#ObjInf.push(Obj);
      return true;
    }
    return false;
  }

  // Изменить объект по ID
  editObj(id, Obj) {
    const index = this.#ObjInf.findIndex((obj) => obj.id === id);
    if (index === -1) return false;

    const existingObj = this.#ObjInf[index];
    const updatedObj = {
      ...existingObj,
      description: Obj.description || existingObj.description,
      photoLink: Obj.photoLink || existingObj.photoLink,
    };

    if (this.validateObj(updatedObj)) {
      this.#ObjInf[index] = updatedObj;
      return true;
    }
    return false;
  }

  // Удалить объект по ID
  removeObj(id) {
    const index = this.#ObjInf.findIndex((obj) => obj.id === id);
    if (index === -1) return false;
    this.#ObjInf.splice(index, 1);
    return true;
  }

  // Добавить массив объектов
  addAll(Objs) {
    const invalidObjs = [];
    Objs.forEach((obj) => {
      if (!this.addObj(obj)) {
        invalidObjs.push(obj);
      }
    });
    return invalidObjs; // Возвращает объекты, которые не удалось добавить
  }

  save() {
    localStorage.setItem('ObjInf', JSON.stringify(this.#ObjInf));
  }

  restore() {
    const storedObjs = localStorage.getItem('ObjInf');
    if (storedObjs) {
      this.#ObjInf = JSON.parse(storedObjs);

      // Преобразуем строковые даты обратно в объекты Date
      this.#ObjInf.forEach((obj) => {
        obj.createdAt = new Date(obj.createdAt); // Преобразуем строку в объект Date
      });
    }
  }

  // Очистить коллекцию
  clear() {
    this.#ObjInf = [];
  }
}

// Получаем секцию для расписания
const scheduleSection = document.getElementById('schedule-table');

// Создаем экземпляр класса
const scheduleManager = new ScheduleManager(ObjInf);

// Функция для отображения расписания
function renderSchedule() {
  scheduleSection.innerHTML = ''; // Очищаем текущий контент
  const schedules = scheduleManager.getObjs(0, 20); // Получаем 20 занятий

  schedules.forEach((schedule) => {
    const row = document.createElement('div');
    row.classList.add('schedule-row');
    row.innerHTML = `
      <span>${schedule.description}</span>
      <span>${schedule.createdAt.toLocaleDateString()}</span>
      <span>${schedule.author}</span>
    `;
    scheduleSection.appendChild(row);
  });
}

// Инициализация расписания
document.addEventListener('DOMContentLoaded', renderSchedule);

const addScheduleForm = document.getElementById('add-schedule-form');

addScheduleForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const activity = document.getElementById('activity').value;
  const day = document.getElementById('day').value;
  const time = document.getElementById('time').value;

  const newSchedule = {
    id: String(Date.now()), // Генерируем уникальный ID
    description: `${activity} - ${day}, ${time}`,
    createdAt: new Date(),
    author: 'Тренер А', // Можно заменить на авторизованного тренера
    photoLink: '',
  };

  if (scheduleManager.addObj(newSchedule)) {
    renderSchedule(); // Обновляем расписание
    addScheduleForm.reset(); // Сбрасываем форму
  } else {
    alert('Ошибка: не удалось добавить занятие!');
  }
});

const trainerScheduleSection = document.getElementById('current-schedule');

// Функция для отображения текущих занятий тренера
function renderTrainerSchedule(author) {
  trainerScheduleSection.innerHTML = ''; // Очищаем текущее содержимое
  const trainerSchedules = scheduleManager.getObjs(0, 20, { author });

  if (trainerSchedules.length === 0) {
    trainerScheduleSection.innerHTML = '<p>Нет занятий для отображения.</p>';
    return;
  }

  trainerSchedules.forEach((schedule) => {
    const row = document.createElement('div');
    row.classList.add('schedule-row');
    row.innerHTML = `
      <span>ID: ${schedule.id}</span>
      <span>${schedule.description}</span>
      <span>${schedule.createdAt.toLocaleDateString()}</span>
      <button class="edit-button" data-id="${schedule.id}">Изменить</button>
      <button class="delete-button" data-id="${schedule.id}">Удалить</button>
    `;
    trainerScheduleSection.appendChild(row);
  });

  // Привязываем обработчики к кнопкам "Изменить" и "Удалить"
  document.querySelectorAll('.edit-button').forEach((button) =>
    button.addEventListener('click', (event) => openEditForm(event.target.dataset.id))
  );

  document.querySelectorAll('.delete-button').forEach((button) =>
    button.addEventListener('click', (event) => deleteSchedule(event.target.dataset.id))
  );
}

const editScheduleForm = document.getElementById('edit-schedule-form');

// Открыть форму редактирования с заполнением текущих данных
function openEditForm(id) {
  const schedule = scheduleManager.getObj(id);
  if (!schedule) {
    alert('Занятие не найдено');
    return;
  }

  // Заполняем форму данными
  document.getElementById('edit-id').value = schedule.id;
  document.getElementById('edit-description').value = schedule.description;
  document.getElementById('edit-photoLink').value = schedule.photoLink;

  // Показываем форму редактирования
  document.getElementById('edit-schedule').classList.remove('hidden');
}

editScheduleForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const id = document.getElementById('edit-id').value;
  const description = document.getElementById('edit-description').value;
  const photoLink = document.getElementById('edit-photoLink').value;

  const updatedSchedule = { description, photoLink };

  if (scheduleManager.editObj(id, updatedSchedule)) {
    alert('Занятие успешно обновлено');
    document.getElementById('edit-schedule').classList.add('hidden');
    renderTrainerSchedule('Тренер А'); // Обновляем список занятий
  } else {
    alert('Ошибка при обновлении занятия');
  }
});

function deleteSchedule(id) {
  if (confirm('Вы уверены, что хотите удалить это занятие?')) {
    if (scheduleManager.removeObj(id)) {
      alert('Занятие успешно удалено');
      renderTrainerSchedule('Тренер А'); // Обновляем список занятий
    } else {
      alert('Ошибка при удалении занятия');
    }
  }
}

const loginForm = document.getElementById('login-form');
const trainerPanel = document.getElementById('trainer-panel');
const trainerSchedule = document.getElementById('trainer-schedule');

// Обработка входа тренера
loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // Проверка логина и пароля (захардкоженные значения для примера)
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username === 'trainer' && password === '1234') {
    alert('Вы успешно вошли как тренер');
    trainerPanel.classList.remove('hidden');
    trainerSchedule.classList.remove('hidden');
    renderTrainerSchedule('Тренер А'); // Отображаем занятия тренера
  } else {
    alert('Неверный логин или пароль');
  }
});

document.addEventListener('DOMContentLoaded', function () {
  // Загрузка расписания из localStoragescheduleManager
  const scheduleFromStorage = JSON.parse(localStorage.getItem('schedule')) || [];
  scheduleManager.restore(); // Восстанавливаем данные из localStorage

  // Если localStorage пуст, заполняем данными из ObjInf
  if (scheduleManager.getObjs().length === 0) {
    scheduleManager.addAll(ObjInf);
    scheduleManager.save(); }// Сохраняем в localStorage

  // Инициализация расписания для пользователей
  renderSchedule('schedule-table');

  // Инициализация расписания для тренеров
  renderSchedule('trainer-schedule-table');

  // Обработчик для добавления нового занятия
  const addScheduleForm = document.getElementById('add-schedule-form');
  addScheduleForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const activity = document.getElementById('activity').value;
    const day = document.getElementById('day').value;
    const time = document.getElementById('time').value;

    const newSchedule = { activity, day, time };
    scheduleFromStorage.push(newSchedule);

    // Сохраняем расписание в localStorage
    localStorage.setItem('schedule', JSON.stringify(scheduleFromStorage));

    renderSchedule('schedule-table');
    renderSchedule('trainer-schedule-table');
    addScheduleForm.reset();
  });
});
