import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { Subject, debounceTime, Subscription } from 'rxjs';
import { MaterialModule } from '../../../material/material-module';

@Component({
  selector: 'shared-search-box',
  imports: [MaterialModule],
  templateUrl: './search-box.component.html',
  styles: [],
})
export class SearchBoxComponent implements OnInit, OnDestroy, OnChanges {
  private debouncer: Subject<string> = new Subject<string>();
  private debouncerSuscription?: Subscription;

  @Input()
  public placeholder: string = '';
  @Input()
  public initialValue: string = '';
  @Output()
  public onValue = new EventEmitter<string>();
  @Output()
  public onDebounce = new EventEmitter<string>();
  public currentValue: string = '';

  ngOnInit(): void {
    this.debouncerSuscription = this.debouncer
      .pipe(debounceTime(300))
      .subscribe((value) => {
        this.onDebounce.emit(value);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialValue']) {
      this.currentValue = changes['initialValue'].currentValue;
    }
  }

  ngOnDestroy(): void {
    this.debouncerSuscription?.unsubscribe();
  }

  emitValue(value: string): void {
    this.onValue.emit(value);
  }

  onKeyPress(searchTerm: string) {
    this.debouncer.next(searchTerm);
  }
}
