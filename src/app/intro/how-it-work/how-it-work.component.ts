import { Component } from '@angular/core';
import criteria from '../../shared/criteria.json'
import { RatingExplaining } from '../../shared/interfaces/rating-explaining';
import { Router } from '@angular/router';

@Component({
  selector: 'app-how-it-work',
  templateUrl: './how-it-work.component.html',
  styleUrl: './how-it-work.component.scss'
})
export class HowItWorkComponent {
  ratingExplaining: Array<RatingExplaining> = [
    {
      value: 1,
      keyWord: "Nunca",
      description: "O avaliado nunca apresenta o comportamento descrito."
    },
    {
      value: 2,
      keyWord: "Raramente",
      description: "O avaliado apresenta longos espaçamentos entre as apresentações do comportamento descrito, tendo sido observado poucas vezes."
    },
    {
      value: 3,
      keyWord: "Às vezes",
      description: "O avaliado às vezes apresenta o comportamento descrito durante a sua rotina, tendo sido observado com frequência inconsistente."
    },
    {
      value: 4,
      keyWord: "Frequentemente",
      description: "O avaliado apresenta com frequência o comportamento descrito, tendo sido observado de maneira consistente."
    },
    {
      value: 5,
      keyWord: "Sempre",
      description: "O avaliado sempre apresenta o comportamento descrito."
    }
  ];
  dimensions: Array<{name: string, color: string}> = criteria.map(item => ({ name: item.dimension, color: item.color }));

  constructor(private router: Router) { }

  goToIdentification() {
    this.router.navigate(['/identification']);
    window.scrollTo(0, 0);
  }

  goToTeacherSelection() {
    this.router.navigate(['/teacher']);
    window.scrollTo(0, 0);
  }
}
