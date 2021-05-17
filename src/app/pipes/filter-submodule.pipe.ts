import { Pipe, PipeTransform } from '@angular/core';
import { module, moduleHome } from '../models/module';

@Pipe({
  name: 'filterSubmodule'
})
export class FilterSubmodulePipe implements PipeTransform {

  transform(submodule: moduleHome[], filter:string): any {
    if(!submodule)
      return submodule;
    return submodule.filter(mod => mod.Principal === filter);
  }

}
