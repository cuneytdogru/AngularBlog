import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { UserService } from 'src/app/core/user.service';

@Directive({
  selector: '[ifOwner]',
  standalone: true,
})
export class IfOwnerDirective implements OnInit {
  @Input() ifOwner?: string = '';

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private userService: UserService
  ) {}

  async ngOnInit() {
    const user = await firstValueFrom(this.userService.user$);

    if (user.id == this.ifOwner) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
