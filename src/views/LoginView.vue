<template>
	<login-page-v2
		website-name="Canary Type"
		mini-title="typing arena and save results"
		:google-client-id="googleClientId"
		@on-google-authenticated="onGoogleAuthenticated"
		@on-send-verification-code="onClickSendVerificationCode"
	></login-page-v2>
</template>

<script setup lang="ts">
import { useUserDetailsStore } from '@/stores/userDetails';
import { useRouter } from 'vue-router';
import { TYPE, useToast } from 'vue-toastification';
import type { CallbackTypes } from 'vue3-google-login';
import { LoginPageV2 } from 'corecomponentshj';

const router = useRouter();
const userDetails = useUserDetailsStore();
const toast = useToast();

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const onGoogleAuthenticated: CallbackTypes.TokenResponseCallback = async (res) => {
	const google_jwt = res.access_token;

	const googleLoginCall = await fetch(
		'https://canarytype-alpha3.azurewebsites.net/api/GoogleLogin',
		{
			// 'https://localhost:7161/api/GoogleLogin', {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify({
				idToken: google_jwt,
			}),
			credentials: 'include',
		},
	);

	const response = await googleLoginCall.json();

	if (googleLoginCall.status === 200) {
		userDetails.setIsLoggedIn(true);
		userDetails.userName = response.userName;
		userDetails.uniqueUserName = response.uniqueUserName;
		router.push('TypingArena');
	}
};

const onClickSendVerificationCode = () => {
	toast('This feature is under development. Please use google login for now', {
		type: TYPE.WARNING,
	});
};
</script>

<style scoped>
.login-custom-class:hover {
	cursor: pointer;
}
</style>
