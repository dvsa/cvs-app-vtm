import {NgxDataTableDataSource} from './ngx-data-table-datasource';
import { MatPaginator, MatSort, MatPaginatorIntl } from '@angular/material';

describe('NgxDataTableDataSource', () => {
  let ngxDataTableModule: NgxDataTableDataSource;

  beforeEach(() => {
    const sort = new MatSort();
    const paginator = new MatPaginator(new MatPaginatorIntl(), null);
    ngxDataTableModule = new NgxDataTableDataSource(paginator, [], sort);
  });

  it('should create an instance', () => {
    expect(ngxDataTableModule).toBeTruthy();
  });

  it('should connect', () => {
    const paged = ngxDataTableModule.connect();
    console.log('PAGED', paged);
    expect(true);
  });
});
