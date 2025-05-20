<script setup lang="ts">
import type { PrivacyPolicyProps } from '../types';

defineOptions({
    name: 'PrivacyPolicy'
})

const { service, privacy } = defineProps<PrivacyPolicyProps>() 
</script>

<template>
    <div
        class="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a :href="service || '#'" rel="noopener noreferrer"
            aria-label="Read our Terms of Service">Terms of Service</a>
        and <a :href="privacy || '#'" rel="noopener noreferrer" aria-label="Read our Privacy Policy">Privacy Policy</a>.
    </div>
</template>
