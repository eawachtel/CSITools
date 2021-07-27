import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { data } from 'jquery';
import * as Papa from 'papaparse';
import { cloneDeep } from 'lodash';

import {partsDefList} from '../../external-data/part-definition-list'
import {inputDisplayNames} from '../../external-data/batch-parameter-mapping'

@Component({
  selector: 'app-submit-dialog',
  templateUrl: './submit-dialog.component.html',
  styleUrls: ['./submit-dialog.component.css']
})
export class SubmitDialogComponent implements OnInit {

  uniqueValueList: any;
  newChannelsDict:any = [];

  constructor( public dialogRef: MatDialogRef<SubmitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.uniqueValueList = this.data.uniqueValueList;
    this.newChannelsDict = this.data.newChannelsDict;
    console.log('uniqueVal', this.uniqueValueList);
    console.log('newChannelsDict', this.newChannelsDict);

  }

  ngOnInit(): void {
    
  }

  onCancel(): void {
    let data = {data: 'test'}
    this.dialogRef.close({data: 'test'});
    alert('Dialog Closed No Files Loaded')
  }

public addCSVData(files: any, j:number, i:number) {
    let file = files.target.files[0]
    if (file) {
      Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: (result) => {
          let csvdata = result.data;
          let csvDict: any = {};
          csvdata.forEach((item:any) => {
            let key:any = item[0];
            csvDict[key] = item[1];
          })
          console.log(csvDict)
          this.addPartData(csvDict, j, i)
          }
        });
    } else {
      alert('Problem loading CSV file');
    }
  }

  addPartData(csvDict:any, j:number, i:number) {
    let origChannel = this.uniqueValueList[i].channel;
    let channelList = partsDefList[origChannel].channels;
    channelList.forEach((displayChannel:any) => {
      let paramMapObj = inputDisplayNames[displayChannel];
      let value = csvDict[paramMapObj.WorkflowName];
      let scaleValue = (+value * +paramMapObj.Scale).toFixed(2).toString();
      let baseValues = this.newChannelsDict[displayChannel].values;
      let testValue = this.uniqueValueList[i].values[j];
      let updatedValues: string[] = [];
      baseValues.forEach((value:any) => {
        if (value == testValue) {
          updatedValues.push(scaleValue);
        } else {
          updatedValues.push(value);
        }
        this.newChannelsDict[displayChannel].values = updatedValues;
      });
    });
    console.log(this.newChannelsDict)
    // switch(origChannel) {
    //   case 'LFFARBArm':
        
    //     break;
    // }
  }
}
