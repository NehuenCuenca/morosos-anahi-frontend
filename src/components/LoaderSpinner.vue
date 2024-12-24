<template>
    <div class="spinner"></div>
</template>

<script setup></script>

<style scoped>
.spinner {
   width: 40px;
   height: 40px;
   border-radius: 50%;
   border: 6.4px solid;
   border-color: #d9d9d9;
   border-right-color: #483434;
   animation: spinner-d3wgkg 0.8s infinite linear;
}

@keyframes spinner-d3wgkg {
   to {
      transform: rotate(1turn);
   }
}
</style>