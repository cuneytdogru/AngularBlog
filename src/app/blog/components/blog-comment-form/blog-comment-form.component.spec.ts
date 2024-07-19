import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogCommentFormComponent } from './blog-comment-form.component';

describe('BlogCommentFormComponent', () => {
  let component: BlogCommentFormComponent;
  let fixture: ComponentFixture<BlogCommentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogCommentFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogCommentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
