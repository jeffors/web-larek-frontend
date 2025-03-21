import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { WebLarekAPI } from './components/WebLarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import {
	CatalogChangeEvent,
	Product,
	WebLarekState,
} from './components/WebLarekData';
import { Card, CardBasket, CardPreview } from './components/Card';
import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { ContactsForm, FormOrder } from './components/Order';
import { IContactForm, IOrderForm } from './types';
import { Success } from './components/common/Success';

const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const appData = new WebLarekState({}, events);

const page = new Page(document.body, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new FormOrder(cloneTemplate(orderTemplate), events);
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);

events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((product) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', product),
		});
		return card.render(product);
	});

	page.counter = appData.basket.length;
});

events.on('card:select', (product: Product) => {
	const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			if (!appData.inBasket(product.id)) {
				appData.addProduct(product.id);
			} else {
				appData.removeProduct(product.id);
			}

			modal.close();
		},
	});

	cardPreview.selected = appData.inBasket(product.id);

	modal.render({ content: cardPreview.render(product) });
});

events.on('basket:open', () => {
	modal.render({ content: basket.render() });
});

events.on('basket:changed', () => {
	basket.items = appData.basket.map((id, index) => {
		const item = appData.catalog.find((item) => id === item.id);
		const basketItem = new CardBasket(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				appData.removeProduct(id);
			},
		});
		return basketItem.render({
			index: index + 1,
			price: item.price,
			title: item.title,
		});
	});
	basket.total = appData.getTotalPrice();
	page.counter = appData.basket.length;
});

events.on('order:open', () => {
	modal.render({
		content: order.render({
			errors: [],
			valid: false,
			address: '',
			payment: '',
		}),
	});
});

events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			errors: [],
			valid: false,
			email: '',
			phone: '',
		}),
	});
});

events.on('orderFormErrors:change', (errors: Partial<IOrderForm>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on(
	'order.payment:change',
	(data: { field: keyof IOrderForm; value: string }) => {
		order.payment = data.value;
	}
);

events.on('contactsFormErrors:change', (errors: Partial<IContactForm>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContactForm; value: string }) => {
		appData.setContactField(data.field, data.value);
	}
);

events.on('contacts:submit', () => {
	appData.order.items = appData.basket;
	appData.order.total = appData.getTotalPrice();
	api
		.orderProducts(appData.order)
		.then((result) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});

			modal.render({
				content: success.render({ total: appData.getTotalPrice() }),
			});
			appData.clearBasket();
		})
		.catch((err) => {
			console.error(err);
		});
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

api
	.getProducts()
	.then((products) => {
		appData.catalog = products; 
})
	.catch((err) => console.error(err));
