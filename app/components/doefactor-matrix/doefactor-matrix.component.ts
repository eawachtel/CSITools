import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms'
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { ExportToCsv } from 'export-to-csv';

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
  channelOptions = inputDisplayNames;
  // myControl = new FormControl();
  // filteredOptions: Observable<string[]> | undefined;
  channelOptionsAll = this.channelOptions;
  constructor() { }

  onKey(value: any) { 
    this.channelOptionsAll = this.search(value);
    }

  search(value: string) { 
    let filter = value.toLowerCase();
    return this.channelOptions.filter(option => option.toLowerCase().startsWith(filter));
  }

  ngOnInit(): void {
    // this.filteredOptions = this.myControl.valueChanges.pipe(
    //   startWith(''),
    //   map((value: string) => this._filter(value))
    // );
  }
  
  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.options.filter(option => option.toLowerCase().includes(filterValue));
  // }

  addFactor(){
    let factorObj: doeInputFactor = {channel:'', unit:'', low: null, high: null};
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

  importFactorMatrix(){}

  exportFactorMatrix(){
    const options = { 
      fieldSeparator: ',',
      filename: 'DOEInputFactorTable',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: false, 
      showTitle: false,
      title: 'My Awesome CSV',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: false,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };
   
  const csvExporter = new ExportToCsv(options);
   
  csvExporter.generateCsv(this.inputFactorMatrix);
  }

}
