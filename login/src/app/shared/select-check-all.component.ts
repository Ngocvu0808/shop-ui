import {Component, Input, OnInit} from '@angular/core';
import {NgModel} from '@angular/forms';
import {MatCheckboxChange} from '@angular/material';

@Component({
	selector: 'select-check-all',
	template: `
		<mat-checkbox class="mat-option"
					  [disableRipple]="true"
					  [indeterminate]="isIndeterminate()"
					  [checked]="isChecked()"
					  (click)="$event.stopPropagation()"
					  (change)="toggleSelection($event)">{{title}}
		</mat-checkbox>
	`,
	styles: ['']
})
export class SelectCheckAllComponent implements OnInit {
	@Input() model: NgModel;
	@Input() values = [];
	@Input() title = 'All';

	constructor() {
	}

	ngOnInit() {
	}

	isChecked(): boolean {
		return this.model.value && this.values.length
			&& this.model.value.length === this.values.length;
	}

	isIndeterminate(): boolean {
		return this.model.value && this.values.length && this.model.value.length
			&& this.model.value.length < this.values.length;
	}

	toggleSelection(change: MatCheckboxChange): void {
		if (change.checked) {
			this.model.update.emit(this.values);
		} else {
			this.model.update.emit([]);
		}
	}
}
