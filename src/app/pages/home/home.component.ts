import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { CardComponent } from 'src/app/standaloneComp/card/card.component';
import { OrbitronComponent } from 'src/app/standaloneComp/orbitron/orbitron.component';
import { ParallaxComponent } from 'src/app/standaloneComp/parallax/parallax.component';
import { TextBlockComponent } from 'src/app/standaloneComp/text-block/text-block.component';
import { TitleComponent } from 'src/app/standaloneComp/title/title.component';
import { PhotoCaptionComponent } from 'src/app/standaloneComp/photo-caption/photo-caption.component';
import { ParagraphLinesComponent } from 'src/app/standaloneComp/paragraph-lines/paragraph-lines.component';
import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ImageHeroComponent, CommonModule, CardComponent, ParallaxComponent, TitleComponent, TextBlockComponent, OrbitronComponent, PhotoCaptionComponent, ParagraphLinesComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  paragraphText: string = `
  Noch nie von Elektrolyse gehört? Die Elektrolyse ist die einzige Methode zur Haarentfernung, die von medizinischen Fachstellen als wirklich permanent anerkannt ist.<br>
  Im Gegensatz zu Laser oder IPL, die nur eine dauerhafte Reduktion bewirken, zerstört die Elektrolyse jede einzelne Haarwurzel vollständig, unabhängig von Haarfarbe oder Hauttyp. <br>
  Bei FareWell bieten wir diese bewährte Technologie in einem modernen, stilvollen Ambiente an. Unsere Aufgabe ist es, Ihnen eine effektive, sichere und individuelle Lösung gegen unerwünschten Haarwuchs zu bieten. Sagen wir gemeinsam Farewell zum Rasieren, Wachsen und zur Unsicherheit.<br>
  Willkommen in einer neuen permanenten Freiheit.
  `;
  scrolled: boolean = false;
  activeTab: string = 'home';

  protected setActiveTab (tab: string) {
    this.activeTab = tab;
  }

    @HostListener("window:scroll", [])
    onWindowScroll() {
        this.scrolled = window.scrollY > 110;
    }

  constructor() { }

  ngOnInit(): void {
  }

  cards = [
    { 
      imageSrc: 'assets/images/people/t-square.jpeg', 
      buttonText: 'Text me',
      headerText: 'Thérèse Ringler, best of the best',
      dateText: 'Since the 1st of January 2000, she is pretty young',
      iconClass: 'venus mars',
      iconText: 'She IS the man eater',
      sectionLink: '#contactSection',
    },
    { 
      imageSrc: 'assets/images/people/q-square.jpeg', 
      buttonText: 'Squeeze me',
      headerText: 'Q Quiblier Alex Antoine. Buveur de Picon Chouf',
      dateText: 'Since Marseille existed, his soul was lighted on',
      iconClass: 'bolt',
      iconText: 'The Master of Apfel Apps',
      sectionLink: '#contactSection',
    },
    { 
      imageSrc: 'assets/images/people/j-square.jpeg', 
      buttonText: 'Call me baby',
      headerText: 'Mojo Chatelain, Aka Christ Juses',
      dateText: 'Since the day he opened he flambed a fart',
      iconClass: 'blind',
      iconText: 'The Challenger',
      sectionLink: '#contactSection',
    },
  ];
}
