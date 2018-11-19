import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pbx-memu',
  templateUrl: './pbx-memu.component.html',
  styleUrls: ['./pbx-memu.component.css']
})
export class PbxMemuComponent implements OnInit {
  @Input() memu: string;
  constructor() { }

  ngOnInit() {
    console.log('men', this.memu);
  }

}
