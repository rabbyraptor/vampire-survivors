<template>
  <div class="bullet" :style="{ left: x + 'px', top: y + 'px' }">83</div>
</template>

<script>
export default {
  props: {
    x: {
      type: Number,
      default: null,
    },
    y: {
      type: Number,
      default: null,
    },
  },
};
</script>

<style>
.bullet {
  position: absolute;
  transform: translate(-50%, -50%);
}
</style>