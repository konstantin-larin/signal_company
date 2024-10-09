// ELEMENTS
const html = document.documentElement;
const header = document.getElementById('header');
const headerNav = document.getElementById('headerNav');
const navbarToggler = document.getElementById('navbar-toggler');
const headerRutubeLogo = document.getElementById('header-rutube-logo');
const headerLogo = document.getElementById('header-logo');
const mainSection = document.getElementById('main');
const mainScrollBtn = document.getElementById('main-scroll-btn');
const SECTIONS = Array.from(document.querySelectorAll('.section'));
SECTIONS.push(mainSection);
const videosSection = document.getElementById('videos');
const videoCards = Array.from(document.querySelectorAll('.videos__video-card'));
const videoRow = document.querySelector('.videos__video-row');
const videoRowWrapper = videoRow.closest('.videos__video-row-wrapper');
const modalWindow = document.getElementById('modal-window');
const partnersRow = document.getElementById('partners-row');
const footerMap = document.getElementById('footer-map');
const phoneInputs = Array.from(document.querySelectorAll('.js-phone-input'));
const feedback = document.getElementById('feedback');

// HEADER
let navIsReady = true;
// remove big padding by scrolling
function headerShrink() {
    if (this.pageYOffset > 0) {
        header.classList.add('header-shrink-pad');
    }
    else {
        header.classList.remove('header-shrink-pad');
    }
}

// HEADER MOBILE EVENTS
// navbarToggler.onclick = function () {
// }

/*
I wrapped this action in a function because it is also applied when clicking 
on the links of the mobile menu and switch, as well as when resizing the window
*/
function backDefaultNavbar() {
    html.classList.remove('overflow-hidden');
    navbarToggler.classList.remove('color-transition');
    navbarToggler.classList.remove('bg-to-red');
    navbarToggler.classList.remove('burger-to-cross');
    headerNav.classList.remove('show');
    header.classList.add('sticky-top');
    header.classList.remove('fixed-stretch');
    header.querySelector('.container-xl').append(headerRutubeLogo);
    headerRutubeLogo.classList.remove('rutube-logo_mobile');
    headerNav.querySelector('.navbar-nav').classList.remove('align-items-center');
    headerLogo.classList.remove('flex-grow-1');
    headerLogo.style.marginRight = '';
    navIsReady = true;
}
// put it on navbarToggler`s click
function headerMobileNavbarBehaviour() {
    if (headerNav.classList.contains('show')) {
        headerNav.classList.add('opacity-0');
        headerNav.ontransitionend = backDefaultNavbar;
        setTimeout(() => {
            if (!navIsReady) backDefaultNavbar();
        }, 1000);
    }
    else if (!headerNav.classList.contains('show') && navIsReady) {
        headerNav.ontransitionend = '';
        navIsReady = false;
        html.classList.add('overflow-hidden');
        navbarToggler.classList.add('color-transition');
        navbarToggler.classList.add('bg-to-red');
        navbarToggler.classList.add('burger-to-cross');
        headerNav.classList.add('show');
        header.classList.remove('sticky-top');
        header.classList.add('fixed-stretch');
        headerNav.classList.add('opacity-0');
        setTimeout(() => {
            headerNav.classList.remove('opacity-0');
        }, 0);
        headerNav.querySelector('.navbar-nav').append(headerRutubeLogo);
        headerRutubeLogo.classList.add('rutube-logo_mobile');
        headerNav.querySelector('.navbar-nav').classList.add('align-items-center');
        headerLogo.classList.add('flex-grow-1');
        headerLogo.style.marginRight = navbarToggler.offsetWidth + 'px';
    }
    else {
        return;
    }
}


// for focusing link when user is on it`s section
let link = document.querySelector('[href="#main"]');
let scrollListener1;
function navLinksFocusMonitoring() {
    for (let section of SECTIONS) {
        if (section.getBoundingClientRect().top < 30 && section.getBoundingClientRect().bottom > 0) {
            link = document.querySelector(`[href='#${section.id}']`);
            if(link){
                link.focus();
            }
        }
    }
}


// MAIN
function calculateMainHeight() {
    if (mainSection.querySelector('.container-xl').offsetHeight > window.innerHeight - header.offsetHeight) {
        return;
    }
    mainSection.style.height = window.innerHeight - header.offsetHeight + 'px';
}


// VIDEOS SECTION

// make slider
/*
I inserted two elements from the end, as if mirroring the line to create the effect of 
"the rightmost element comes from the left." I see 2 problems here from the point of 
view of code purity: 1) the number of elements doubles. 2) if the number of elements 
is odd, then it is tripled.
*/
let maxNum = videoRow.children.length;
let minNum = 1;
let mostLeft = 0;
let mostRight = 0;
let translateRatio;
if (window.innerWidth < 576) {
    translateRatio = 3;
}
else {
    translateRatio = 2.5
}
let mostLeftVideoCard;
let mostRightVideoCard;
let focusedVideoCard;
let videoCardWidth = null;
let video = null;

function addFocusOnVideoCard(card) {
    card.classList.remove('col-lg-4');
    card.classList.add('col-lg-5');
    card.classList.remove('col-md-6');
    card.classList.add('col-md-7');
    card.classList.remove('col-sm-7');
    card.classList.add('col-sm-8');
}
function removeFocusOnVideoCard(card) {
    card.classList.add('col-lg-4');
    card.classList.remove('col-lg-5');
    card.classList.add('col-md-6');
    card.classList.remove('col-md-7');
    card.classList.add('col-sm-7');
    card.classList.remove('col-sm-8');
}
function videoRowAnalysis() {
    for (let videoCard of videoCards) {
        if (videoCard.classList.contains('transition-none')) {
            videoCard.classList.remove('transition-none');
        }
        if (videoCard.classList.contains('js-begin-here')) {
            focusedVideoCard = videoCard;
            focusedVideoCard.classList.add('focus');
            addFocusOnVideoCard(focusedVideoCard);
            focusedVideoCard.classList.remove('js-begin-here');
        }
        if (!videoCardWidth) {
            videoCardWidth = videoCard.offsetWidth;
        }
        if (videoCard.getBoundingClientRect().right > mostRight) {
            mostRight = videoCard.getBoundingClientRect().right;
            mostRightVideoCard = videoCard;
        }
        if (videoCard.getBoundingClientRect().left < mostLeft) {
            mostLeft = videoCard.getBoundingClientRect().left;
            mostLeftVideoCard = videoCard;
        }
    }
}
function holdPanel() {
    videoRow.style.height = videoRow.offsetHeight + 'px';
}
function translateVideoRowWrapperOnIlussionCardsWidth() {
    videoRowWrapper.style.transform = `translateX(-${(translateRatio * videoCardWidth)}px)`;
}
// for resizing
function resetVideoRowHeight() {
    videoRow.style.height = '';
}

function toPrevVideoCard(multiplier = 1) {
    // to limit clicks
    videosSection.removeEventListener('click', videosSectionOnclick);
    // move
    videoRow.classList.remove('transition-none');
    videoRow.style.transform = `translateX(${videoCardWidth * multiplier}px)`;

    let currentElem = focusedVideoCard;
    let prevElem;
    for (let i = 0; i < multiplier; i++) {
        // focus
        focusedVideoCard.classList.remove('focus');
        prevElem = focusedVideoCard.previousElementSibling;
        let activeCircle = videosSection.querySelector(`[data-videonumind='${focusedVideoCard.dataset.videonum}']`);
        focusedVideoCard = prevElem;
        focusedVideoCard.classList.add('focus');
        // highlight circles
        activeCircle.classList.remove('active');
        let prevCircle = videosSection.querySelector(`[data-videonumind='${focusedVideoCard.dataset.videonum}']`);
        prevCircle.classList.add('active');
    }
    removeFocusOnVideoCard(currentElem);
    addFocusOnVideoCard(prevElem);


    setTimeout(() => {
        // for save translate illusion
        videoRow.classList.add('transition-none');
        // recalculation positions
        videoRow.style.transform = '';
        for (let i = 0; i < multiplier; i++) {
            videoRow.prepend(mostRightVideoCard);
            mostLeft = 0;
            mostRight = 0;
            videoRowAnalysis();
        }
        // to limit clicks
        videosSection.addEventListener('click', videosSectionOnclick);
        videoRow.ontransitionend = '';
        return;
    }, 400);

}
function toNextVideoCard(multiplier = 1) {
    // to limit clicks
    videosSection.removeEventListener('click', videosSectionOnclick);
    // move
    videoRow.classList.remove('transition-none');
    videoRow.style.transform = `translateX(-${videoCardWidth * multiplier}px)`;
    let currentElem = focusedVideoCard;
    let nextElem;
    for (let i = 0; i < multiplier; i++) {
        // focus      
        focusedVideoCard.classList.remove('focus');
        nextElem = focusedVideoCard.nextElementSibling;
        let activeCircle = videosSection.querySelector(`[data-videonumind='${focusedVideoCard.dataset.videonum}']`);
        focusedVideoCard = nextElem;
        focusedVideoCard.classList.add('focus');
        // highlight circles
        activeCircle.classList.remove('active');
        let nextCircle = videosSection.querySelector(`[data-videonumind='${focusedVideoCard.dataset.videonum}']`);
        nextCircle.classList.add('active');
    }
    removeFocusOnVideoCard(currentElem);
    addFocusOnVideoCard(nextElem);

    setTimeout(() => {

        // for save translate illusion
        videoRow.classList.add('transition-none');
        // recalculation positions
        videoRow.style.transform = '';
        for (let i = 0; i < multiplier; i++) {
            videoRow.append(mostLeftVideoCard);
            mostLeft = 0;
            mostRight = 0;
            videoRowAnalysis();
        }
        // to limit clicks
        videosSection.addEventListener('click', videosSectionOnclick);
        videoRow.ontransitionend = '';
        return;

    }, 400);
}
function videosSectionOnclick(event) {
    holdPanel();

    if (event.target.closest('.videos__play-video-btn')) {
        videosSection.removeEventListener('click', videosSectionOnclick);

        html.classList.add('overflow-y-hidden');
        modalWindow.classList.remove('d-none');
        let num = +focusedVideoCard.dataset.videonum;
        video = modalWindow.querySelector(`[data-videonum='${num}']`);
        video.classList.remove('d-none');

        videosSection.addEventListener('click', videosSectionOnclick);
        return;
    }
    if (event.target.closest('.slide-panel__to-prev-slide')) {
        toPrevVideoCard(1);
    }

    if (event.target.closest('.slide-panel__to-next-slide')) {
        toNextVideoCard(1);
    }

    if (event.target.closest('.slide-panel__indication-circle')) {
        videosSection.removeEventListener('click', videosSectionOnclick);

        let currentNum = +focusedVideoCard.dataset.videonum;
        let num = +event.target.dataset.videonumind;
        let n = num - currentNum;
        if (n == 0) {
            videosSection.addEventListener('click', videosSectionOnclick);
            return;
        }
        if (n < 0) {
            n = -n;
            toPrevVideoCard(n);
        }
        else {
            toNextVideoCard(n);
        }
    }

    if (event.target.closest('.videos__video-card')) {
        if (window.innerWidth < 576) return;
        videosSection.removeEventListener('click', videosSectionOnclick);

        let videoCard = event.target.closest('.videos__video-card');
        if (videoCard == focusedVideoCard) {
            videosSection.addEventListener('click', videosSectionOnclick);
            return;
        }
        let possibleVideoCard = focusedVideoCard;
        let left = videoCard.getBoundingClientRect().left;
        let possibleLeft = possibleVideoCard.getBoundingClientRect().left;
        let n = 0;
        if (left < possibleLeft) {
            while (videoCard != possibleVideoCard) {
                n++;
                possibleVideoCard = possibleVideoCard.previousElementSibling;
            }
            toPrevVideoCard(n);
        }
        else {
            while (videoCard != possibleVideoCard) {
                n++;
                possibleVideoCard = possibleVideoCard.nextElementSibling;
            }
            toNextVideoCard(n);
        }
    }
}
function videosSectionOnTouchDown(event) {
    if (event.target.closest('.videos__video-card')) {
        videoRow.classList.add('transition-none');
        if(!event.touches) return;
        let startX = event.touches[0].clientX;
        let startY = event.touches[0].clientY;
        let diffX;
        let diffY;
        function videoCardOnTouchMove(event) {
            let moveX = event.touches[0].clientX;
            let moveY = event.touches[0].clientY;
            diffX = (startX - moveX);
            diffY = (startY - moveY);
            if (Math.abs(diffY) >= Math.abs(diffX)) {
                document.removeEventListener('touchmove', videoCardOnTouchMove);
                return;
            }
            if (moveX < 0 || moveX > window.innerWidth) {
                return;
            }
            if (diffX < 0) {
                videoRow.style.transform = `translateX(${Math.abs(diffX)}px)`;
            }
            else {
                videoRow.style.transform = `translateX(-${diffX}px)`;
            }
        }
        document.addEventListener('touchmove', videoCardOnTouchMove);
        function swipe() {
            if (Math.abs(diffX) >= window.innerWidth / 2.5) {
                videosSection.removeEventListener('touchstart', videosSectionOnTouchDown);
                stopSlide();
                if (diffX < 0) toPrevVideoCard(1);
                else toNextVideoCard(1);
                setTimeout(() => {
                    videosSection.addEventListener('touchstart', videosSectionOnTouchDown);
                }, 400);
                return;
            }
            else stopSlide();
        }
        function stopSlide() {
            videoRow.classList.remove('transition-none');
            videoRow.style.transform = '';
            document.removeEventListener('touchmove', videoCardOnTouchMove);
            document.removeEventListener('touchend', swipe);
        }
        document.addEventListener('touchend', swipe);
    }
}


// PARTNERS SECTION
let partnersRowWay = null;
let startPartnersRowTranslate;
let partnersRowTranslate;
let rowWayDuration;
let rowWayAnimationTime;
let movingRowAnimation;
// let movingRowAnimationStopped = true;
let movingRowAnimationStart = false;
let movingRowAnimationStop = true;
function infinityMovingRow_Preload() {
    startPartnersRowTranslate = 0;
    partnersRowTranslate = 0;
    rowWayDuration = 5000;
    rowWayAnimationTime = 0
    partnersRowWay = partnersRow.scrollWidth + 10;
}

function stopMovingRow() {

    let promise = new Promise((resolve, reject) => {
        cancelAnimationFrame(movingRowAnimation);
        resolve();
    })

    promise.then(() => {
        startPartnersRowTranslate = partnersRowTranslate + startPartnersRowTranslate;
        rowWayDuration = rowWayDuration - rowWayAnimationTime;
        partnersRowTranslate = 0;

        window.removeEventListener('scroll', stopMovingRowByScroll);
        partnersRow.removeEventListener('click', stopMovingRow);
        partnersRow.addEventListener('click', infinityMovingRow);
        movingRowAnimationStop = true;
        movingRowAnimationStart = false;
    })
}
function infinityMovingRow() {
    if (movingRowAnimationStart && !movingRowAnimationStop) return;
    movingRowAnimationStop = false;
    movingRowAnimationStart = true;
    let start = performance.now();
    window.removeEventListener('scroll', infinityMovingRowByScroll);

    window.addEventListener('scroll', stopMovingRowByScroll);
    partnersRow.addEventListener('click', stopMovingRow);
    partnersRow.removeEventListener('click', infinityMovingRow);

    requestAnimationFrame(function infinityMovingRow(time) {
        rowWayAnimationTime = time - start;
        let timeFraction = rowWayAnimationTime / rowWayDuration;
        if (timeFraction > 1) timeFraction = 1;

        let progress = timeFraction;
        partnersRowTranslate = progress * (partnersRowWay / 2 - startPartnersRowTranslate);
        partnersRow.style.transform = `translateX(-${startPartnersRowTranslate + partnersRowTranslate}px)`;

        if (timeFraction < 1) {
            movingRowAnimation = requestAnimationFrame(infinityMovingRow);
        }
        else {
            partnersRow.style.transform = 'translateX(0px)';

            rowWayDuration = 5000;
            partnersRowTranslate = 0;
            startPartnersRowTranslate = 0;
            start = performance.now();
            requestAnimationFrame(infinityMovingRow);
        }
    })
}

function stopMovingRowByScroll() {
    if (partnersRow.getBoundingClientRect().top > window.innerHeight || partnersRow.getBoundingClientRect().bottom < 0) {
        stopMovingRow();
    }
}
function infinityMovingRowByScroll() {
    if (partnersRow.getBoundingClientRect().top < window.innerHeight && partnersRow.getBoundingClientRect().bottom > 0) {
        infinityMovingRow();
    }
}

// footer

function calculateFooterMapHeight() {
    if (window.innerHeight < 440) {
        footerMap.style.height = footerMap.offsetWidth * 0.4 + 'px';
        return;
    }
    if (window.innerWidth < 992 && window.innerWidth > 440) {
        footerMap.style.height = footerMap.offsetWidth * 0.5 + 'px';
        return;
    }
    footerMap.style.height = footerMap.offsetWidth + 'px';
}
// phone mask
for (let phoneInput of phoneInputs) {
    new IMask(phoneInput, {
        mask: "+{7} (000)000-00-00",
    });
};

// feedback
let startPageYOffset = null;
let feedbackAppearTimeout = null;
function feedbackAppear() {
    if (!startPageYOffset) startPageYOffset = window.pageYOffset;
    if (Math.abs(window.pageYOffset - startPageYOffset) >= 1.5 * window.innerHeight) {
        if (!feedbackAppearTimeout) {
            feedbackAppearTimeout = setTimeout(() => {
                document.removeEventListener('click', documentOnClick);
                setTimeout(() => {
                    document.addEventListener('click', documentOnClick);
                }, 2000);
                window.removeEventListener('scroll', feedbackAppear);
                header.classList.add('d-none');
                const feedbackForm = document.getElementById('feedback-form');
                const feedbackIntro = document.getElementById('feedback-intro');
                const feedbackSuccess = document.getElementById('feedback-success');
                const feedbackOk = document.getElementById('feedback-ok');
                const feedbackClose = document.getElementById('feedback-close');

                modalWindow.classList.remove('d-none');
                feedback.classList.remove('d-none');
                modalWindow.querySelector('.iframe-container').classList.add('d-none');
                html.classList.add('overflow-y-hidden');

                function closeFeedback() {
                    feedbackForm.classList.remove('d-none');
                    feedbackIntro.classList.remove('d-none');
                    feedbackSuccess.classList.add('d-none');
                    feedback.classList.add('d-none');
                    modalWindow.querySelector('.iframe-container').classList.remove('d-none');
                    modalWindow.classList.add('d-none');
                    header.classList.remove('d-none');
                    html.classList.remove('overflow-y-hidden');
                }
                feedbackClose.onclick = function () {
                    closeFeedback();
                    header.classList.remove('d-none');
                    feedbackClose.onclick = '';
                    feedbackForm.onsubmit = '';
                }
                feedbackForm.onsubmit = function () {
                    feedbackForm.classList.add('d-none');
                    feedbackIntro.classList.add('d-none');
                    feedbackSuccess.classList.remove('d-none');
                    feedbackOk.onclick = function () {
                        closeFeedback();
                        feedbackOk.onclick = '';
                    }
                    feedbackForm.onsubmit = '';
                    return false;
                }
            }, 3000);
        }
    }
}




function documentOnClick(event) {
    if (event.target == modalWindow) {
        // for videorow
        // translateRatio -= 0.1;
        // translateVideoRowWrapperOnIlussionCardsWidth();
        if (video) {
            let src = video.src;
            video.classList.add('d-none');
            video.src = '';
            video.src = src;
        }

        html.classList.remove('overflow-y-hidden');
        feedback.classList.add('d-none');
        header.classList.remove('d-none');
        modalWindow.querySelector('.iframe-container').classList.remove('d-none');
        modalWindow.classList.add('d-none');
        return;
    }
    if (event.target == mainScrollBtn) {
        window.scrollBy(0, mainSection.offsetHeight - window.pageYOffset);
    }
    if (event.target.closest('.js-nav-link')) {
        if (window.innerWidth >= 768) {
            window.removeEventListener('scroll', navLinksFocusMonitoring);
            event.preventDefault();
            let link = event.target.closest('.js-nav-link');
            let index = link.href.indexOf('#');
            let sectionId = link.href.slice(index + 1, link.href.length);
            let section = document.getElementById(sectionId);
            let promise = new Promise((resolve, reject) => {
                window.scrollTo(0, section.getBoundingClientRect().top + window.pageYOffset)
                window.removeEventListener('scroll', navLinksFocusMonitoring);
                resolve();
            })
            promise.then(() => {
                setTimeout(() => {
                    
                    return false;
                }, 1000);
            })
        }
        else {
            event.preventDefault();
            let link = event.target.closest('.js-nav-link');
            let index = link.href.indexOf('#');
            let sectionId = link.href.slice(index + 1, link.href.length);
            let section = document.getElementById(sectionId);
            headerNav.classList.add('opacity-0');
            headerNav.ontransitionend = backDefaultNavbar;
            let sectionY = section.getBoundingClientRect().top;
            /* I considered navbarToggler an indicator of a shift to a fixed cap 
            (so that it does not cover the section)*/
            window.scrollTo(0, sectionY + window.pageYOffset);
            return false;
        }
    }
    if (event.target.closest('#navbar-toggler')) {
        headerMobileNavbarBehaviour();
        return false;
    }
    return;
}

function windowOnLoad() {
    infinityMovingRow_Preload();
    window.addEventListener('scroll', infinityMovingRowByScroll);
}

calculateMainHeight();
calculateFooterMapHeight();




videoRowAnalysis();
translateVideoRowWrapperOnIlussionCardsWidth();

window.addEventListener('scroll', feedbackAppear);

if (window.innerWidth >= 768) {
    link.focus();
    window.addEventListener('scroll', navLinksFocusMonitoring);
}

else {
    window.addEventListener('load', windowOnLoad);
}

window.addEventListener('scroll', headerShrink);
videosSection.addEventListener('click', videosSectionOnclick);
if (window.innerWidth < 576) {
    videosSection.addEventListener('touchstart', videosSectionOnTouchDown);
}
document.addEventListener('click', documentOnClick);


// RESIZE
let version = '';
window.onresize = function () {
    window.removeEventListener('pointerdown', videosSectionOnTouchDown);
    window.removeEventListener('scroll', navLinksFocusMonitoring);
    window.removeEventListener('load', windowOnLoad);
    window.removeEventListener('scroll', stopMovingRowByScroll);
    window.removeEventListener('click', stopMovingRow);
    window.removeEventListener('load', windowOnLoad);
    partnersRow.removeEventListener('click', infinityMovingRow);
    // main
    mainSection.style.height = '';
    calculateMainHeight();
    // videos section
    videoRow.classList.remove('transition-none');
    resetVideoRowHeight();
    translateRatio = 2.5;
    if (window.innerWidth < 576) {
        translateRatio = 3;
        videosSection.addEventListener('pointerdown', videosSectionOnTouchDown);
    }
    else {
        videosSection.removeEventListener('pointerdown', videosSectionOnTouchDown);
    }
    videoCardWidth = null;
    for (let videoCard of videoCards) {
        videoCard.classList.add('transition-none');
        if (!videoCardWidth) videoCardWidth = videoCard.offsetWidth;
    }
    translateVideoRowWrapperOnIlussionCardsWidth();
    videoRowAnalysis();
    // footer
    calculateFooterMapHeight();

    if (window.innerWidth >= 768) {
        // FOR HEADER NAVBAR            
        if (headerNav.classList.contains('show')) backDefaultNavbar()
        else headerNav.classList.remove('opacity-0');
        // INCLUDING LINKS MONITORING FUNCTION
        window.addEventListener('scroll', navLinksFocusMonitoring);

        // partners                      
        cancelAnimationFrame(movingRowAnimation);
        partnersRow.style.transform = '';
        window.removeEventListener('scroll', stopMovingRowByScroll);
        window.removeEventListener('click', stopMovingRow);
        window.removeEventListener('load', windowOnLoad);
        partnersRow.removeEventListener('click', infinityMovingRow);
    }
    else {
        window.removeEventListener('scroll', navLinksFocusMonitoring);

        // partners
        infinityMovingRow_Preload();
        window.addEventListener('load', windowOnLoad);
    }
}