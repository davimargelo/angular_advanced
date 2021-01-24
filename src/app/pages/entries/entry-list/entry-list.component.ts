import { Component, OnInit } from '@angular/core';
import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss']
})
export class EntryListComponent implements OnInit {

  entries: Entry[] = [];

  constructor(private entryService: EntryService) { }

  ngOnInit(): void {
   this.getData();
  }

  getData(): void {
    this.entryService.getAll().subscribe(res => {
      this.entries = res;
    }, error => {
      alert('Erro ao carregar a lista');
    });
  }

  deleteEntry(entry: Entry): void {
    const mustDelete = confirm('Deseja realmente excluir este item?');
    if (mustDelete)
      this.entryService.delete(entry.id).subscribe(() => {
        // this.entries = this.entries.filter(element => element != entry);
        this.getData();
      }, () => {
        alert("Erro ao excluir");
      });
  }
}
