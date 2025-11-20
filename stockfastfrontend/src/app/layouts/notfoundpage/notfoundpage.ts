import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-notfound-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './notfoundpage.html',
  styleUrls: ['./notfoundpage.scss']
})
export class NotFoundPage {}
