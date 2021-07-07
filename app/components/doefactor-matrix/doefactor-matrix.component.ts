import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms'
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { doeInputFactor } from '../../interfaces/interfaces'
import {inputDisplayNames} from '../../external-data/display-channel-list'

@Component({
  selector: 'app-doefactor-matrix',
  templateUrl: './doefactor-matrix.component.html',
  styleUrls: ['./doefactor-matrix.component.css']
})
export class DOEFactorMatrixComponent implements OnInit {

  inputFactorMatrix: doeInputFactor[] = [];
  lowValue = '';
  highValue = '';
  options = inputDisplayNames;
  myControl = new FormControl();
  filteredOptions: Observable<string[]> | undefined;

  constructor() { }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filter(value))
    );
  }
  
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  addFactor(){
    let factorObj: doeInputFactor = {index: null, channel:'', unit:'', low: null, high: null};
    this.inputFactorMatrix.push(factorObj);
    console.log(this.inputFactorMatrix)
  }

  deleteFactor(i:number){
    this.inputFactorMatrix.splice(i, 1);
  }

  addChannel(channel:string, i:number) {
    this.inputFactorMatrix[i].channel = channel;
    console.log(this.inputFactorMatrix)
  }

  addLowValue(lowValue:string, i: number) {
    this.inputFactorMatrix[i].low = +lowValue;
    console.log(this.inputFactorMatrix)
  }

  addHighValue(highValue:string, i: number) {
    this.inputFactorMatrix[i].high = +highValue;
    console.log(this.inputFactorMatrix)
  }

  
}
