import { Pipe, PipeTransform } from '@angular/core';
import { module } from '../models/module';

@Pipe({
  name: 'filterSubmodule'
})
export class FilterSubmodulePipe implements PipeTransform {

  transform(submodule: module[], filter:string): any {
    if(!submodule)
      return submodule;
    return submodule.filter(mod => mod.Principal === filter);
  }

}
