import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class ProgressBarService {
  bars: ProgressBar[] = []
  spinners: ProgressSpinner[] = []

  constructor() {}

  createBar(
    name: string,
    max: number,
    current: number = 0,
    mode: 'determinate' | 'indeterminate' | 'buffer' | 'query' = 'determinate',
  ): ProgressBar {
    let bar = new ProgressBar(name, max, current, mode)
    this.bars.push(bar)
    return bar
  }

  getBar(name: string): ProgressBar | undefined {
    return this.bars.find((bar) => bar.name == name)
  }

  createSpinner(
    name: string,
    max: number,
    current: number = 0,
    mode: 'determinate' | 'indeterminate' = 'determinate',
  ): ProgressSpinner {
    let spinner = new ProgressSpinner(name, max, current, mode)
    this.spinners.push(spinner)
    return spinner
  }

  getSpinner(name: string): ProgressSpinner | undefined {
    return this.spinners.find((spinner) => spinner.name == name)
  }
}

export class ProgressBar {
  constructor(
    private _name: string,
    public max: number,
    public current: number = 0,
    public mode:
      | 'determinate'
      | 'indeterminate'
      | 'buffer'
      | 'query' = 'determinate',
  ) {}

  get name(): string {
    return this._name
  }
  get percentage(): number {
    return (this.current / this.max) * 100
  }
}

export class ProgressSpinner {
  constructor(
    private _name: string,
    public max: number,
    public current: number = 0,
    public mode: 'determinate' | 'indeterminate' = 'determinate',
  ) {}

  get name(): string {
    return this._name
  }
  get percentage(): number {
    return (this.current / this.max) * 100
  }
}
