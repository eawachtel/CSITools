import { Component, OnInit } from '@angular/core';

import * as Papa from 'papaparse';

@Component({
  selector: 'batch-creation',
  templateUrl: './batch-creation.component.html',
  styleUrls: ['./batch-creation.component.css']
})
export class BatchCreationComponent implements OnInit {

  batchMatrix: any[] = [];
  batchDict: any = {};
  designMatrix: any[] = [];
  excludedKeyStrings: string[] = ['', 'Response 1']
  excludedValueStrings: string[] = ['Run', 'R1']
  inputs: string[] = [];
  inputDict: any = {};

  constructor() { }

  ngOnInit(): void {
  }

  public async processInputs(data:any[]) {
    let factorObj = data[0];
    //make dictionar of Factor Labels ie {Factor1:'LRSpring'}
    Object.keys(factorObj).forEach((val:any) => {
      if (!this.excludedKeyStrings.includes(val)) {
        this.inputDict[val] = factorObj[val].substring(2);
      }
    });
    // add attributes to the batch matrix
    Object.values(factorObj).forEach((val:any) => {
      if (!this.excludedValueStrings.includes(val)) {
        this.inputs.push(val.substring(2));
      };
    });
    this.inputs.forEach((item) => {
      let batchMatrixObj = {
        attribute: item,
        baselineValue: null,
        values: [],
        unit: null
      }
      this.batchDict[item] = (batchMatrixObj);
    });
  }
    
  public async processValues(data:any[]) {
    let designMatrix = data.slice(2)
    // delete Run and Response column from design matrix
    designMatrix.forEach((element) => {
      delete element[''];
      delete element['Response 1']
    });
    
    //loop through design matrix and assign values to the batchDict
    designMatrix.forEach((element) => {
      Object.keys(element).forEach((designKey:any) => {
        let value = element[designKey];
        let inputKey = this.inputDict[designKey];
        this.batchDict[inputKey]['values'].push(value)
    });
  });
}

  public  fileChangeListener(files: any) {
    let file = files.target.files[0];
    if (file) {
        this.batchMatrix = [];
        this.inputs = [];
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (result) => {
          await this.processInputs(result.data); // get input factors in a list and add to batchmatrix as row
          await this.processValues(result.data); // get values and enter into array in batchmatrix
        }});
    } else {
      alert('Problem loading CSV file');
    }
  }

}


