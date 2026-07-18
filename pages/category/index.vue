<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});



</script>

<template>
    <section style="height: 100vh;" >
        <div >
             <Category/>
            
        </div>
    </section>
</template>