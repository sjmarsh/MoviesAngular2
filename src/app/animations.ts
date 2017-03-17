import { animate, AnimationEntryMetadata, state, style, transition, trigger } from '@angular/core';

// ref: https://angular.io/docs/ts/latest/guide/router.html#!#route-animation
// Component transition animations

export const slideLeftAnimation: AnimationEntryMetadata =
  trigger('routeAnimation', [
    state('*',
      style({
        opacity: 1,
        transform: 'translateX(0)'
      })
    ),
    transition(':enter', [
      style({
        opacity: 0,
        transform: 'translateX(100%)'
      }),
      animate('0.5s ease-in')
    ])
  ]);

export const slideRightAnimation: AnimationEntryMetadata =
  trigger('routeAnimation', [
    state('*',
      style({
        opacity: 1,
        transform: 'translateX(0)'
      })
    ),
    transition(':enter', [
      style({
        opacity: 0,
        transform: 'translateX(-100%)'
      }),
      animate('0.5s ease-in')
    ])
    
  ]);

