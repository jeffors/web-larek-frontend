import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface ISuccess {
  description: number;
}

interface ISuccessActions {
  onClick: () => void;
}

export class Success extends Component<ISuccess> {
  protected _closeButton: HTMLButtonElement;
  protected _description: HTMLElement;

  constructor(container: HTMLElement, actions: ISuccessActions) {
    super(container);

    this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
    this._description = ensureElement<HTMLButtonElement>('.order-success__description', this.container);

    if (actions?.onClick) {
      this._closeButton.addEventListener('click', actions.onClick)
    }
  }

  set description(value: number) {
    this.setText(this._description, `Списано ${value} синапсов`)
  }
}