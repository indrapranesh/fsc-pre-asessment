import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  requirements = [];
  selectedRequirement;

  uploadForm = this.formBuilder.group({
    requirement: ['', [Validators.required]],
    file: [null, [Validators.required]]
  });

  constructor(
    private formBuilder: FormBuilder
  ) { 
    this.requirements = JSON.parse(localStorage.getItem('requirements'));
    console.log(this.requirements);
  }

  onInput(event: Event): void {
    console.log(event);
    const value = (event.target as HTMLInputElement).value;
    this.requirements = value ? [value, value + value, value + value + value] : [];
  }

  fileChanged(event) {
    console.log(event)
  }

  upload() {
    console.log(this.uploadForm.value);
  }

  ngOnInit(): void {
  }

}
