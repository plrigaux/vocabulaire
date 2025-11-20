import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-corrector-display-test',
    templateUrl: './corrector-display-test.component.html',
    styleUrls: ['./corrector-display-test.component.scss'],
    standalone: false
})
export class CorrectorDisplayTestComponent implements OnInit {

  constructor() { }

  data : CorrectorData[] = [
    { given: "pizza", correct: "pizza"  },
    { given: "foto", correct: "photo"  },
    { given: "murmur", correct: "murmure"  },
    { given: "muremurre", correct: "murmure"  },
    { given: "murmurre", correct: "murmure"  },
  ]
  
  ngOnInit(): void {
  }

}

interface CorrectorData {
  given: string,
  correct: string
}