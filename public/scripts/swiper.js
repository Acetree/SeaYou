var swiperShow = new Swiper('#sea-swiper', {
    slidesPerView: 'auto',
    watchSlidesProgress: true,
    slidesOffsetBefore: (windowWidth - 300) / 2,
    slidesOffsetAfter: (windowWidth - 300) / 2,
    spaceBetween: 60,
    resistanceRatio: 1,
    controller: {

    },
    on: {
        progress: function (progress) {
            for (i = 0; i < this.slides.length; i++) {
                slide = this.slides.eq(i);
                slideProgress = this.slides[i].progress;
                prevIndent = 0.5;
                // if (i == 4) {
                //     prevIndent = 0.3228;
                // } else {
                //     prevIndent = 0.0898;
                // }

                if (Math.abs(slideProgress + prevIndent) < 1) {
                    // scale = (1 - Math.abs(slideProgress + prevIndent)) * 0.1 + 1
                    scale = (1 - Math.abs(slideProgress + prevIndent)) * 0.5 + 1;
                } else {
                    scale = 1;
                }

                slide.find('#sea-swiper .sea-shell-block').transform('scale3d(' + scale + ',' + scale + ',1)');
            }
        },
        setTransition: function (transition) {
            for (var i = 0; i < this.slides.length; i++) {
                var slide = this.slides.eq(i)
                slide.find('#sea-swiper .sea-shell-block').transition(transition);
            }

        },

        touchEnd: function () {

        }
    },
});