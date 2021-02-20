import { CategoryService } from './../../categories/shared/category.service';
import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Category } from '../../categories/shared/category.model';
import { EntryService } from '../shared/entry.service';
import { Entry } from './../shared/entry.model';
import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource-form/base-resource-form.component';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss']
})
export class EntryFormComponent extends BaseResourceFormComponent<Entry> implements OnInit {

  categories: Category[] = [];

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  };

  ptBR: any;

  constructor(protected entryService: EntryService, protected categoryService: CategoryService, protected injector: Injector) {
    super(injector, new Entry(), entryService, Entry.fromJson);
  }

  ngOnInit(): void {
    this.ptBR = {
      firstDayOfWeek: 0,
      dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
      dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
      monthNames: [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
        'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ],
      monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      today: 'Hoje',
      clear: 'Limpar'
    };
    super.ngOnInit();
    this.loadCategories();
  }

  get typeOptions(): Array<any> {
    return Object.entries(Entry.types).map(([value, text]) => {
      return {
        text: text,
        value: value
      }
    })
  }

  protected buildResourceForm() {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ['expense', [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]]
    });
  }

  protected creationPageTitle(): string {
    return `Cadastro de novo lançamento`;
  }

  protected editionPageTitle(): string {
    return `Editando lançamento: ${this.resource.name || ''}`
  }

  // PRIVATE METHODS

  private loadCategories() {
    this.categoryService.getAll().subscribe(res => {
      this.categories = res;
    })
  }
}
