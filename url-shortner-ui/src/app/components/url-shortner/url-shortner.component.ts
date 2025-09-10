import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UrlService, ShortenRequest, UrlEntry } from '../../services/url.service';
// import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-url-shortener',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './url-shortner.component.html',
  styleUrls: ['./url-shortner.component.scss']
})
export class UrlShortenerComponent implements OnInit {
  urlForm: FormGroup;
  shortenedUrl: string = '';
  isLoading: boolean = false;
  urlList: {[key: string]: UrlEntry} = {};
  isLoadingList: boolean = false;
  isDarkMode: boolean = true; // Default to dark mode
  
  // Add this line
  Object = Object;

  constructor(
    private fb: FormBuilder,
    private urlService: UrlService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.urlForm = this.fb.group({
      longUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      customCode: [''],
      expireMinutes: ['']
    });

    // Load theme preference from localStorage only in browser
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.isDarkMode = savedTheme === 'dark';
      }
      this.applyTheme();
    }
  }

  ngOnInit() {
    this.loadUrlList();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    
    // Save to localStorage only in browser
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    }
    
    this.applyTheme();
  }

  private applyTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const component = document.querySelector('app-url-shortener');
      if (component) {
        if (this.isDarkMode) {
          component.classList.remove('light-theme');
          component.classList.add('dark-theme');
        } else {
          component.classList.remove('dark-theme');
          component.classList.add('light-theme');
        }
      }
    }
  }

  onSubmit() {
    if (this.urlForm.valid) {
      this.isLoading = true;
      const request: ShortenRequest = {
        long_url: this.urlForm.value.longUrl,
        custom_code: this.urlForm.value.customCode || undefined,
        expire_minutes: this.urlForm.value.expireMinutes ? parseInt(this.urlForm.value.expireMinutes) : undefined
      };

      this.urlService.shortenUrl(request).subscribe({
        next: (response) => {
          this.shortenedUrl = response.short_url;
          this.isLoading = false;
          this.loadUrlList(); // Refresh the list after creating a new URL
          this.urlForm.reset(); // Clear the form
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error shortening URL:', error);
        }
      });
    }
  }

  loadUrlList() {
    this.isLoadingList = true;
    this.urlService.getAllUrls().subscribe({
      next: (urls) => {
        this.urlList = urls;
        this.isLoadingList = false;
      },
      error: (error) => {
        console.error('Error loading URL list:', error);
        this.isLoadingList = false;
      }
    });
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      console.log('URL copied to clipboard!');
    });
  }

  getShortUrl(shortCode: string): string {
    // This will now return the custom domain URL
    return `https://short.ly/${shortCode}`;
  }

  isExpired(expiryTime: string | null): boolean {
    if (!expiryTime || expiryTime === 'Never') return false;
    return new Date(expiryTime) < new Date();
  }

  formatExpiryTime(expiryTime: string | null): string {
    if (!expiryTime || expiryTime === 'Never') return 'Never expires';
    const date = new Date(expiryTime);
    return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  }
}
