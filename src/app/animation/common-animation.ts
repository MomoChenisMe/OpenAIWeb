import {
  animate,
  animateChild,
  group,
  query,
  stagger,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const fadeInUpRouterAnimation = trigger('fadeInUpRouterAnimation', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      }),
    ], { optional: true }),
    query(':enter', [
      style({
        opacity: 0,
        transform: 'translateY(50px)',
      }),
    ], { optional: true }),
    query(':leave', animateChild(), { optional: true }),
    group([
      query(':leave', [
        animate(
          '300ms ease-out',
          style({
            opacity: 0,
            transform: 'translateY(-50px)',
          })
        ),
      ], { optional: true }),
      query(':enter', [
        style({ opacity: 0 }),
        stagger(50, [
          animate(
            '300ms cubic-bezier(0.35, 0, 0.25, 1)',
            style({ opacity: 1, transform: 'translateY(0)' })
          ),
        ]),
      ], { optional: true }),
    ]),
    query(':enter', animateChild(), { optional: true }),
  ]),
]);

export const fadeInOutAnimation = trigger('fadeInOutAnimation', [
  state('hidden', style({
    opacity: 0,
    display: 'none'
  })),
  state('visible', style({
    opacity: 1,
    display: 'block'
  })),
  state('void', style({
    opacity: 0,
    display: 'none'
  })),
  state('*', style({
    opacity: 1,
    display: 'block'
  })),
  transition('void => *', [
    style({ opacity: 0, display: 'block' }),
    animate('300ms ease-out', style({ opacity: 1 }))
  ]),
  transition('visible => hidden', [
    animate('300ms ease-out', style({ opacity: 0 }))
  ])
]);
