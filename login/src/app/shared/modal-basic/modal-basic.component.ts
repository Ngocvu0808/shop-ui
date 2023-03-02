import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';

@Component({
	selector: 'app-modal-basic',
	templateUrl: './modal-basic.component.html',
	styleUrls: ['./modal-basic.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ModalBasicComponent implements OnInit {
	@Input() dialogClass: string;
	@Input() hideHeader = false;
	@Input() hideFooter = false;
	@Input() enableClickOutSite = true;
	public visible = false;
	public visibleAnimate = false;

	constructor() {
	}

	ngOnInit() {

	}

	public show(): void {
		this.visible = true;
		this.visibleAnimate = true;
		console.log('show');
		// setTimeout(() => this.visibleAnimate = true, 100);
	}

	public hide(): void {
		this.visibleAnimate = false;
		this.visible = false;
		console.log('hide');
		// setTimeout(() => this.visible = false, 100);
	}

	public onContainerClicked(event: MouseEvent): void {
		if ((<HTMLElement>event.target).classList.contains('modal')) {
			if (this.enableClickOutSite) {
				this.hide();
			}
		}
	}

}
