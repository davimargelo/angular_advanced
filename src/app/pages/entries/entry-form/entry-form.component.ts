import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import toastr from "toastr";
import { EntryService } from '../shared/entry.service';
import { Entry } from './../shared/entry.model';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string; // "edit" or "new"
  entryForm: FormGroup;
  pageTitle: string = '';
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  entry: Entry = new Entry();

  constructor(private entryService: EntryService, private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  onSubmit() {
    this.submittingForm = true;

    if (this.currentAction == 'new') {
      this.createEntry();
    } else { // currentAction == 'edit
      this.updateEntry();
    }
  }

  // PRIVATE METHODS
  private setCurrentAction() {
    if (this.route.snapshot.url[0]?.path == 'new')
      this.currentAction = 'new';
    else
      this.currentAction = 'edit'
  }

  private buildEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [null, [Validators.required]],
      categoryId: [null, [Validators.required]]
    });
  }

  private loadEntry() {
    if (this.currentAction == 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get('id')))
      )
        .subscribe(res => {
          this.entry = res;
          this.entryForm.patchValue(this.entry);
        })
    }
  }

  private setPageTitle() {
    if (this.currentAction == 'new')
      this.pageTitle = 'Cadastro de novO lançamento'
    else {
      const entryName = this.entry.name || ''
      this.pageTitle = "Editando lançamento: " + entryName;
    }
  }

  private createEntry() {
    const entry = Object.assign(new Entry(), this.entryForm.value);

    this.entryService.create(entry).subscribe(
      entry => this.actionsForSuccess(entry),
      error => this.actionsForError(error)
    );
  }

  private updateEntry() {
    const entry = Object.assign(new Entry(), this.entryForm.value);

    this.entryService.update(entry).subscribe(
      entry => this.actionsForSuccess(entry),
      error => this.actionsForError(error)
    );
  }

  private actionsForSuccess(entry: Entry) {
    toastr.success("Solicitação processada com sucesso!");
    this.router.navigateByUrl('entries', { skipLocationChange: true }).then(
      () => this.router.navigate(['entries', entry.id, 'edit'])
    );
  }

  private actionsForError(error) {
    toastr.error('Ocorreu um erro ao processar a sua solicitação!');
    this.submittingForm = false;

    if (error.status === 422)
      this.serverErrorMessages = JSON.parse(error._body).errors;
    else
      this.serverErrorMessages = ['Falha na comunicação com o servidor. Por favor, tente mais tarde.']
  }
}
