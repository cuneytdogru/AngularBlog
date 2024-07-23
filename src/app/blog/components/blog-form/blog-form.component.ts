import { AsyncPipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SpinnerService } from 'src/app/core/spinner.service';
import { CreatePostRequestDto } from 'src/app/shared/models/blog/post/createPostDto';

@Component({
  standalone: true,
  imports: [
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    AsyncPipe,
    MatProgressBarModule,
  ],
  selector: 'ng-blog-blog-form',
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.scss'],
})
export class BlogFormComponent {
  @Output() submit = new EventEmitter<CreatePostRequestDto>();

  constructor(
    private fb: FormBuilder,
    private spinnerService: SpinnerService
  ) {}

  isLoading$ = this.spinnerService.visibility$;

  blogForm = this.fb.nonNullable.group({
    text: [
      '',
      {
        nonNullable: true,
        validators: [Validators.required],
      },
    ],
    imageURL: '',
  });

  onSubmit() {
    this.submit.emit(this.blogForm.getRawValue());
  }
}
