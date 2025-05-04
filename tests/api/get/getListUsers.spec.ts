//Проверяем точку с вхождением нескольких параметров: id, email
import { test, expect } from '@playwright/test';
import { AuthClient } from '../../models/api/authClient';

test.describe('Проверка метода /users', () => {
  let auth: AuthClient;
  //Вынес бы авторизацию в общий beforeTest если нет необходимости проверять разные пермишены
  test.beforeEach(async ({ request }) => {
    auth = new AuthClient(request);
  });

  test('Проверка получения пользователя по ID', async () => {
    await test.step('Проверка запроса по ID', async () => {
      const response = await auth.get('users?id=1');
      //Оставил, что б показать работу с ответом
      console.log(await response.json());

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.data).toMatchObject({
        id: 1,
        email: 'george.bluth@reqres.in',
        first_name: 'George',
        last_name: 'Bluth',
        avatar: 'https://reqres.in/img/faces/1-image.jpg',
      });
    });
  });

  /*Оставляю, что б заюзать аннотацю test.fail + сознательно не покрываю валидацию email, тк ее нет.
   В реальном проекте я бы тестировал все сценарии, связанные с валидацией email-формы: пустое значение, 
   некорректный формат, граничные длины и тд  */
  test('Фильтрация по email', async () => {
    test.fail(true, 'В методе не работает фильтрация по email — ожидаем падение');
    await test.step('Позитивный кейс: Проверка запроса по существующему email', async () => {
      const email = 'janet.weaver@reqres.in';

      const response = await auth.get(`users?email=${email}`);
      expect(response.status()).toBe(200);
      const body = await response.json();

      // Проверяем, что в массиве ровно один элемент.
      expect(body.data.length).toBe(1);

      // Проверяем, что данные записи ожидаемого пользователя
      expect(body.data[0]).toMatchObject({
        id: 2,
        email: 'janet.weaver@reqres.in',
        first_name: 'Janet',
        last_name: 'Weaver',
        avatar: 'https://reqres.in/img/faces/2-image.jpg',
      });
    });
  });

  test('Негативный кейс: пользователь с несуществующим email не найден', async () => {
    const fakeEmail = 'user@reqres.in';

    await test.step(`Проверка запроса по НЕсуществующему email: ${fakeEmail}`, async () => {
      const response = await auth.get(`users?email=${fakeEmail}`);

      const body = await response.json();
      //Не нравится проверка, но лучше не нашел)
      expect(body.data.find((u: any) => u.email === fakeEmail)).toBeUndefined();
    });
  });

  /*Оставляю только один кейс по валидации, все остальные имеют такое же поведение(на работают).
  В реальном проекте покрывал бы валидацию в соответствии с типом инт:
  мин и макс инта, массив строк и чисел, строка, null, boolean в зависимости от требований дробное значение,
  */
  test('Проверка валидации поля ID (не число)', async () => {
    await test.step('Отправляем с не валидным значением для ID. id=asd', async () => {
      const response = await auth.get('users?id=asd');

      expect(response.status()).toBe(404); // тут проверяем на 404, в тестовой апи не настроена валидация, должны получать 400

      // Если есть тело с ошибкой — проверим его
      const body = await response.json();
      // expect(body).toHaveProperty('Поле ID должно быть целым числом'); // тут должно быть тело ошибки
      expect(body).toMatchObject({}); //Еще вариант, проверил бы, если б было тело ответа
    });
  });

  test('Проверка получения пользователя по ID и emeil', async () => {
    await test.step('Проверка запроса по ID=1 и emeil=george.bluth@reqres.in', async () => {
      const response = await auth.get('users?email=george.bluth@reqres.in&id=1');

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.data).toMatchObject({
        id: 1,
        email: 'george.bluth@reqres.in',
        first_name: 'George',
        last_name: 'Bluth',
        avatar: 'https://reqres.in/img/faces/1-image.jpg',
      });
    });
  });
});
