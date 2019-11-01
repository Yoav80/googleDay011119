import { Component, OnInit } from '@angular/core';
export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}

export interface Language {
  value: string;
  viewValue: string;
}

const {webkitSpeechRecognition} : IWindow = <IWindow>window;

@Component({
  selector: 'app-prod-list',
  templateUrl: './prod-list.component.html',
  styleUrls: ['./prod-list.component.css']
})
export class ProdListComponent implements OnInit {

  public selectedLang: any;
  private recognition: any;
  private final_transcript: string;
  private languages: Language[] = [
    {value: 'en-US', viewValue: 'English'},
    {value: 'NL', viewValue: 'Dutch'},
  ];

  constructor() { }

  ngOnInit() {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('no speech recognition');
    } else {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
    
      this.recognition.onstart = (e) => {
        console.log('on start', e);
      }
      this.recognition.onresult = (e) => {
        console.log('onresult', e.results);
        const results: SpeechRecognitionResultList = e.results;
        this.final_transcript = results[0][0].transcript;

      }
      this.recognition.onerror = (e) => {
        console.log('onerror', e);
      }
      this.recognition.onend = (e) => {
        console.log('onend', e);
      }
    }
  }

  startButton(event) {
    this.final_transcript = '';
    this.recognition.lang = this.selectedLang;
    this.recognition.start();
  }
}
