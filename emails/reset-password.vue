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
        >Reset Your Password</EHeading
      >
      <ESection>
        <EText class="font-lato"
          >Hi {{ user }}, click the link below to reset your password.</EText
        >

        <ELink
          class="link"
          :href="token"
          >Reset Password</ELink
        >
      </ESection>
    </EContainer>
  </ETailwind>
</template>
