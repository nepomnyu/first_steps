import { test, expect } from '@playwright/test';
import { AuthClient } from '../../models/api/authClient';
import { DateHelper } from '../../models/api/dateHelper';

test.describe('Создание пользователя', () => {
  let auth: AuthClient;

  test.beforeEach(async ({ request }) => {
    auth = new AuthClient(request);
  });

  test('Case1. Успешное создание одного пользователя', async () => {
    await test.step('Отправка POST-запроса на создание одного пользователя', async () => {
      const payload = {
        name: 'morpheus',
        job: 'leader',
      };

      const response = await auth.post('users', payload);

      expect(response.status()).toBe(201);

      const body = await response.json();

      // Проверяем, что тело ответа содержит переданные поля и id/createdAt
      expect(body).toMatchObject({
        name: 'morpheus',
        job: 'leader',
        // id: 207, В реальном проекте, тест будет проходить на подготовленном чистом окружении, будем проверять id:1
        // createdAt: DateHelper.getFormattedDateTime(), //в реальном кейсе используем текущее время, корректного формата, без милисекунд
      });
      //Тк мы не можем проверить ид и дату точно, оставлю проверкю на то, что они вообще есть
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('createdAt');
    });
  });

  //Оставлю этот кейс, что б показать, что покрывал бы наличие обязательных полей и их валидацию
  test('Case2. Проверка обязательных полей', async () => {
    await test.step('Проверка заполнения обязательного поля name', async () => {
      test.fail(true, 'В методе нет валидации и обязательных полей, отдает 200');

      const payload = {
        name: '',
        job: 'leader',
      };

      const response = await auth.post('users', payload);

      expect(response.status()).toBe(400);

      // Должно быть тело ошибки, например: "Поле name должно быть строкой"
      const body = await response.json();
      expect(body.data).toMatchObject({
        error: 'Поле name должно быть строкой',
      });
      /* Проверка, что запись не создалась:
      Есть несколько способов:
      1. Допустим у нас есть подключение и доступы к бд. Тогда просто проверяем что запись не создалась
        expect(result.rowCount).toBe(0);
      2. Дергаем гет метод по получению пользователей и в ответ получаем пустой массив, на практике такой метод не применяется.
      */
    });
  });

  test('Case3. Проверка создания нескольких пользователей сразу', async () => {
    await test.step('Отправка POST-запроса на создание двух пользователей', async () => {
      test.skip(true, 'Нет доступа к базе. Нет возможности проверить созданные данные');

      const payload = [
        {
          name: 'first',
          job: '1',
        },
        {
          name: 'second',
          job: '2',
        },
      ];

      const response = await auth.post('users', payload);
      expect(response.status()).toBe(201);

      const body = await response.json();

      // Проверяем, что тело ответа содержит переданные поля
      expect(body).toMatchObject({
        users: [
          {
            id: 1,
            name: 'first',
            job: '1',
            createdAt: DateHelper.getFormattedDateTime(),
          },
          {
            id: 2,
            name: 'second',
            job: '2',
            createdAt: DateHelper.getFormattedDateTime(),
          },
        ],
      });
    });
  });
});
