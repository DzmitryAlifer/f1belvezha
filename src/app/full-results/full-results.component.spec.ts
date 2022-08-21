import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { FullResultsComponent } from './full-results.component';
import { StoreModule } from '@ngrx/store';


describe('Test1Component', () => {
    let component: FullResultsComponent;
    let fixture: ComponentFixture<FullResultsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FullResultsComponent],
            imports: [
                StoreModule.forRoot({}),
            ],
            providers: [
                { provide: MatDialog, useValue: {} },
            ],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FullResultsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => { 
        expect(component).toBeTruthy();
    });
});
