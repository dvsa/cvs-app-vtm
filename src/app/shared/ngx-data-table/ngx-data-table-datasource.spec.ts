import {NgxDataTableDataSource} from './ngx-data-table-datasource';
import { MatPaginator, MatSort, MatPaginatorIntl } from '@angular/material';

describe('NgxDataTableDataSource', () => {
  let ngxDataTableDataSource: NgxDataTableDataSource;

  beforeEach(() => {
    const sort = new MatSort();
    const paginator = new MatPaginator(new MatPaginatorIntl(), null);
    ngxDataTableDataSource = new NgxDataTableDataSource(paginator, [], sort);
  });

  it('should create an instance', () => {
    expect(ngxDataTableDataSource).toBeTruthy();
  });
});
