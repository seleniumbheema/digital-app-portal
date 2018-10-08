import { trigger, animate, style, group, query, transition, stagger } from '@angular/animations';

export const routerTransition = trigger('routerTransition', [
  transition('* <=> *', [
    query(':enter, :leave', style({ position: 'absolute', width: '100%', opacity: '0' }), { optional: true }),
    group(
      [  // block executes in parallel
        query(
          ':leave', [
            style({ opacity: '0' }),
            animate('0s ease-in', style({ opacity: '0' })),
          ],
          { optional: true }),
        query(
          ':enter', [
            style({ opacity: '0' }),
            animate('.3s 300ms ease-out', style({ position: 'static', opacity: '1' })),
          ],
          { optional: true }),
      ]),
  ]),
]);

export const fadeIn = trigger('fadeIn', [
  transition('* => *', [
    query('*', style({ opacity: 0 }), { optional: true }),
    query(
      '*', [
        animate('.6s 100ms ease-out', style({ opacity: 1 })),
      ],
      { optional: true }),
  ]),
]);

export const fadeInStagger = trigger('fadeInStagger', [
  transition('* => *', [
    query('.stagger-in', style({ opacity: 0, transform: 'translateX(-40px)' })),
    query('.stagger-in', stagger('200ms', [
      animate('.3s ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
    ])),
    query('.stagger-in', [
      animate(1000, style('*')),
    ]),
  ]),
]);
