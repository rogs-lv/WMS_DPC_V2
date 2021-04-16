import { Pipe, PipeTransform } from '@angular/core';
import { module } from '../models/module';

@Pipe({
  name: 'filterModule'
})
export class FilterModulePipe implements PipeTransform {

  transform(module_: module[], filter: string): any {
    if(!module_)
      return module_;
    return module_.filter(mod => mod.Principal === '' && mod.IdModule !== filter);
  }

}
