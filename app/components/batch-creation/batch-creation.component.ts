import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

import * as Papa from 'papaparse';
import { ExportToCsv } from 'export-to-csv';
import { cloneDeep } from 'lodash';

const batchMatrix2 = [
  {attribute: 'test', baselineValue: null, values: '150, 200'}
]

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
  exportIsDisabled:boolean = true;
  inputs: string[] = [];
  inputDict: any = {};
  functionInputFactors: any[] = ['JackscrewAdjustLR', 'JackscrewAdjustRR'];
  displayedColumns: string[] = ['attribute', 'values'];
  dataSource = batchMatrix2

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

  public async processFunctions() {
      Object.keys(this.batchDict).forEach((batchKey:any) => {
        if (this.functionInputFactors.includes(batchKey)) {
          switch(batchKey) {
            case 'JackscrewAdjustLR':
              this.batchDict[batchKey]['values'] = this.jackscrewScale(this.batchDict[batchKey]['values']);
              break;
            case 'JackscrewAdjustRR':
              this.batchDict[batchKey]['values'] = this.jackscrewScale(this.batchDict[batchKey]['values']);
              break;
          }
        }
      })
  }

  public jackscrewScale(values: any[]) {
    let newValues: any[] = []
    values.forEach((number) => {
      let newNumber = ((number / 12) * -1).toFixed(3);
      newValues.push(newNumber);
    });

    return newValues
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
          await this.processFunctions(); // run functions on channels requiring addition channel defs ie. FARB ARMS, Jackscrew ect
          Object.keys(this.batchDict).forEach((key:any) => {
            let valuesArr = this.batchDict[key]['values'];
            let newValues = '';
            valuesArr.forEach((element:any, index:number) => {
              if (index !== 0) {
              newValues = newValues + ', ' + element.toString()
              } else {
                newValues = newValues + element.toString()
              } 
            });
            this.batchDict[key]['values'] = newValues;
            this.batchMatrix.push(this.batchDict[key])
            this.batchMatrix = cloneDeep(this.batchMatrix)
            this.exportIsDisabled = false;
          });
        }
      });
      console.log(this.batchMatrix)
    } else {
      alert('Problem loading CSV file');
    }
  }

  exportBatchMatrix(){
    const options = { 
      fieldSeparator: ',',
      filename: 'PM Batch Matrix',
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
   
  csvExporter.generateCsv(this.batchMatrix);

  }

}
