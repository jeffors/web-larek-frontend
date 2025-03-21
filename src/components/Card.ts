import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ICard {
	title: string;
	category: string;
	image: string;
	price: number | null;
}

export class Card extends Component<ICard> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._category = ensureElement<HTMLElement>('.card__category', container);
		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._button = container.querySelector('.card__button');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set category(value: string) {
		this.setText(this._category, value);
		switch (value) {
			case 'софт-скил':
				this.toggleClass(this._category, 'card__category_soft', true)
				break;
			case 'другое':
				this.toggleClass(this._category, 'card__category_other', true)
				break;
			case 'дополнительное':
				this.toggleClass(this._category, 'card__category_additional', true)
				break;
			case 'кнопка':
				this.toggleClass(this._category, 'card__category_button', true)
				break;
			case 'хард-скил':
				this.toggleClass(this._category, 'card__category_hard', true)
				break;
			default:
				break;
		}
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set price(value: number | null) {
		if (value) {
			this.setText(this._price, `${value} синапсов`);
		} else {
			if (this._button) {
				this.setDisabled(this._button, true)
				this.setText(this._button, 'Недоступно для покупки');
			}

			this.setText(this._price, 'Бесценно');
		}
	}
}

export class CardPreview extends Card {
	protected _description: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container, actions);
		this._description = ensureElement<HTMLElement>('.card__text', container);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set selected(value: boolean) {
		if (value) {
			this.setText(this._button, 'Убрать');
		} else {
			this.setText(this._button, 'В корзину');
		}
	}
}

export interface IBasketItem {
	index: number;
	title: string;
	price: number;
}

export class CardBasket extends Component<IBasketItem> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _delete: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);
		this._index = ensureElement<HTMLElement>('.basket__item-index', container);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._delete = ensureElement<HTMLButtonElement>('.card__button', container);

		this._delete.addEventListener('click', (event: MouseEvent) => {
			actions?.onClick?.(event);
		});
	}

	set index(value: number) {
		this.setText(this._index, value);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number) {
		this.setText(this._price, `${value} синапсов`);
	}
}
