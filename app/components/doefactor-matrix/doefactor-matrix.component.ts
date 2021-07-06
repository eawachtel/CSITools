import { Component, OnInit } from '@angular/core';

import { doeInputFactor } from '../../interfaces/interfaces'


@Component({
  selector: 'app-doefactor-matrix',
  templateUrl: './doefactor-matrix.component.html',
  styleUrls: ['./doefactor-matrix.component.css']
})
export class DOEFactorMatrixComponent implements OnInit {

  inputFactorMatrix: doeInputFactor[] = [];
  options: string[] = ['Angular', 'React', 'Vue'];

  constructor() { }

  ngOnInit(): void {
    
  }

  addFactor(){
    let factorObj: doeInputFactor = {channel:'', unit:'', low: null, high: null};
    this.inputFactorMatrix.push(factorObj);
  }

  addChannel(channel:string, i:number) {
    this.inputFactorMatrix[i].channel = channel;
  }

  
}
