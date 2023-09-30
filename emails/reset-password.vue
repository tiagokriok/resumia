<script setup>
  defineProps({
    user: String,
    token: String,
  })
</script>
<template>
  <ETailwind>
    <EContainer class="font-lato">
      <EHeading
        as="h1"
        class="font-lato text-xl font-extrabold"
        >{{ $t('emails.resetPassword.title') }}</EHeading
      >
      <ESection>
        <EText class="font-lato">{{
          $t('emails.resetPassword.description')
        }}</EText>

        <ELink
          class="link"
          :href="token"
          >{{ $t('emails.resetPassword.link') }}</ELink
        >
      </ESection>
    </EContainer>
  </ETailwind>
</template>
