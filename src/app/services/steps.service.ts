import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StepsService {

  public currentStep: BehaviorSubject<number>;

  getCurrentStep() {
    return this.currentStep.asObservable();
  }

  constructor() {
    this.currentStep = new BehaviorSubject<number>(0);
  }
}
