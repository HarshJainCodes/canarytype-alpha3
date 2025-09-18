import { Deck, _GlobeView } from 'deck.gl';
import { onMounted, onUnmounted } from 'vue';

export function useDeckGL(deckCanvasId, ctx) {
	const preventOpenContextMenu = (e) => {
		e.preventDefault();
	};

	const createDeck = (mapboxMap) => {
		console.log('inside deck composable: received mapbox', mapboxMap);
		const deck = new Deck({
			canvas: deckCanvasId,
			initialViewState: {
				latitude: 0,
				longitude: 0,
				zoom: 2,
				minZoom: 2,
				maxZoom: 18,
			},
			views: new _GlobeView(),
			controller: true,
			onViewStateChange: ({ viewState, interactionState }) => {
				deck.setProps({ viewState });
				mapboxMap.jumpTo({
					center: [viewState.longitude, viewState.latitude],
					zoom: viewState.zoom,
				});

				if (interactionState.isZooming) {
					ctx.emit('zoom', viewState.zoom);
				}
			},
		});

		return deck;
	};

	onMounted(() => {
		document
			.getElementById(deckCanvasId)
			.addEventListener('contextmenu', preventOpenContextMenu);
	});

	onUnmounted(() => {
		document
			.getElementById(deckCanvasId)
			.removeEventListener('contextmenu', preventOpenContextMenu);
	});

	return {
		createDeck,
	};
}
