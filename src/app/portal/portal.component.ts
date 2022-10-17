import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatRadioChange } from '@angular/material/radio'
import { Subscription } from 'rxjs'
import { ThemeSetterService } from '../theme-setter.service'

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss']
})
export class PortalComponent implements OnInit {
  constructor () {}

  ngOnInit (): void {}
}
