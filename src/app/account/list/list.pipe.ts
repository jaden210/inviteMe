import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {


  transform(stores, args?: string) {
    let filter: string[] = args ? args.trim().split(/\s+/) : null;
    let rv: any[] = [];

    if (filter) {
      cardLoop: // loop variable
      for (let store of stores) {
        for (let f of filter) { // for value of filter array, built from arguments passed in
          if (store.lastName.toLowerCase().includes(f.toLowerCase())) { // convert to lower case, compare keyword to f
              rv.push(store); // append matching store to results[]
              continue cardLoop; // if block true, run filters loop again
          }
          if (store.firstName) {
              if (store.firstName.toLowerCase().includes(f.toLowerCase())) { // convert to lower case, compare keyword to f
                  rv.push(store); // append matching store to results[]
                  continue cardLoop; // if block true, run filters loop again
              }
          }
        
        }
    } return rv;
  } else {
    return stores; // empty args returns whole stores list
  }
}
}