import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';

@Directive({
  selector: '[ifOwner]',
  standalone: true,
})
export class IfOwnerDirective implements OnInit {
  @Input() ifOwner?: string = '';

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    const currentUserId = await firstValueFrom(this.authService.userId$);

    if (currentUserId == this.ifOwner) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
