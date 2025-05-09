import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  imports: [CommonModule],
  selector: 'app-prod-faq',
  templateUrl: './prod-faq.component.html',
  styles: '',
})
export class ProdFaqComponent {
  faqs = [
    {
      question: 'Can you use the USB connection to get 7.1 surround sound from a PS4?',
      answer:
        'Hi, Let me clear this up for you. The virtual 7.1 surround sound is supported through the USB sound card only when used on a computer. The Cloud II is officially supported with the PS4 using the 3.5mm audio jack plugged into the controller. It can be used with the USB sound card but as the PS4 does not have the drivers to run the sound card it will only support pass-through sound. When used that way the 7.1, volume, and mic control buttons are disabled; only the mic mute switch on the side will work.',
      date: '13 Jan, 2023',
    },
    {
      question: 'Is this product compatible with Mac?',
      answer:
        'Yes, this product is compatible with Mac. However, some features may require additional drivers or software.',
      date: '20 Feb, 2023',
    },
    {
      question: 'Does it come with a warranty?',
      answer: 'Yes, it comes with a 1-year manufacturer warranty.',
      date: '5 Mar, 2023',
    },
  ];

  activeIndex: number | null = null;

  toggleAnswer(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index;
  }
}
