import { AsyncPipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SpinnerService } from 'src/app/core/spinner.service';

@Component({
  selector: 'ng-blog-blog-comment-form',
  templateUrl: './blog-comment-form.component.html',
  styleUrls: ['./blog-comment-form.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgIf,
    AsyncPipe,
  ],
})
export class BlogCommentFormComponent {
  @Output() submit = new EventEmitter<string>();

  constructor(
    private fb: FormBuilder,
    private spinnerService: SpinnerService
  ) {}

  protected isLoading$ = this.spinnerService.visibility$;

  protected commentForm = this.fb.group({
    text: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(50),
    ]),
  });

  onSubmit() {
    this.submit.emit(this.commentForm.value.text);
  }

  reset() {
    this.commentForm.reset();
  }
}
