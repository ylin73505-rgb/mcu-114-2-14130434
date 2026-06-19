import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';

import { Product } from '../model/product';
import { ProductCardListComponent } from '../product-card-list/product-card-list.component';
import { ProductService } from '../services/product.service';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-product-page',
  imports: [PaginationComponent, ProductCardListComponent],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss',
})
export class ProductPageComponent {
  private readonly router = inject(Router);

  private readonly productService = inject(ProductService);

  protected readonly pageIndex = signal(1);

  protected readonly pageSize = signal(5);

  private readonly data = rxResource({
    params: () => ({ pageIndex: this.pageIndex(), pageSize: this.pageSize() }),
    defaultValue: { data: [], count: 0 },
    stream: ({ params }) => {
      const { pageIndex, pageSize } = params;
      return this.productService.getList(undefined, pageIndex, pageSize);
    },
  });

  protected readonly totalCount = computed(() => {
    const { count } = this.data.value();
    return count;
  });

  protected readonly products = computed(() => {
    const { data } = this.data.value();
    return data;
  });

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onEdit(product: Product): void {
    this.router.navigate(['product', 'form', product.id]);
  }

  onView(product: Product): void {
    this.router.navigate(['product', 'view', product.id]);
  }

  onAdd(): void {
    this.router.navigate(['product', 'new']);
  }

  onRemove({ id }: Product): void {
    this.productService.remove(id).subscribe(() => this.pageIndex.set(1));
  }
}
