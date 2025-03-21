import { IContactForm, IOrderForm } from '../types';
import { IEvents } from './base/events';
import { Form } from './common/Form';

export class FormOrder extends Form<IOrderForm> {
	protected _cardButton: HTMLButtonElement;
	protected _cashButton: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._cardButton = this.container.elements.namedItem(
			'card'
		) as HTMLButtonElement;
		this._cashButton = this.container.elements.namedItem(
			'cash'
		) as HTMLButtonElement;

		if (this._cardButton) {
			this._cardButton.addEventListener('click', () => {
				// this.toggleClass(this._cardButton, 'button_alt-active');
				// this.toggleClass(this._cashButton, 'button_alt');
				this.onInputChange('payment', 'card');
			});
		}

		if (this._cashButton) {
			this._cashButton.addEventListener('click', () => {
				// this.toggleClass(this._cardButton, 'button_alt');
				// this.toggleClass(this._cashButton, 'button_alt-active');
				this.onInputChange('payment', 'cash');
			});
		}
	}

	set payment(value: string) {
		if (value === 'card') {
			this.toggleClass(this._cardButton, 'button_alt-active', true);
			this.toggleClass(this._cashButton, 'button_alt-active', false);
		} else {
			this.toggleClass(this._cardButton, 'button_alt-active', false);
			this.toggleClass(this._cashButton, 'button_alt-active', true);
		}
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}

export class ContactsForm extends Form<IContactForm> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}
