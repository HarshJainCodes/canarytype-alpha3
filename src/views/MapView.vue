<template>
    <div id="map-container" class="w-100 h-100 position-absolute" :style="{'beforeLoadingMap': mapVisibility === 'hidden'}">
    </div>
    <canvas id="deck-canvas" class="w-100 h-100 z-index-1">
    </canvas>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { useMap } from '@/composables/useMapbox';
import { useDeckGL } from '@/composables/useDeckgl';

export default defineComponent({
    setup(props, context) {
        const { createMap, mapVisibility } = useMap('map-container', () => {
            console.log('map has been loaded bitches')
        }, context);

        const { createDeck } = useDeckGL('deck-canvas', context);

        const mapboxElement = ref(null);
        const deckElement = ref(null);

        onMounted(() => {
            mapboxElement.value = createMap();
            deckElement.value = createDeck(mapboxElement.value);
        })

        return {
            mapboxElement,
            deckElement,
            mapVisibility,
        }
    },
})
</script>

<style scoped>
.beforeLoadingMap {
    display: none
}
</style>