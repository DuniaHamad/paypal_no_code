import {Component, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CurrencyPipe, NgForOf, NgIf } from '@angular/common';

interface Kuchen {
  name: string;
  preis: number;
  bild?: string;
  details: string;
  paymentMethod: {
    type: 'button' | 'link' | 'qr';
    url?: string;
    qrCodeUrl?: string;
  };
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CurrencyPipe, NgForOf, NgIf],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('detailsSection') detailsSection!: ElementRef;

  kuchenListe: Kuchen[] = [
    {
      name: 'Käsekuchen',
      preis: 20,
      bild: 'assets/kuchen1.jpg',
      details: 'Dieser Kuchen ist ein klassischer Schokoladenkuchen, gefüllt mit einer leckeren Ganache und dekoriert mit frischen Beeren.',
      paymentMethod: {
        type: 'link',
        url: 'https://www.sandbox.paypal.com/ncp/payment/6Y2CYVVE2UBYE'
      }
    },
    {
      name: 'Hochzeitskuchen',
      preis: 50,
      bild: 'assets/kuchen2.jpg',
      details: 'Ein köstlicher Vanillekuchen mit einer zarten Erdbeerfüllung, perfekt für jeden Anlass. veruch versuch',
      paymentMethod: {
        type: 'button',
      }
    },
    {
      name: 'Geburtstagskuchen',
      preis: 30,
      bild: 'assets/kuchen3.jpg',
      details: 'Ein luxuriöser Käsekuchen mit Karamellsoße und einer knusprigen Keksbasis.',
      paymentMethod: {
        type: 'qr',
        qrCodeUrl: 'assets/qrcode.png'
      }
    }
  ];

  selectedKuchen: Kuchen | null = null;

  // Methode zum Auswählen eines Kuchens
  selectKuchen(kuchen: Kuchen): void {
    this.selectedKuchen = kuchen;
    setTimeout(() => {
      if (this.detailsSection) {
        this.detailsSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
    if (this.selectedKuchen.paymentMethod.type === 'button') {
      this.loadPayPalScript();
    }
  }

  //Lädt das PayPal SDK nur dann, wenn es noch nicht vorhanden ist,
  // und ruft nach erfolgreichem Laden
  // die Methode initializePayPalButton() auf.
  loadPayPalScript(): void {
    if (document.getElementById('paypal-sdk-script')) {
      this.initializePayPalButton();
      return;
    }

    const script = document.createElement('script');
    script.id = 'paypal-sdk-script';
    script.src = 'https://www.paypal.com/sdk/js?client-id=BAAYRG4PlLYjXDMJCOT6CUKe_x07YmmY5PQUoZ0w5eKmD-hLe9Fr34MnydW-S9PBibdGZvNaI6ACiw9I3c&components=hosted-buttons&disable-funding=venmo&currency=EUR';
    script.onload = () => this.initializePayPalButton();
    document.body.appendChild(script);
  }

  //Sorgt dafür, dass der PayPal-Zahlungsbutton im
  // entsprechenden Bereich der Seite gerendert wird
  initializePayPalButton(): void {
    const buttonContainer = document.getElementById('paypal-container-W2WS9JQPP2JRL');
    if (buttonContainer && buttonContainer.childNodes.length === 0) {
      if (typeof paypal !== 'undefined') {
        paypal.HostedButtons({
          hostedButtonId: 'W2WS9JQPP2JRL',
        }).render('#paypal-container-W2WS9JQPP2JRL');
      } else {
        console.error('PayPal SDK could not be loaded.');
      }
    }
  }

  ngAfterViewInit() {
  }
}
