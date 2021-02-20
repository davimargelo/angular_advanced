import { Directive, OnInit } from '@angular/core';
import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

@Directive()
export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

    resources: T[] = [];

    constructor(protected resourceService: BaseResourceService<T>) { }

    ngOnInit(): void {
        this.getData();
    }

    getData(): void {
        this.resourceService.getAll().subscribe(res => {
            this.resources = res.sort((a, b) => b.id - a.id);
        }, error => {
            alert('Erro ao carregar a lista');
        });
    }

    deleteResource(resource: T): void {
        const mustDelete = confirm('Deseja realmente excluir este item?');
        if (mustDelete)
            this.resourceService.delete(resource.id).subscribe(() => {
                // this.resources = this.resources.filter(element => element != resource);
                this.getData();
            }, () => {
                alert("Erro ao excluir");
            });
    }
}
