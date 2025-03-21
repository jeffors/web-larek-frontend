import { IOrder, IOrderResult, IProduct } from '../types';
import { Api, ApiListResponse } from './base/api';

export interface IWebLarekAPI {
	getProducts: () => Promise<IProduct[]>;
	orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

export class WebLarekAPI extends Api implements IWebLarekAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProducts(): Promise<IProduct[]> {
		return this.get(`/product`).then((data: ApiListResponse<IProduct>) =>
			data.items.map((product: IProduct) => ({
				...product,
				image: this.cdn + product.image,
			}))
		);
	}

	orderProducts(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
