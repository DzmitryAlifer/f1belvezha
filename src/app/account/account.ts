import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {combineLatest, Observable} from 'rxjs';
import { debounceTime, filter, map, switchMap} from 'rxjs/operators';
import * as fullResultsSelectors from '../full-results/store/full-results.selectors';
import * as toolbarSelectors from '../toolbar/store/toolbar.selectors';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { UserService } from '../service/user.service';
import { User } from '../types';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-account',
  templateUrl: './account.html',
  styleUrls: ['./account.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent {
  readonly displayedColumns = [];
  readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);
  readonly currentUser = this.store.select(toolbarSelectors.selectCurrentUser);
  private readonly playersResults = this.store.select(toolbarSelectors.selectPlayersResults);
  private readonly allPredictions = this.store.select(fullResultsSelectors.selectAllPredictions);

  readonly currentUserPredictions = combineLatest([this.currentUser, this.allPredictions]).pipe(
    debounceTime(0),
    map(([currentUser, allPredictions]) => 
      allPredictions.filter(prediction => prediction.userid == currentUser?.id)
        .sort((left, right) => (left.round ?? 0) - (right.round ?? 0))));

  readonly currentUserResults = combineLatest([this.currentUser, this.playersResults]).pipe(
    debounceTime(0),
    map(([currentUser, playersResults]) => 
      playersResults.filter(playersResult => playersResult.userid == currentUser?.id)
        .sort((left, right) => (left.round ?? 0) - (right.round ?? 0))));
  
  selectedFile?: File;
  selectedFileName?: string;
  progressInfo: any;
  message = '';
  uploadedImage: any;
  isImageLoaded = false

  readonly loadedImage = this.currentUser.pipe(
    switchMap(user => this.userService.getUserById(user?.id!)),
    map(user => user.avatar),
    filter(avatar => !!avatar),
    map(imageFile => {
      const imageUrl = URL.createObjectURL(new Blob([imageFile!], {type: 'image/png'}));
      return this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    }),
  );

  constructor(
    private readonly domSanitizer: DomSanitizer,
    private readonly store: Store,
    private readonly userService: UserService,
  ) {}

  selectFile(event: any): void {
    this.message = '';
    this.selectedFileName = '';
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.uploadedImage = e.target.result;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  upload(user: User | null): void {
    if (!this.selectedFile || !user) {
      return;
    }

    this.progressInfo = {value: 0, fileName: this.selectedFile.name};

    this.userService.updateUserAvatar({...user, avatar: this.selectedFile}).subscribe((event: any) => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progressInfo.value = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        this.message = 'Uploaded the file successfully: ' + this.selectedFile?.name;
      }
    }, (err: any) => {
      this.progressInfo.value = 0;
      this.message = 'Could not upload the file: ' + this.selectedFile?.name;
    });
  }
}
