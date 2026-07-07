<template>
	<div class="surface-ground min-h-screen">
		<div class="flex align-items-center justify-content-between px-5 surface-section shadow-2 border-bottom-1 surface-border bg-white" style="height: 60px">
			<router-link to="/">
				<img src="../assets/logo.svg" alt="Smsify" height="50" />
			</router-link>
			<router-link to="/" class="text-cyan-600 font-medium">Back to Dashboard</router-link>
		</div>
		<div class="px-4 py-6 md:px-6 lg:px-8 flex justify-content-center">
			<div class="surface-card p-5 shadow-2 border-round w-full" style="max-width: 60rem">
				<div class="text-900 font-medium text-4xl mb-2">Messaging Terms &amp; Conditions</div>
				<p class="text-600 line-height-3 mt-0 mb-5">Last updated: July 7, 2026</p>

				<div class="text-900 font-medium text-xl mb-2">1. Program Description</div>
				<p class="text-700 line-height-3 mb-4">
					Smsify enables organizations to send and receive SMS messages, including campaign
					messages, notifications, and replies, to recipients who have provided consent to
					receive them. By using Smsify or by opting in to receive messages from a sender
					using Smsify, you agree to these terms.
				</p>

				<div class="text-900 font-medium text-xl mb-2">2. Consent and Opt-In</div>
				<p class="text-700 line-height-3 mb-4">
					You will only receive messages if you have opted in by providing your phone number
					and agreeing to receive text messages. Consent is not a condition of any purchase.
					Senders using Smsify are responsible for obtaining and documenting recipient consent
					before sending any messages.
				</p>

				<div class="text-900 font-medium text-xl mb-2">3. Message Frequency</div>
				<p class="text-700 line-height-3 mb-4">
					Message frequency varies by program and sender. You may receive recurring messages,
					periodic campaign messages, or one-time notifications depending on the program you
					opted in to.
				</p>

				<div class="text-900 font-medium text-xl mb-2">4. Message and Data Rates</div>
				<p class="text-700 line-height-3 mb-4">
					Message and data rates may apply to messages sent and received. Rates are determined
					by your mobile carrier and plan. Contact your carrier for details about your
					messaging plan.
				</p>

				<div class="text-900 font-medium text-xl mb-2">5. Opting Out</div>
				<p class="text-700 line-height-3 mb-4">
					You can cancel messages at any time by replying <span class="font-medium">STOP</span>.
					After you send STOP, you will receive one final message confirming that you have been
					unsubscribed, and no further messages will be sent to you unless you opt in again.
				</p>

				<div class="text-900 font-medium text-xl mb-2">6. Help</div>
				<p class="text-700 line-height-3 mb-4">
					If you are experiencing issues or need assistance, reply <span class="font-medium">HELP</span>
					to any message, or contact the sender directly using the contact information they provided.
				</p>

				<div class="text-900 font-medium text-xl mb-2">7. Carrier Disclaimer</div>
				<p class="text-700 line-height-3 mb-4">
					Mobile carriers are not liable for delayed or undelivered messages. Message delivery
					is subject to effective transmission from your carrier and network availability.
				</p>

				<div class="text-900 font-medium text-xl mb-2">8. Privacy</div>
				<p class="text-700 line-height-3 mb-4">
					Phone numbers and messaging data are used solely to deliver the messaging services
					described above. No mobile information will be shared with third parties or
					affiliates for marketing or promotional purposes.
				</p>

				<div class="text-900 font-medium text-xl mb-2">9. Changes to These Terms</div>
				<p class="text-700 line-height-3 mb-0">
					We may update these terms from time to time. Continued use of the service after
					changes take effect constitutes acceptance of the revised terms.
				</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'TermsAndConditions',
});
</script>
