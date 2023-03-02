import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ConfigService} from '../../../../../service/config.service';

@Component({
  selector: 'kt-config-edit',
  templateUrl: './config-detail.component.html',
  styleUrls: ['./config-detail.component.scss']
})
export class ConfigDetailComponent implements OnInit {
  configForm: FormGroup;
  data: any;

  constructor(private configService: ConfigService,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<ConfigDetailComponent>,
              @Inject(MAT_DIALOG_DATA) data
  ) {
    this.data = data;
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.configForm = this.fb.group({
      key: [this.data.element.key],
      value: [this.data.element.value],
      note: [this.data.element.note]
    });
  }

  close() {
    this.dialogRef.close();
  }

  /**
   * Checking control validation
   *
   * @param controlName: string => Equals to formControlName
   * @param validationType: string => Equals to valitors name
   */
  validateForm(controlName: string, validationType: string): boolean {
    const control = this.configForm.controls[controlName];
    if (!control) {
      return false;
    }

    return control.hasError(validationType) && (control.dirty || control.touched);
  }
}
