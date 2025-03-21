# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура приложения
Код приложения использует MVP-архитектуру (Model-View-Presenter), где:
- **Model** (слой данных) - отвечает за хранение и изменение данных.
- **View** (слой отображения) - отвечает за отображение данных на странице.
- **Presenter** - отвечает за связь между слоем данных и слоем отображения.

### Базовый код
#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы: 
- `get` - выполняет GET запрос на переданный в параметрах эндпоинт и возвращает промис с объектом, которым ответил сервер/
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на эндпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие.
- `emit` - инициализация события.
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие.

#### Класс Model
Базовая модель, чтобы можно было отличить ее от простых объектов с данными.
Методы:
- `emit` - сообщает всем, что модель поменялась.

#### Класс Component
Необходим для создания компонентов слоя представления. Предоставляет базовые методы для работы с HTML-элементами.
- toggleClass(element: HTMLElement, className: string, force?: boolean) - переключает класс элемента.
- protected setText(element: HTMLElement, value: unknown) - устанавливает текстовое содержимое элемента.
- setDisabled(element: HTMLElement, state: boolean) - изменяет статус блокировки элемента.
- setHidden(element: HTMLElement) - скрывает элемент.
- setVisible(element: HTMLElement) - показывает элемент
- protected setImage(element: HTMLImageElement, src: string, alt?: string) - устанавливает изображение с альтернативным текстом
- render(data?: Partial<T>): HTMLElement - возвращает корневой DOM-элемент

#### Класс WebLarekAPI 
Класс для работы с бэкендом интернет-магазина.
- constructor(cdn: string, baseUrl: string, options?: RequestInit) - принимает CDN URL и API URL сервера, а также настройки.

Поля класса:
- cdn: string - хранит CDN URL

Методы класса:
- getProducts(): Promise<IProduct[]> -
получить список товаров с бэкенда
- orderProducts(order: IOrder): Promise<IOrderResult> - отправить сформированный заказ на бэкенд

### Слой данных (Model)
Все классы слоёв данных наследуют класс Model.

#### Класс Product
Класс отвечает за описание товара.
В полях класса хранятся следующие данные:
- id: string - уникальный идентификатор товара.
- description: string - описание товара.
- image: string - ссылка на фотографию товара.
- title: string - название товара.
- category: string - категория товара.
- price: number | null - цена товара.

#### Класс WebLarekState
Класс отвечает за хранение и логику работы с данными магазина.   
В полях класса хранятся следующие данные: 
- basket: string[] - массив ID товаров в корзине
- catalog: Product[] - массив всех товаров магазина
- order: IOrder - данные для оформления заказа
- formErrors: FormErrors = {} - хранит различные ошибки формы

Класс предоставляет слелующий набор методов:
- setCatalog(items: IProduct[]) - устанавливает каталог товаров интернет-магазина
- addProduct(id: string) - добавляет товар в корзину
- removeProduct(id: string) - удаляет товар из корзины
- clearBasket() - очищает корзину
- getTotalPrice() - возвращает сумму цен товаров в корзине
- inBasket(id: string) - проверяет, находится ли товар в корзине
- clearOrder() - очищает данные заказа
- setOrderField(field: keyof IOrderForm, value: string) - устанавливает поле заказа
- setContactField(field: keyof IContactForm, value: string) - устанавливает поле конактов
- validateOrder() - выполняет валидацию данных заказа
- validateContacts() - выполняет валидацию данных контактов

### Классы представления (View)

#### Класс Card 
Отвечает за отображение карточки на главной странице сайта.
- constructor(container: HTMLElement, actions?: ICardActions) - конструктор принимает DOM-элемент темплейта и действия с карточками, в соотвествии с интерфейсом ICardActions.

Поля класса:
- _title: HTMLElement - разметка заголовка карточки.
- _image: HTMLImageElement - разметка изображения карточки.
- _category: HTMLElement - разметка категории карточки.
- _price: HTMLElement - разметка цены карточки.
- _button - кнопка карточки

Методы:
- set title(value: string) - устанавливает заголовок карточки
- set category(value: string) - устанавливает категорию карточки
- set image(value: string) - устанавливает картинку товара в карточке
- set price(value: number | null) - устанавливает цену карточки

#### CardPreview
Отвечает за подробный обзор данных товара. Расширяет класс Card. Имеет те же аргументы в конструктуре, что и в классе Card.

Поля класса: 
- set description(value: string) - устанавливает подробное описание товара.
- set selected(value: boolean) - передаёт информацию, есть ли товар в корзине. В зависимости от значения меня кнопку добавления в корзину на удаление товара из неё.

#### Класс CardBasket
Отвечает за отображение товара в корзине. Имеет те же аргументы в конструктуре, что и в классе Card.

Поля класса:
- _index: HTMLElement - разметка номера товара в корзине.
- _title: HTMLElement - разметка заголовка товара.
- _price: HTMLElement - разметка цены товара.
- _delete: HTMLButtonElement - кнопка удаления товара из корзины.

Методы класса:
- set index(value: number) - устанавливает номер товара в корзине
- set title(value: string) - устанавливает название товара в корзине.
- set price(value: number) - устанавливает цену товара в корзине.

#### Класс Page
Отвечает за отображение всей страницы интернет-магазина. 

- constructor(container: HTMLElement, protected events: IEvents) - принимает элемент страницы и ивенты.

Поля класса: 
- _counter: HTMLElement - счётчик товаров в корзине
- _catalog: HTMLElement - каталог товаров в корзине
- _wrapper: HTMLElement - обёртка страницы
- _basket: HTMLElement - кнопка корзины на странице

Методы класса:
- set counter(value: number) - устанавливает количество товаров в счётчике корзины
- set catalog(items: HTMLElement[]) - устанавливает товары в каталоге
- set locked(value: boolean) - блокирует прокрутку страницы

#### Класс Basket
Отвечает за отображение корзины в интернет-магазине.

- constructor(container: HTMLElement, protected events: EventEmitter) - принимает элемент страницы и ивенты.

Поля класса:
- _list: HTMLElement - разметка списка товаров
- _total: HTMLElement - разметка суммы товаров
- _button: HTMLButtonElement - кнопка оформления заказа

Методы класса:
- set items(items: HTMLElement[]) - устанавливает товары в корзине
- set total(total: number) - устнавливает сумму товаров

#### Класс Form
Необходим для создания форм. 

constructor(protected container: HTMLFormElement, protected events: IEvents) - принимает элемент формы страницы и ивенты.

Поля класса:
- _submit: HTMLButtonElement - кнопка отправки формы
- _errors: HTMLElement - разметка ошибок валидации

Методы класса:
- protected onInputChange(field: keyof T, value: string) - создаёт событие изменения поля в форме
- set valid(value: boolean) - устанавливает валидность формы.
- set errors(value: string) - устанавливает ошибки валидации формы
- render(state: Partial<T> & IFormState) - отрисовка формы

#### Класс FormOrder 
Отвечает за отображение формы, связанной с заказом.

- constructor(container: HTMLFormElement, events: IEvents) - принимает элемент формы страницы и ивенты.

Поля класса:
- _cardButton: HTMLButtonElement - кнопка оплаты картой
- _cashButton: HTMLButtonElement - кнопка оплаты наличными (при получении)

Методы класса:
- set payment(value: string) - устанавливает метод оплаты
- set address(value: string) - устанавливает адресс заказа

#### Класс ContactsForm
Отвечает за отображение формы, связанной с контактами заказчика.

- constructor(container: HTMLFormElement, events: IEvents) - принимает элемент формы страницы и ивенты.

Методы класса:
- set phone(value: string) - устанавливает телефон заказчика
- set email(value: string) - устанавливает электронную почту заказчика

#### Класс Modal
Класс для создания модальных окон в приложении.
- constructor(container: HTMLElement, protected events: IEvents) - принимает элемент страницы и ивенты.

Поля класса:
- closeButton: HTMLButtonElement - кнопка для закрытия модального окна
- _content: HTMLElement - разметка контента модального окна

Методы:
- open() - открыть модальное окно
- close() - закрыть модальное окно
- render(data: IModalData): HTMLElement - отрисовка контента и открытие модального окна