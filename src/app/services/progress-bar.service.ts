import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {

  bars: ProgressBar[] = []
  
  constructor() { }

  createBar(name: string, max: number, current?: number, mode?: 'determinate' | 'indeterminate' | 'buffer' | 'query'): ProgressBar {
    let bar = new ProgressBar(name, max, current, mode);
    this.bars.push(bar);
    return bar;
  }

  getBar(name: string): ProgressBar | undefined {
    return this.bars.find(bar => bar.name == name);
  }
}

export class ProgressBar {
  constructor(private _name: string, public max: number, public current: number = 0, public mode: 'determinate' | 'indeterminate' | 'buffer' | 'query' = 'determinate') { }

  get name(): string {
    return this._name;
  }
  get percentage(): number {
    return this.current / this.max * 100;
  }
}