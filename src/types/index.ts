export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IAppState {
	catalog: IProduct[];
	basket: string[];
	order: IOrder | null;
}

export interface IOrderForm {
	payment: string;
	address: string;
}

export interface IContactForm {
	email: string;
	phone: string;
}

export interface IOrder extends IOrderForm, IContactForm {
	items: string[];
	total: number;
}

export interface IOrderResult {
	id: string;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;
