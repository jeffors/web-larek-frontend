import {
	FormErrors,
	IAppState,
	IContactForm,
	IOrder,
	IOrderForm,
	IProduct,
} from '../types';
import { Model } from './base/Model';

export type CatalogChangeEvent = {};

export class Product extends Model<IProduct> {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export class WebLarekState extends Model<IAppState> {
	protected _basket: string[] = [];
	protected _catalog: Product[];
	protected _order: Omit<IOrder, 'items'> = {
		payment: '',
		address: '',
		email: '',
		phone: '',
		total: 0,
	};
	formErrors: FormErrors = {};

	get catalog(): Product[] {
		return this._catalog;
	}

	set catalog(items: IProduct[]) {
		this._catalog = items.map((item) => new Product(item, this.events));
		this.emitChanges('items:changed', { catalog: this._catalog });
	}

	get basket(): string[] {
		return this._basket;
	}

	addProduct(id: string) {
		this._basket.push(id);
		this.emitChanges('basket:changed');
	}

	removeProduct(id: string) {
		this._basket = this._basket.filter((product) => product !== id);
		this.emitChanges('basket:changed');
	}

	clearBasket() {
		this._basket = [];
		this.emitChanges('basket:changed');
	}

	getTotalPrice() {
		return this._basket.reduce(
			(a, c) => a + this._catalog.find((it) => it.id === c).price,
			0
		);
	}

	inBasket(id: string) {
		return this._basket.includes(id);
	}

	clearOrder() {
		this._order = {
			payment: '',
			address: '',
			email: '',
			phone: '',
			total: 0,
		};
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		this._order[field] = value;

		if (this.validateOrder()) {
			this.events.emit('order:ready', this._order);
		}
	}

	setContactField(field: keyof IContactForm, value: string) {
		this._order[field] = value;

		if (this.validateContacts()) {
			this.events.emit('contacts:ready', this._order);
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this._order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		if (!this._order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.formErrors = errors;
		this.events.emit('orderFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContacts() {
		const errors: typeof this.formErrors = {};
		if (!this._order.email) {
			errors.email = 'Необходимо указать эл. почту';
		}
		if (!this._order.phone) {
			errors.phone = 'Необходимо указать номер телефона';
		}
		this.formErrors = errors;
		this.events.emit('contactsFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	createOrderToPost(): IOrder {
		const total = this.getTotalPrice();
		return {
			...this._order,
			items: [...this._basket],
			total,
		};
	}
}
