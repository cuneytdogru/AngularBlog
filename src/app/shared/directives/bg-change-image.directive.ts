import { Directive, ElementRef, Input, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[ngBlogBgChangeImage]',
})
export class BgChangeImageDirective implements OnInit {
  @Input() numberOfImages = 1;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    const currentImagePath = `assets/background/background (${Math.floor(
      Math.random() * this.numberOfImages
    )}).jpg`;

    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'background-image',
      `url(${currentImagePath})`
    );

    currentImage =
      this.imagesList[this.imagesList.indexOf(currentImage) + 1] ||
      this.imagesList[0];
  }
}
