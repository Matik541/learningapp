import { Injectable } from '@angular/core'
import { Bar } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class ProgressBarService {
  hidden: Bar['hidden'] = true
  mode: Bar['mode'] = 'indeterminate'
  value: Bar['value'] = 0

  constructor() {}
}
