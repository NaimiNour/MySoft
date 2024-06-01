import { Component } from '@angular/core';
import * as Isotope from 'isotope-layout';
import { fromEvent, throttle, throttleTime } from 'rxjs';
import Swiper from 'swiper';
declare var Waypoint: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'myOwnNew';
  classList: any;
  nextElementSibling: any;
  hash!: string;
  
constructor() {}




  ngOnInit():void {

    
  /**
     * Easy selector helper function
     */
  const select = (el: string, all = false): any => {
    el = el.trim()
    if (all) {
      return Array.from(document.querySelectorAll(el)); // Convertit en tableau
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type: string, el: string, listener: EventListenerOrEventListenerObject, all = false): void => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach((e: HTMLElement) => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }
   /**
   * Easy on scroll event listener 
   */
   const onscroll = (el: Document, listener: () => void) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 50
    //200
    navbarlinks.forEach((navbarlink: { hash: string; classList: { add: (arg0: string) => void; remove: (arg0: string) => void; }; }) => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

 /**
   * Scrolls to an element with header offset
   */
 const scrollto = (el: string) => {
  let header = select('#header')
  let offset = header.offsetHeight

  if (!header.classList.contains('header-scrolled')) {
    offset -= 20
  }

  let elementPos = select(el).offsetTop
  window.scrollTo({
    top: elementPos - offset,
    behavior: 'smooth'
  })
}
 /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
 let selectHeader = select('#header')
 if (selectHeader) {
   const headerScrolled = () => {
     if (window.scrollY > 100) {
       selectHeader.classList.add('header-scrolled')
     } else {
       selectHeader.classList.remove('header-scrolled')
     }
   }
   window.addEventListener('load', headerScrolled)
   onscroll(document, headerScrolled)
 }
 /**
   * Hero carousel indicators
   */
 let heroCarouselIndicators = select("#hero-carousel-indicators")
 let heroCarouselItems = select('#heroCarousel .carousel-item', true)

 heroCarouselItems.forEach((item: any, index: string | number) => {
   (index === 0) ?
   heroCarouselIndicators.innerHTML += "<li data-bs-target='#heroCarousel' data-bs-slide-to='" + index + "' class='active'></li>":
     heroCarouselIndicators.innerHTML += "<li data-bs-target='#heroCarousel' data-bs-slide-to='" + index + "'></li>"
 });

 /**
  * Back to top button
  */
 let backtotop = select('.back-to-top')
 if (backtotop) {
   const toggleBacktotop = () => {
     if (window.scrollY > 100) {
       backtotop.classList.add('active')
     } else {
       backtotop.classList.remove('active')
     }
   }
   window.addEventListener('load', toggleBacktotop)
   onscroll(document, toggleBacktotop)
 }
   /**
   * Mobile nav toggle
   */
   on('click', '.mobile-nav-toggle', (e) => {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', (e) => {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', (e) => {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)


    /**
   * Scroll with ofset on page load with hash links in the url
   */
    window.addEventListener('load', () => {
      if (window.location.hash) {
        if (select(window.location.hash)) {
          scrollto(window.location.hash)
        }
      }
    });
  
    /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }

 


 /**
  * Skills animation
  */
 let skilsContent = select('.skills-content');
 if (skilsContent) {
   new Waypoint({
     element: skilsContent,
     offset: '80%',
     handler: function(direction: any) {
       let progress = select('.progress .progress-bar', true);
       progress.forEach((el: { style: { width: string; }; getAttribute: (arg0: string) => string; }) => {
         el.style.width = el.getAttribute('aria-valuenow') + '%'
       });
     }
   })
 }
  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', (e) => {
        e.preventDefault();
        portfolioFilters.forEach(function(el: { classList: { remove: (arg0: string) => void; }; }) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        // portfolioIsotope.on('arrangeComplete', function() {
        //   AOS.refresh()
        // });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Clients Slider
   */
  new Swiper('.clients-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      480: {
        slidesPerView: 3,
        spaceBetween: 20
      },
      640: {
        slidesPerView: 4,
        spaceBetween: 20
      },
      992: {
        slidesPerView: 6,
        spaceBetween: 20
      }
    }
  });

  
}
  getAttribute(arg0: string): string | ((itemElement: HTMLElement) => boolean) | undefined {
    throw new Error('Method not implemented.');
  }

}
function GLightbox(arg0: { selector: string; }) {
  throw new Error('Function not implemented.');
}

