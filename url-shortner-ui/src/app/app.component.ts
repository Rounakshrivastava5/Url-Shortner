import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UrlShortenerComponent } from './components/url-shortner/url-shortner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UrlShortenerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'url-shortner-ui';
}
