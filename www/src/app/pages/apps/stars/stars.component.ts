import { Component, OnInit ,Input} from '@angular/core';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.css']
})
export class StarsComponent implements OnInit {
  @Input()
  public rating: number;
  public stars = [];
  constructor() { }

  ngOnInit() {
    const full: number = Math.floor(this.rating);
    const half: number = Math.ceil(this.rating - full);
    const empty: number = 5 - full - half;
    for (let i = 0; i < 5; i++) {
      if (i < full) {
        this.stars.push('full');
      } else if (i === full && half !== 0) {
        this.stars.push('half')
      } else {
        this.stars.push('empty')
      }
    }
  }

}
