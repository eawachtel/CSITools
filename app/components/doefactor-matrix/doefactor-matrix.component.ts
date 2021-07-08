import { Component, OnInit } from '@angular/core';

import * as Papa from 'papaparse';
import { ExportToCsv } from 'export-to-csv';

import { doeInputFactor } from '../../interfaces/interfaces'
import {inputDisplayNames} from '../../external-data/display-channel-list'

interface papaParseInterface {
  data: doeInputFactor[];
  errors: any[];
  meta: {}
}

@Component({
  selector: 'app-doefactor-matrix',
  templateUrl: './doefactor-matrix.component.html',
  styleUrls: ['./doefactor-matrix.component.css']
})
export class DOEFactorMatrixComponent implements OnInit {

  inputFactorMatrix: any[] = [];
  lowValue = '';
  highValue = '';
  channelOptions = inputDisplayNames;
  channelOptionsAll = this.channelOptions;
  
  constructor() { 
    
  }
  
  
  onKey(value: any) { 
    this.channelOptionsAll = this.search(value);
    }

  search(value: string) { 
    let filter = value.toLowerCase();
    return this.channelOptions.filter(option => option.toLowerCase().startsWith(filter));
  }

  ngOnInit(): void {
  }

  addFactor(){
    let factorObj: any = {channel:'', unit:'', low: null, high: null};
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

  public  fileChangeListener(files: any) {
    let file = files.target.files[0]
    this.inputFactorMatrix = []
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          console.log(result.data)
          this.inputFactorMatrix = result.data;
        }});
    } else {
      alert('Problem loading CSV file');
    }
  }
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
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };
   
  const csvExporter = new ExportToCsv(options);
   
  csvExporter.generateCsv(this.inputFactorMatrix);
  }

}
