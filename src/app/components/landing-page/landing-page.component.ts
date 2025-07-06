import {
  Component,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
  OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('500ms ease-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class LandingPageComponent implements OnInit, OnDestroy {
  showCircle = true;
  menuOpen = false;
  isBrowser: boolean;
  images: string[] = [
    'assets/about/c1.png',
    'assets/about/c2.png'
  ];
  currentImageIndex = 0;
  currentImage: string = '';
  carouselInterval: any;
  typedText = '';
  texts = ['CREATING THE FUTURE OF SKIN CARE', 'LET\'S FORMULATE YOUR BRAND TODAY!'];
  currentTextIndex = 0;
  charIndex = 0;
  isDeleting = false;
  typingSpeed = 100;
  pauseBetweenWords = 1000;
  productImage = 'assets/services/products.png';
  brandImage = 'assets/services/brands.png';
  serviceImage = 'assets/services/others.png';
  routerEventsSub!: Subscription; // 🆕

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

ngOnInit(): void {
  if (this.isBrowser) {
    this.checkScreenSize();
    this.startCarousel();
    this.typeLoop()
  }
}



  ngOnDestroy(): void {
    clearInterval(this.carouselInterval);
    if (this.routerEventsSub) this.routerEventsSub.unsubscribe(); // 🆕
  }

  @HostListener('window:resize')
  onResize() {
    if (this.isBrowser) {
      this.checkScreenSize();
    }
  }

  checkScreenSize(): void {
    this.showCircle = window.innerWidth >= 1500;
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  navigateToTransactions(): void {
    this.router.navigateByUrl('/transactions');
  }

  startCarousel(): void {
    this.setCurrentImage();

    this.carouselInterval = setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
      this.setCurrentImage();
    }, 10000);
  }

  setCurrentImage(): void {
    this.currentImage = this.images[this.currentImageIndex];
  }

  goToImage(index: number): void {
    clearInterval(this.carouselInterval);
    this.currentImageIndex = index;
    this.setCurrentImage();
    this.startCarousel();
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    const header = document.querySelector('header');
    const yOffset = header ? -header.clientHeight : -80;

    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  typeLoop() {
    const currentText = this.texts[this.currentTextIndex];

    if (this.isDeleting) {
      this.typedText = currentText.substring(0, this.charIndex--);
    } else {
      this.typedText = currentText.substring(0, this.charIndex++);
    }

    if (!this.isDeleting && this.charIndex === currentText.length + 1) {
      this.isDeleting = true;
      setTimeout(() => this.typeLoop(), this.pauseBetweenWords);
      return;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
    }

    setTimeout(() => this.typeLoop(), this.isDeleting ? 60 : this.typingSpeed);
  }
}
