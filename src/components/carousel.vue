<template>
    <swiper v-if="imageSort.length > 0" ref="mySwiper" :options="swiperOption">
        <swiper-slide :key="index" v-for="(img, index) in imageSort">
            <img :src="img.url" />
        </swiper-slide>
        <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>
        <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
    data() {
        return {
            seiper: {},
            swiperOption: {
                notNextTick: true,
                loop: true,
                autoplay: {
                    delay: 2000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                },
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                },
                observer: true,
                observeParents: true,
            },
        };
    },
    computed: {
        ...mapGetters(['imageSort']),
        // swiper() {
        //     return this.$refs.mySwiper.$swiper;
        // },
    },
    methods: {
        ...mapActions(["getIdList"])
    },
    created() {
        this.getIdList();
    },

  mounted() {
    // console.log("Current Swiper instance object", this.swiper);
  },
};
</script>

<style scoped>

img {
    width: 70%;
}

.swiper-slide {
    text-align: center;
}

</style>
