import { Pipe, PipeTransform } from '@angular/core';
import { profile } from '../models/profile';

@Pipe({
  name: 'filterTableUsers'
})
export class FilterTableUsersPipe implements PipeTransform {

  transform(profiles: profile[], search: string): any {
    if (profiles.length == 0 || !search )
      return profiles;
    return profiles.filter(f => f.IdUser.toLowerCase().includes(search.toLowerCase()) || f.NameUser.toLowerCase().includes(search.toLowerCase()) || f.WhsCode.toLowerCase().includes(search.toLowerCase()));
  }

}
