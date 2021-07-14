import { Component, OnInit } from '@angular/core';

import * as Papa from 'papaparse';
import { ExportToCsv } from 'export-to-csv';

import {inputDisplayNames} from '../../external-data/display-channel-list'


@Component({
  selector: 'doefactor-matrix',
  templateUrl: './doefactor-matrix.component.html',
  styleUrls: ['./doefactor-matrix.component.css']
})
export class DOEFactorMatrixComponent implements OnInit {

  inputFactorMatrix: any[] = [];
  lowValue = '';
  highValue = '';
  channelOptions:string[] = inputDisplayNames;
  channelOptionsFiltered: string[] | undefined = this.channelOptions; 
  

  constructor() { 
    
  }
  
  
  ngOnInit(): void {
    
  }

  onKey(event: any, i:number) { 
    let value2 = event.target.value;
    this.inputFactorMatrix[i].channelOptionsFiltered = this.search(value2);
  }

  search(value: string) { 
    let filter = value.toLowerCase();
    return this.channelOptions.filter(option => option.toLowerCase().includes(filter));
  }

  addFactor(){
    let factorObj: any = {channel:'', unit:'', low: null, high: null, channelOptionsFiltered: this.channelOptions};
    this.inputFactorMatrix.push(factorObj);
  }

  onChannelSelect(i:number) {
    this.inputFactorMatrix[i]['low'] = null
    this.inputFactorMatrix[i]['high'] = null
  }

  deleteFactor(i:number){
    this.inputFactorMatrix.splice(i, 1);
  }

  addChannel(channel:string, i:number) {
    this.inputFactorMatrix[i].channel = channel;
  }

  addLowValue(lowValue:string, i: number) {
    this.inputFactorMatrix[i].low = +lowValue;
  }

  addHighValue(highValue:string, i: number) {
    this.inputFactorMatrix[i].high = +highValue;
  }

  public fileChangeListener(files: any) {
    let file = files.target.files[0]
    if (file) {
        this.inputFactorMatrix = []
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          this.inputFactorMatrix = result.data;
          // Add filtered channel options so instance of object is full with all names avail
          this.inputFactorMatrix.forEach((element) => {
            element['channelOptionsFiltered'] = this.channelOptions; 
          })
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
