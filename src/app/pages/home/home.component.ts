import { NgStyle } from '@angular/common';
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';

@Component({
  standalone: true,
  selector: 'ng-blog-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [RouterModule, FooterComponent, NgStyle],
})
export class HomeComponent {
  private numberOfImages = 15;

  protected currentImagePath = `url('/assets/background/background (${Math.floor(
    Math.random() * this.numberOfImages
  )}).jpg')`;
}
