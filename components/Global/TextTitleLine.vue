<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
    default: "",
  },
});
</script>

<template>
  <section>
    <v-row>
      <v-col cols="12">
        <div class="d-flex flex-wrap justify-space-between align-center ga-4">
          <h3>{{ props.title }}</h3>
          <div v-if="$slots.actions">
            <slot name="actions"></slot>
          </div>
        </div>
        <v-divider class="mt-2"></v-divider>
      </v-col>
    </v-row>
  </section>
</template>
