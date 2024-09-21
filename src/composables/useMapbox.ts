// this will be the composable for the mapbox
import mapboxgl from 'mapbox-gl'
import { ref } from 'vue'

export function useMap(mapContainer, onMapLoad, ctx) {
    const mapVisibility = ref('hidden')
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

    const createMap = () => {
        const deck = false
        const map = new mapboxgl.Map({
            container: mapContainer,
            style: 'mapbox://styles/harhs-jain17/clwrhk00t014j01po14h34awz',
            center: [0, 0],
            zoom: 2,
            pitch: 0,
            bearing: 0,
            projection: 'globe'
        })

        // style.load will happen before load
        map.on('style.load', () => {
            console.log('the style has loaded bitches')
            ctx.emit('load-map', map)

            if (deck) {
                console.log()
            } else {
                // need to check if we can do box zoom above the deck.gl layer
                map.boxZoom.enable()
                map.resize()
            }
        })

        map.on('load', () => {
            ctx.emit('init-map')
            mapVisibility.value = 'visible'
            onMapLoad()
            map.addControl(new mapboxgl.ScaleControl())
            map.addControl(
                new mapboxgl.NavigationControl({ showCompass: false, showZoom: false }),
                'top-left'
            )
            // map.addControl(new mapboxgl.FullscreenControl({ container: mapContainer }))
        })

        return map
    }

    return {
        createMap,
        mapVisibility
    }
}
