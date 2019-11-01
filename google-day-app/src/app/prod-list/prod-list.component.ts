import { Component, OnInit, HostListener, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}

export interface Language {
  value: string;
  viewValue: string;
  index: number;
}

const {webkitSpeechRecognition} : IWindow = <IWindow>window;

@Component({
  selector: 'app-prod-list',
  templateUrl: './prod-list.component.html',
  styleUrls: ['./prod-list.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ProdListComponent implements OnInit {

  selectedLang: any;
  recognition: any;
  final_transcript: Array<any>;
  last_result: string = '';
  languages: Language[];

  constructor(private ref: ChangeDetectorRef, private http: HttpClient) { 
    this.final_transcript = [];
    this.last_result = '';
    this.languages = [
      {value: 'en-US', viewValue: 'English', index: 1},
      {value: 'NL', viewValue: 'Dutch', index: 2},
    ];
  }

  ngOnInit() {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('no speech recognition');
    } else {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
    
      this.recognition.onstart = (e) => {
        console.log('on start', e);
      }
      this.recognition.onresult = (e) => {
        console.log('onresult', e.results);
        const results: SpeechRecognitionResultList = e.results;
        this.last_result = results[0][0].transcript;
      }
      this.recognition.onerror = (e) => {
        console.log('onerror', e);
      }
      this.recognition.onend = (e) => {
        console.log('onend', e);
        this.final_transcript.push(this.last_result);
        this.ref.detectChanges();
      }
    }
  }

  startButton(event) {
    this.recognition.lang = this.selectedLang;
    this.recognition.start();
  }

  removeListitem({item, index}) {
    console.log('removeListitem:', item);
    if (this.final_transcript[index]) {
      this.final_transcript.splice(index, 1);

      this.ref.detectChanges();
    }
  }

  editListitem({item, index}) {
    console.log('editListitem:', item);
  }

  sendListitem({item, index}) {
    debugger;
    this.http.get(`/task?text=${item}`)
      .subscribe((data: any) => {
        console.log("????? ", data);
      });
  }

  trackByFn(index, item) {
    return Math.random()*1000;
  }
}
