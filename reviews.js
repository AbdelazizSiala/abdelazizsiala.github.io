/* ==========================================================================
   Client reviews — the single source of truth
   ==========================================================================
   One entry per reviewed freelance project. The same entry powers:
     • the testimonial marquee on the mentorship page   (index.html)
     • the "Client Review" block on a project page       (portfolio/<slug>/)

   Paths are absolute from the site root: this repo is a GitHub Pages *user*
   site, so it is always served from the domain root and one entry stays
   usable from any page depth.

   Per review:
     slug    — the project folder name, e.g. "poppies"
     title   — project title + one-line pitch
     img     — thumbnail used in the marquee strips
     detail  — the review screenshot itself
     media   — OPTIONAL carousel entries shown beside the review:
                 { type: 'video', src: '/videos/poppies/review.mp4' }
                 { type: 'image', src: '/images/proof/poppies/shot_1.png' }
     link    — where "View Original Review" points
   ========================================================================== */
(function (global) {
  'use strict';

  var REVIEWS = [
    { slug: 'poppies',
      title: 'Poppies - A platformer rage game',
      img: '/images/proof/poppies/thumb.png',
      detail: '/images/proof/poppies/review.png',
      media: [
        { type: 'video', src: '/videos/poppies/review.mp4' },
        { type: 'image', src: '/images/proof/poppies/shot_1.png' },
        { type: 'image', src: '/images/proof/poppies/shot_2.png' },
        { type: 'image', src: '/images/proof/poppies/shot_3.png' },
        { type: 'image', src: '/images/proof/poppies/shot_4.png' },
        { type: 'image', src: '/images/proof/poppies/shot_5.png' }
      ],
      link: 'https://www.fiverr.com/abdelazizsiela' },
    { slug: 'secure-networking-journey',
      title: 'Secure Networking Journey - A web-based interactive game',
      img: '/images/proof/secure-networking/thumb.png',
      detail: '/images/proof/secure-networking/review.png',
      media: [
        { type: 'video', src: '/videos/secure-networking/review.mp4' },
        { type: 'image', src: '/images/proof/secure-networking/shot_1.png' },
        { type: 'image', src: '/images/proof/secure-networking/shot_2.png' },
        { type: 'image', src: '/images/proof/secure-networking/shot_3.png' },
        { type: 'image', src: '/images/proof/secure-networking/shot_4.png' },
        { type: 'image', src: '/images/proof/secure-networking/shot_5.png' }
      ],
      link: 'https://www.freelancer.com/u/AbdelazizSiela?review_context_id=39591423&review_type=project&frm=AbdelazizSiala&sb=t' },
    { slug: 'parrot-flip',
      title: 'Parrot Flip - Flappy Bird Style Game for Telegram',
      img: '/images/proof/parrot-flip/thumb.png',
      detail: '/images/proof/parrot-flip/review.png',
      media: [
        { type: 'video', src: '/videos/parrot-flip/review.mp4' },
        { type: 'image', src: '/images/proof/parrot-flip/shot_1.png' },
        { type: 'image', src: '/images/proof/parrot-flip/shot_2.png' },
        { type: 'image', src: '/images/proof/parrot-flip/shot_3.png' },
        { type: 'image', src: '/images/proof/parrot-flip/shot_4.png' }
      ],
      link: 'https://www.upwork.com/freelancers/~012da270323100a2e9?mp_source=share' },
    { slug: 'attack-on-monsters',
      title: 'Attack On Monsters - An endless runner game',
      img: '/images/proof/attack-on-monsters/thumb.png',
      detail: '/images/proof/attack-on-monsters/review.png',
      media: [
        { type: 'video', src: '/videos/attack-on-monsters/review.mp4' },
        { type: 'image', src: '/images/proof/attack-on-monsters/shot_1.png' }
      ],
      link: 'https://www.fiverr.com/abdelazizsiela' },
    { slug: 'gekoly-runner',
      title: 'Gekoly Runner - An endless runner mobile game',
      img: '/images/proof/gekoly-runner/thumb.png',
      detail: '/images/proof/gekoly-runner/review.png',
      media: [
        { type: 'video', src: '/videos/gekoly-runner/review.mp4' },
        { type: 'image', src: '/images/proof/gekoly-runner/shot_1.png' }
      ],
      link: 'https://www.fiverr.com/abdelazizsiela' },
    { slug: 'planes-attack',
      title: 'Planes Attack - An endless shooter game',
      img: '/images/proof/planes-attack/thumb.png',
      detail: '/images/proof/planes-attack/review.png',
      media: [
        { type: 'video', src: '/videos/planes-attack/review.mp4' },
        { type: 'image', src: '/images/proof/planes-attack/shot_1.png' }
      ],
      link: 'https://www.fiverr.com/abdelazizsiela' },
    { slug: 'steps',
      title: 'Steps - A puzzle game',
      img: '/images/proof/steps/thumb.png',
      detail: '/images/proof/steps/review.png',
      media: [
        { type: 'video', src: '/videos/steps/review.mp4' },
        { type: 'image', src: '/images/proof/steps/shot_1.png' }
      ],
      link: 'https://www.fiverr.com/abdelazizsiela' },
    { slug: 'end-of-civilization',
      title: 'End Of Civilization - A First-Person-Shooter game',
      img: '/images/proof/end-of-civilization/thumb.png',
      detail: '/images/proof/end-of-civilization/review.png',
      media: [
        { type: 'video', src: '/videos/end-of-civilization/review.mp4' },
        { type: 'image', src: '/images/proof/end-of-civilization/shot_1.png' }
      ],
      link: 'https://www.fiverr.com/abdelazizsiela' }
  ];

  var BY_SLUG = {};
  REVIEWS.forEach(function (review) { BY_SLUG[review.slug] = review; });

  global.REVIEWS = REVIEWS;
  global.REVIEW_BY_SLUG = BY_SLUG;
})(window);
